@AGENTS.md

# exp_gs_react_adv

G's Academy **EXP React 上級（Next.js）** の制作物。
お題は『**AI プレゼン / 面接 練習コーチ**』。Webカメラで練習 → 表情＋発話をAIが解析 →
コーチング＆音声読み上げ → 履歴を保存 → レポート配信、までを5日間でフルスタックに作る。

## 別PCでセットアップする場合

**`SETUP.md` を読んで、その手順どおりに実行すること。** 要点だけ先に：

1. `npm install`
2. `cp .env.local.example .env.local` → **キーはユーザー本人に入力してもらう**（AIが代行しない）
3. `npm run dev` → http://localhost:3000（他プロジェクトと競合すると3001にずれる）

## 技術構成（講師指定・勝手に変えない）

| 領域 | 採用 |
|---|---|
| 土台 | Next.js 16（**App Router**）/ React 19 / TypeScript |
| スタイル | Tailwind CSS v4 |
| 自作API | Next.js **Route Handlers**（`src/app/api/*/route.ts`）★講座の核 |
| APIテスト | Bruno（無料・OSS・アカウント不要） |
| DB | Neon（Postgres）+ Drizzle ORM |
| 認証 | Clerk |
| AI | Groq（文章生成＋Whisper音声文字起こし・**同じキー**） |
| 表情認識 | `@vladmandic/face-api`（ブラウザ内で動作・登録不要） |
| 配信 | Resend（メール）／任意でDiscord Webhook |
| 公開 | Vercel（学習用Hobby＝**非商用のみ**） |

- ディレクトリ名 `exp_gs_react_adv` は**講師指定で変更不可**（受講生全員で統一しGitHubで集約するため）。
- Slackは使わない（会社/学校のSlackは管理者承認が要るため、配信先はメール）。

## 進行と、この repo に増えていくもの

| DAY | 日程 | 増えるもの |
|---|---|---|
| DAY1 | 8/23(日) | `src/app/api/**/route.ts`（自作API）／Groq連携／Tailwind でUI |
| DAY2 | 8/30(日) | getUserMedia・face-api（表情）／MediaRecorder＋Whisper（`/api/transcribe`）／SpeechSynthesis |
| DAY3 | 9/6(日) | Neon＋Drizzle（スキーマ・マイグレーション）／CRUD API／`/history/[id]`／成長グラフ |
| DAY4 | 9/13(日) | Clerk認証／API保護／メール配信／Vercel本番デプロイ／`/share/[id]` |
| DAY5 | 9/27(日) | 最終ブラッシュアップ＋成果発表（※9/20は講義なし） |

## AIとして働く時の作法（この講座固有・重要）

講座の方針は「**手で書く × AIを使う**」。基礎は受講生自身の手で書くことが評価対象です。

- **宿題の「（手書き）」と明記された項目は、コードを書いて渡さない。** 考え方の説明、
  詰まった箇所のデバッグ、書いたコードのレビューに徹すること。
- 「（AI可）」の項目（コードレビュー依頼、設計レビュー、README作成）は積極的に手伝ってよい。
- コードを提示する場合は、**必ず何をしているか読み解ける説明を添える**
  （講座の原則：「出てきたコードは必ず読み解くこと」）。
- 受講生はReact初級・中級を修了した段階。TypeScriptとNext.jsのApp Routerは**上級で初めて触る**前提で説明する。

## 秘密情報の扱い

- `.env.local` はGit管理外。**中身を読み取ってコミットやログに出さない。**
- `.env.local.example` は値が空のテンプレートなのでGit管理対象。キーを増やす時はこちらにも追記する。
- APIキーの発行・入力はユーザー本人が行う。AIが代行しない。
