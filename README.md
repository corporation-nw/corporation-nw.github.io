# Corporation NW 本体サイト（公開前プレビュー）

有限会社シン・ワールド（Corporation NW）の会社サイトです。`cnw2026.com` で公開し、3つの事業のLPを配下に置きます。

| URL | 中身 | 元のフォルダ |
|---|---|---|
| `/` | 本体（日本語） | `cnw-corporate/site/` |
| `/zh-tw/` | 本体（繁體中文） | `cnw-corporate/site/zh-tw/` |
| `/mobile/` | NW Mobile | `kaeru-lp/site/` |
| `/agent/` ・ `/agent/zh-tw/` | NW agent | `nw-agent/site/` |
| `/tonaritabi/` ・ `/tonaritabi/zh-tw/` | となり旅 | `tonari-tabi/site/` |

## 公開前の状態について

- **検索よけ:** `robots.txt` と `<meta name="robots" content="noindex, nofollow">` で検索エンジンに載らないようにしています。

## ファイル

- `index.html` — 日本語版（スマホ・PC両対応）
- `zh-tw/index.html` — 繁體中文版。**直接編集せず**、日本語版を直してから、制作用フォルダの `cnw-corporate/tools/build_zh.py` で作り直す
- `privacy/index.html` ・ `zh-tw/privacy/index.html` — プライバシーポリシー（4サイト共通）
- `css/style.css` / `js/main.js` — 両言語で共通
- `images/` — レンズの動画と静止画、製品画像、拠点の地図（日本語用・繁體中文用）
- `robots.txt` — 検索よけ

## 手元での確認

本体と3事業を、公開時と同じURL構成でまとめて表示できます（制作用フォルダで実行）。

```bash
python3 cnw-corporate/tools/serve_preview.py
```

`/Users/newworld/Web` で実行し、http://localhost:8770/ を開きます。
