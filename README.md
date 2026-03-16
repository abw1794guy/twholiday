# taiwan.holiday.tw — 台灣國定假日請假攻略

2026–2027 台灣最強請假攻略（免補班版）。Next.js 14 (App Router) + Tailwind CSS。

## 開發

```bash
npm install
npm run dev
```

## 建置

```bash
npm run build
npm start
```

## 如何測試

### 1. 測試網站（Next.js）

```bash
npm run dev
```

瀏覽器開啟 **http://localhost:3000**，確認：

- 頂部有「2026-2027 台灣最強請假攻略（免補班版）」標題
- 可切換 2026 / 2027 年
- 每個假期卡片有節日名稱、日期、天數、綠色攻略標籤、推薦行程
- 長假卡片下方有「贊助商內容：推薦行程」區塊

**建置測試**（確認無編譯錯誤）：

```bash
npm run build
```

### 2. 測試 Python 爬蟲

```bash
cd scripts
pip install -r requirements.txt
python fetch_holidays.py --years 2026 --insecure
```

有輸出 JSON 且內含 `"years": { "2026": [ ... ] }` 即表示爬蟲正常。若要寫入並與現有資料合併：

```bash
python fetch_holidays.py --merge --output ../data/holidays.json --insecure
```

## 資料更新

- 核心資料：`data/holidays.json`
- 來源：行政院人事行政總處政府行政機關辦公日曆表
- **Python 爬蟲**（監控行政院公告、產出/合併 JSON）：
  ```bash
  cd scripts && pip install -r requirements.txt
  python fetch_holidays.py                        # 僅列印，不寫入
  python fetch_holidays.py -o ../data/holidays.json --merge   # 與現有 JSON 合併後寫入
  python fetch_holidays.py --years 2026,2027 --insecure -v   # 憑證異常時用 --insecure；-v 除錯
  ```
  - `--merge`：保留現有 `dateStart`/`dateEnd` 等欄位，只更新天數與補班備註。
  - 若環境連線政府網站發生 SSL 錯誤，可加 `--insecure`（僅建議在信任網路下使用）。

## 技術規格

- **CSS**: Tailwind CSS (grid / flex)
- **Icons**: lucide-react
- **Fonts**: Noto Sans TC（優先）、Inter
- **SEO**: Metadata、Schema.org Dataset / Table JSON-LD
