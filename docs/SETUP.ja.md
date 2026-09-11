# セットアップガイド（日本語）

## 要件

- [Bun](https://bun.sh) 1.1+
- [Discord application](https://discord.com/developers/applications)（Bot ユーザー付き）
- （任意） [Turso](https://turso.tech) データベースグループ、またはローカル SQLite を利用

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

## 3. DB マイグレーション

```bash
bun run db:migrate:all
```

## 4. コマンド登録

```bash
bun run deploy:commands
```

## 5. 起動

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
