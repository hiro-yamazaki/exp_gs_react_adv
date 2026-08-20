# exp_gs_react_adv

G's Academy **EXP React 上級（Next.js）** の制作物リポジトリ。
お題は『AI プレゼン / 面接 練習コーチ』。Webカメラで練習 → 表情＋発話をAIが解析 → コーチング＆音声読み上げ → 履歴を保存 → レポート配信、までを5日間でフルスタックに作る。

## 構成

| 項目 | 採用 |
|---|---|
| フレームワーク | Next.js 16（App Router） |
| 言語 | TypeScript |
| スタイル | Tailwind CSS v4 |
| Lint | ESLint（eslint-config-next） |
| ディレクトリ | `src/` あり／エイリアス `@/*` |

## 動かし方

```bash
npm install      # 初回のみ
npm run dev      # http://localhost:3000
```

## 環境変数

`.env.local.example` をコピーして `.env.local` を作り、キーを入れる。

```bash
cp .env.local.example .env.local
```

`.env*` は `.gitignore` 済み。**APIキーは絶対にコミットしない。**

## 講座の進行と、この repo に足していくもの

| DAY | 日程 | この repo に増えるもの |
|---|---|---|
| DAY1 | 8/23(日) 9:30-12:30 | `src/app/api/**/route.ts`（自作API）／Groq連携／Tailwind でUI |
| DAY2 | 8/30(日) 9:30-12:30 | getUserMedia・face-api（表情）／MediaRecorder＋Whisper（`/api/transcribe`）／SpeechSynthesis |
| DAY3 | 9/6(日) 9:30-12:30 | GitHubへpush／Neon＋Drizzle（スキーマ・マイグレーション）／CRUD API／`/history/[id]` |
| DAY4 | 9/13(日) 9:30-12:30 | Clerk認証／API保護／メール配信／Vercel本番デプロイ／`/share/[id]` |
| DAY5 | 9/27(日) 9:30-12:30 | 最終ブラッシュアップ＋成果発表（※9/20は講義なし） |

## 宿題（毎週、次回講義の前提）

- **DAY1 →** ①フィードバックのお題・質問を増やす（手書き） ②UIをTailwindで整える（手書き） ③Claudeにコードレビュー依頼→気づき1つ（AI可）
- **DAY2 →** ①表情スコアの見せ方を工夫（手書き） ②制作物のテーマ決め（DAY3で中間発表） ③良かったプロンプトを記録（AI可）
- **DAY3 →** ①履歴UIの改善（手書き） ②スキーマに項目追加（手書き） ③AIに設計レビュー（AI可）
- **DAY4 →** ①仕上げ ②発表準備（デモ導線） ③README作成（AI可） ④（発展）連続練習日数バッジ

> 「基礎は自分の手で。AIは共同実装者。出てきたコードは必ず読み解く」が講座の作法。
