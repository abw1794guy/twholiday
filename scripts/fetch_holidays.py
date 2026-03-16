#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
行政院人事行政總處「政府行政機關辦公日曆表」監控爬蟲

用途：定期抓取 DGPA 公告之連假與補班資訊，產出符合 data/holidays.json
      Schema 的 JSON，供 taiwan.holiday.tw 網站使用。

資料來源：https://www.dgpa.gov.tw → 辦公日曆表 (informationlist?uid=41)

使用方式：
  python fetch_holidays.py                    # 僅爬取並列印，不寫入
  python fetch_holidays.py --output ../data/holidays.json   # 寫入專案 data
  python fetch_holidays.py --merge --output ../data/holidays.json  # 與現有 JSON 合併後寫入

CI 建議：每月或每年執行一次，檢查是否有新年度公告。
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import datetime
from pathlib import Path
from urllib.parse import urljoin, urlparse

try:
    import requests
    from bs4 import BeautifulSoup
    try:
        import urllib3
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    except Exception:
        pass
except ImportError:
    print("請先安裝依賴：pip install -r scripts/requirements.txt", file=sys.stderr)
    sys.exit(1)

# ---------------------------------------------------------------------------
# 設定
# ---------------------------------------------------------------------------
DGPA_BASE = "https://www.dgpa.gov.tw"
CALENDAR_LIST_URL = "https://www.dgpa.gov.tw/informationlist?uid=41"  # 辦公日曆表
USER_AGENT = "Mozilla/5.0 (compatible; taiwan-holiday-tw/1.0; +https://taiwan.holiday.tw)"
# 若列表頁抓不到年度連結，可由此直接指定公告頁（依人事總處實際公告增修）
FALLBACK_YEAR_URLS: dict[str, str] = {
    "2026": "https://www.dgpa.gov.tw/information?pid=12574&uid=41",
}

# 節日名稱對應：從公告常用用詞對到本站 id、英文名、預設推薦行程
HOLIDAY_NAME_MAP = {
    "春節": ("lunar-new-year", "Lunar New Year", ["日本賞雪溫泉", "東南亞海島避寒", "國內環島"]),
    "農曆春節": ("lunar-new-year", "Lunar New Year", ["日本賞雪溫泉", "東南亞海島避寒", "國內環島"]),
    "和平紀念日": ("peace-memorial", "Peace Memorial Day", ["中部賞櫻", "離島小旅行", "北台灣步道"]),
    "228": ("peace-memorial", "Peace Memorial Day", ["中部賞櫻", "離島小旅行", "北台灣步道"]),
    "兒童節": ("qingming", "Children's Day & Qingming", ["掃墓＋踏青", "花東縱谷", "墾丁春遊"]),
    "清明": ("qingming", "Children's Day & Qingming", ["掃墓＋踏青", "花東縱谷", "墾丁春遊"]),
    "清明節": ("qingming", "Children's Day & Qingming", ["掃墓＋踏青", "花東縱谷", "墾丁春遊"]),
    "勞動節": ("labor-day", "Labor Day", ["宜蘭礁溪", "南投清境", "嘉義阿里山"]),
    "端午節": ("dragon-boat", "Dragon Boat Festival", ["龍舟觀賽", "離島澎金馬", "東部海岸"]),
    "端午": ("dragon-boat", "Dragon Boat Festival", ["龍舟觀賽", "離島澎金馬", "東部海岸"]),
    "中秋節": ("mid-autumn", "Mid-Autumn Festival", ["烤肉露營", "賞月景點", "花東夜宿"]),
    "中秋": ("mid-autumn", "Mid-Autumn Festival", ["烤肉露營", "賞月景點", "花東夜宿"]),
    "教師節": ("mid-autumn", "Mid-Autumn Festival", ["烤肉露營", "賞月景點", "花東夜宿"]),
    "孔子誕辰": ("mid-autumn", "Mid-Autumn Festival", ["烤肉露營", "賞月景點", "花東夜宿"]),
    "國慶日": ("national-day", "National Day", ["國慶煙火", "北部近郊", "中部山線"]),
    "國慶": ("national-day", "National Day", ["國慶煙火", "北部近郊", "中部山線"]),
    "臺灣光復": ("retrocession", "Taiwan Retrocession Day", ["金門戰地文化", "馬祖藍眼淚季末", "本島秋遊"]),
    "光復節": ("retrocession", "Taiwan Retrocession Day", ["金門戰地文化", "馬祖藍眼淚季末", "本島秋遊"]),
    "行憲紀念日": ("constitution", "Constitution Day", ["聖誕市集", "跨年暖身", "溫泉之旅"]),
    "行憲": ("constitution", "Constitution Day", ["聖誕市集", "跨年暖身", "溫泉之旅"]),
}


def session(verify_ssl: bool = True) -> requests.Session:
    s = requests.Session()
    s.verify = verify_ssl
    s.headers.update({"User-Agent": USER_AGENT, "Accept-Language": "zh-TW,zh;q=0.9,en;q=0.8"})
    return s


def fetch_list(s: requests.Session) -> list[dict]:
    """抓取辦公日曆表列表，回傳 [{year, url, title}, ...]"""
    r = s.get(CALENDAR_LIST_URL, timeout=15)
    r.raise_for_status()
    r.encoding = r.apparent_encoding or "utf-8"
    soup = BeautifulSoup(r.text, "lxml")
    entries = []
    # 列表通常為連結 + 標題，標題常含「114年」「115年」或「西元2025年」「西元2026年」
    for a in soup.select("a[href*='information?pid=']"):
        href = a.get("href") or ""
        title = (a.get_text() or "").strip()
        if not title or len(title) < 5:
            continue
        # 只保留與辦公日曆／放假相關的連結（標題常含年、日曆、辦公、放假、核定等）
        if not re.search(r"\d{3,4}\s*年|日曆|辦公|放假|核定", title):
            continue
        full_url = urljoin(DGPA_BASE, href)
        # 擷取西元年
        m = re.search(r"(\d{4})\s*年", title)
        if m:
            entries.append({"year": m.group(1), "url": full_url, "title": title})
        # 也抓民國年轉西元
        m2 = re.search(r"(\d{3})\s*年", title)
        if m2:
            roc = int(m2.group(1))
            ad = roc + 1911
            if 2024 <= ad <= 2030:
                entries.append({"year": str(ad), "url": full_url, "title": title})
    # 依年份去重（同一則公告可能同時匹配 115年 與 2026年）
    seen = set()
    out = []
    for e in entries:
        key = (e["year"], e["url"])
        if key in seen:
            continue
        seen.add(key)
        out.append(e)
    return sorted(out, key=lambda x: (x["year"], x["url"]))


def parse_announcement_content(s: requests.Session, url: str) -> tuple[str, list[str]]:
    """
    抓取單則公告頁面，回傳 (內文純文字, 附件連結列表)。
    內文用來用 regex 抽「連續假期（N日）」與補班／補假說明。
    """
    r = s.get(url, timeout=15)
    r.raise_for_status()
    r.encoding = r.apparent_encoding or "utf-8"
    soup = BeautifulSoup(r.text, "lxml")
    # 主內容區：依 DGPA 版型可能是 .content, #content, article 等
    # 人事總處版型：主文可能在 .content, #content, .cp_content, article 等
    main = (
        soup.find("div", class_=re.compile("content|article|main|post|cp_")) or
        soup.find("div", id=re.compile("content|main|article")) or
        soup.find("article") or
        soup.body
    )
    text = main.get_text(separator="\n", strip=True) if main else soup.get_text(separator="\n", strip=True)
    links = []
    for a in soup.select("a[href]"):
        h = a.get("href", "")
        if "FileConversion" in h or h.endswith(".pdf") or h.endswith(".xls") or h.endswith(".xlsx"):
            links.append(urljoin(DGPA_BASE, h))
    return text, links


def parse_month_day(s: str) -> tuple[int, int] | None:
    """解析「M月D日」或「M/D」回 (month, day)，失敗回 None。"""
    m = re.search(r"(\d{1,2})\s*[月/]\s*(\d{1,2})\s*日?", s)
    if m:
        return int(m.group(1)), int(m.group(2))
    return None


def extract_holidays_from_text(text: str, year: str) -> list[dict]:
    """
    從公告內文用 regex 抽出連續假期名稱與天數，產出符合本站 Schema 的假日列表。
    若內文有「X月X日至X月X日」則一併填入 dateStart/dateEnd。
    """
    results = []
    # 範例：「農曆春節假期（9日）」「兒童節及清明節（4日）」「端午節（3日）」
    # 括號可能為全形（ ）或半形( )
    pattern = re.compile(
        r"([^\s、，。]+?(?:節|紀念日|假期|日)?)\s*[（(]\s*(\d+)\s*日\s*[）)]",
        re.UNICODE,
    )
    for m in pattern.finditer(text):
        name_part = m.group(1).strip()
        days = int(m.group(2))
        # 對應到本站 id / nameEn
        slug = None
        name_en = None
        suggestions = []
        for key, (s, en, sug) in HOLIDAY_NAME_MAP.items():
            if key in name_part:
                slug = s
                name_en = en
                suggestions = sug
                break
        if not slug:
            # 未知節日仍可加入，用簡化 id
            slug = re.sub(r"[^\w\-]", "", name_part)[:30] or "other"
            name_en = name_part
            suggestions = ["國內旅遊", "近郊踏青"]
        # 同一則公告同一年可能出現同一節日一次（如「中秋節及孔子誕辰紀念日（4日）」）
        if any(r.get("id") == f"{slug}-{year}" for r in results):
            continue
        item_id = f"{slug}-{year}"
        # 顯示名稱：去掉常見前綴（分別為、計有、及、與）
        display_name = re.sub(r"^(分別為|計有|及|與)\s*", "", name_part).strip() or name_part
        if "兒童節" in name_part and "清明" not in name_part:
            display_name = "兒童節／清明節"
        elif "中秋" in name_part and "教師" in name_part:
            display_name = "中秋節／教師節"
        elif "臺灣光復" in name_part or "金門" in name_part:
            display_name = "台灣光復節"
        elif "和平" in name_part:
            display_name = "和平紀念日（228）"
        is_single = days == 1
        if is_single:
            best_plan = f"單日假：{year} 年無連假，可依需求請假搭配週末"
        else:
            best_plan = f"免請假：連休 {days} 天（實際日期依行政院公告）"
        # 精確 dateStart/dateEnd 需從附表 PDF/Excel 或人工對照公告補齊；合併時會保留現有 JSON 的日期
        results.append({
            "id": item_id,
            "name": display_name,
            "nameEn": name_en,
            "dateStart": "",
            "dateEnd": "",
            "days": days,
            "isSingleDay": is_single,
            "makeUpWorkNote": None,
            "best_leave_plan": best_plan,
            "travel_suggestions": suggestions,
        })
    # 補班／補假說明：只擷取「內文」中含補假／補班／補行的句子（避開頁首導覽）
    make_up_sentences = re.findall(r"[^。]*補(?:假|班|行)[^。]*。?", text)
    make_up_note = None
    for s in make_up_sentences:
        s = s.strip()
        if len(s) > 15 and "現在位置" not in s and ":::" not in s:
            make_up_note = s[:200] if len(s) > 200 else s
            break
    if make_up_note and results:
        for r in results:
            if r.get("makeUpWorkNote") is None:
                r["makeUpWorkNote"] = make_up_note
    return results


def merge_with_existing(scraped_by_year: dict[str, list], existing_path: Path) -> dict:
    """
    讀取現有 data/holidays.json，以爬到的年度資料補充或覆寫，保留現有欄位（如 dateStart/dateEnd）若爬蟲未提供。
    """
    if not existing_path.exists():
        return {"meta": _default_meta(), "years": scraped_by_year}
    with open(existing_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    meta = data.get("meta", {})
    meta["lastUpdated"] = datetime.now().strftime("%Y-%m-%d")
    meta["updateNote"] = meta.get("updateNote", "") + " 曾透過 scripts/fetch_holidays.py 更新。"
    years = data.get("years", {})
    for y, list_ in scraped_by_year.items():
        existing_list = years.get(y, [])
        by_id = {e["id"]: e for e in existing_list}
        for item in list_:
            eid = item["id"]
            if eid in by_id:
                # 保留既有 dateStart/dateEnd 等，僅更新 days / makeUpWorkNote 等可從公告推得的
                for k in ("days", "makeUpWorkNote", "best_leave_plan"):
                    if item.get(k):
                        by_id[eid][k] = item[k]
            else:
                by_id[eid] = item
        years[y] = list(by_id.values())
    return {"meta": meta, "years": years}


def _default_meta() -> dict:
    return {
        "source": "行政院人事行政總處政府行政機關辦公日曆表",
        "lastUpdated": datetime.now().strftime("%Y-%m-%d"),
        "updateNote": "可透過 scripts/fetch_holidays.py 監控行政院公告自動更新。",
    }


def main() -> int:
    ap = argparse.ArgumentParser(description="抓取行政院人事行政總處辦公日曆表，產出 holidays JSON")
    ap.add_argument("--output", "-o", type=Path, help="寫入的 JSON 路徑（若未指定則只列印）")
    ap.add_argument("--merge", action="store_true", help="與現有 data/holidays.json 合併後再寫入")
    ap.add_argument("--years", default="2026,2027", help="要處理的年份（逗號分隔），預設 2026,2027")
    ap.add_argument("--insecure", action="store_true", help="略過 SSL 憑證驗證（若政府網站憑證異常時使用）")
    ap.add_argument("--verbose", "-v", action="store_true", help="印出抓取內容長度與片段，方便除錯")
    args = ap.parse_args()
    target_years = set(y.strip() for y in args.years.split(",") if y.strip())

    s = session(verify_ssl=not args.insecure)
    try:
        list_entries = fetch_list(s)
    except Exception as e:
        print(f"抓取列表失敗: {e}", file=sys.stderr)
        return 1

    scraped: dict[str, list] = {}
    for entry in list_entries:
        y = entry["year"]
        if target_years and y not in target_years:
            continue
        print(f"處理 {y} 年: {entry['title'][:50]}...", file=sys.stderr)
        try:
            text, _links = parse_announcement_content(s, entry["url"])
            if args.verbose:
                print(f"  內文長度: {len(text)} 字", file=sys.stderr)
                print(f"  片段: {text[:300]}...", file=sys.stderr)
            items = extract_holidays_from_text(text, y)
            if items:
                scraped[y] = items
                print(f"  解析到 {len(items)} 個連假", file=sys.stderr)
        except Exception as e:
            print(f"  解析失敗: {e}", file=sys.stderr)

    # 若列表未抓到任何年度，嘗試備援 URL
    if not scraped and target_years:
        for y in target_years:
            if y in FALLBACK_YEAR_URLS:
                url = FALLBACK_YEAR_URLS[y]
                print(f"使用備援 URL 處理 {y} 年: {url}", file=sys.stderr)
                try:
                    text, _ = parse_announcement_content(s, url)
                    if args.verbose:
                        print(f"  內文長度: {len(text)} 字", file=sys.stderr)
                        print(f"  片段: {text[:400]}...", file=sys.stderr)
                    items = extract_holidays_from_text(text, y)
                    if items:
                        scraped[y] = items
                        print(f"  解析到 {len(items)} 個連假", file=sys.stderr)
                except Exception as e:
                    print(f"  失敗: {e}", file=sys.stderr)
    if not scraped:
        print("未解析到任何年度資料，請檢查網站結構或手動更新 data/holidays.json。", file=sys.stderr)
        return 0

    if args.merge and args.output and args.output.exists():
        out_data = merge_with_existing(scraped, args.output)
    else:
        out_data = {"meta": _default_meta(), "years": scraped}

    out_json = json.dumps(out_data, ensure_ascii=False, indent=2)
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(out_json)
        print(f"已寫入 {args.output}", file=sys.stderr)
    else:
        print(out_json)
    return 0


if __name__ == "__main__":
    sys.exit(main())
