# セットアップガイド（日本語）

## 要件

- [Bun](https://bun.sh) 1.2+
- [Discord application](https://discord.com/developers/applications)（Bot ユーザー付き）
- （任意） [Turso](https://turso.tech) データベース、またはローカル SQLite

> **重要:** このボット専用のデータベース（例：`discord-bot-template`）を作成してください。既存の `bot-prod` などを使い回すとデータが混在し、インシデントの原因になります。

## 1. インストール

```bash
bun install
```

## 2. 設定

`.env.example` を `.env` にコピーして必要事項を記入します：

```bash
cp .env.example .env
```

最低限必要な項目：

- `DISCORD_TOKEN` — Bot トークン
- `DISCORD_CLIENT_ID` — Application ID
- `DISCORD_GUILD_ID` — テストサーバー ID（ギルドコマンド即時登録用）

## 3. Turso データベース作成（任意）

Turso を使う場合：

```bash
# Turso CLI をインストール＆ログイン
npx turso auth login

# このボット専用のデータベースを作成
npx turso db create discord-bot-template

# 接続 URL とトークンを取得
npx turso db show discord-bot-template
npx turso db tokens create discord-bot-template
```

取得した URL とトークンを `.env` に設定：

```bash
CONTROL_DB_URL=https://discord-bot-template-ORG.turso.io
CONTROL_DB_TOKEN=...
TURSO_TEMPLATE_DB_URL=https://discord-bot-template-ORG.turso.io
TURSO_GROUP_TOKEN=...
```

> **既存データベースの使い回しはしないでください。** このボットは per-guild テーブルを作成します。`bot-prod` など他のデータベースを使うとデータ消失や競合が起こる可能性があります。

## 4. DB マイグレーション

```bash
bun run db:migrate:all
```

## 5. コマンド登録

```bash
bun run deploy:commands
```

## 6. 起動

```bash
bun run dev
```

## Web / Activity 有効化

Web 管理画面 / Activity 殻を有効にする場合、以下も設定します：

- `DISCORD_CLIENT_SECRET`
- `OAUTH_REDIRECT_URI`（例：`http://localhost:3000/auth/callback`）
- `SESSION_SECRET`

Web UI をビルド：

```bash
bun run build:web
```

## デプロイ

Docker を使う場合：

```bash
docker compose up --build -d
```

または `Dockerfile` を Railway、Fly.io、Render などにデプロイしてください。
