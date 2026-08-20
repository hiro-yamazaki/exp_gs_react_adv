# 別PCでのセットアップ手順

このリポジトリを別のPCで動かすための手順。**上から順に実行すれば動きます。**

---

## 0. 前提（初回のみ確認）

```bash
node -v      # v20 以上であること（Next.js 16 の必須要件）
git --version
```

`node -v` が出ない／v20未満なら https://nodejs.org の **LTS** を入れ、ターミナルを開き直す。

---

## 1. リポジトリを取得

```bash
git clone https://github.com/hiro-yamazaki/exp_gs_react_adv.git
cd exp_gs_react_adv
```

> privateリポジトリなので、初回は GitHub の認証を求められます。
> `gh auth login` を済ませておくか、表示に従ってブラウザ認証してください。

## 2. 依存パッケージを入れる

```bash
npm install
```

`node_modules/` はGitに含めていないので、**PCごとに毎回必要**です。数分かかります。

## 3. 環境変数を復元する（★ここが唯一の手作業）

APIキーは意図的にGitに含めていません。テンプレートから作り、値を自分で入れます。

```bash
cp .env.local.example .env.local
```

作った `.env.local` を開いて、必要なキーを記入する。

| 変数 | いつ必要 | 取得先 |
|---|---|---|
| `GROQ_API_KEY` | **DAY1〜（必須）** | https://console.groq.com/keys |
| `DATABASE_URL` | DAY3〜 | https://console.neon.tech（接続文字列） |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | DAY4〜 | https://dashboard.clerk.com |
| `RESEND_API_KEY` | DAY4〜 | https://resend.com/api-keys |

> ⚠️ `.env.local` は `.gitignore` 済み。**絶対にコミットしない**。
> キーの移行は、Gitではなくパスワードマネージャや手入力で行うこと。

## 4. 起動

```bash
npm run dev
```

http://localhost:3000 を開いて画面が出れば成功。止めるのは `Ctrl + C`。

> **ポートが3001になることがあります。** 他のNext.jsプロジェクトが3000を使っている場合、
> 自動的にずれます。ターミナルに出る `Local: http://localhost:____` を見てください。

---

## 日常の流れ（PCを行き来する場合）

作業を**始める前に必ず**：

```bash
git pull
npm install     # package.json が変わっていた時だけ必要。迷ったら実行して損はない
```

作業を**終えたら**：

```bash
git add -A
git commit -m "何をしたかを一言で"
git push
```

> **pushを忘れると別PCで続きができません。** 講義後・宿題後は必ずpushする習慣に。

### コンフリクトが出たら

同じファイルを両方のPCで編集すると `git pull` で衝突します。慌てず、
「どこで・どんなメッセージが出たか」をメモして講師かAIに聞くのが早いです。
最悪、片方の変更を捨てても取り返せるよう、**こまめにcommitしておく**のが最大の予防策です。

---

## つまずいた時

| 症状 | 対処 |
|---|---|
| `npm run dev` でエラー | `rm -rf node_modules .next && npm install` でやり直す |
| APIが401を返す | `.env.local` のキーが空／古い。3章をやり直す |
| ポートが3000で開かない | ターミナルの `Local:` 行を見る（3001等にずれている） |
| `git pull` で衝突 | 上記「コンフリクトが出たら」参照 |
