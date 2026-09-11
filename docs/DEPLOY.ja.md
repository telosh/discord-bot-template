# デプロイガイド（日本語）

## Railway

1. プロジェクトを作成し、GitHub リポジトリを連携。
2. Railway Dashboard で環境変数を設定。
3. スタートコマンド：`bun run dist/index.js`
4. ビルドコマンド：`bun run build && bun run build:web`

## Docker

ビルド：

```bash
docker build -t discord-bot-template .
docker run -p 3000:3000 --env-file .env -v $(pwd)/data:/app/data discord-bot-template
```

## ローカル本番ビルド

```bash
bun run build
bun run build:web
bun run start
```

## 注意

- 初回起動前に `bun run db:migrate:all` を実行してください。
- `.env` やデータベースファイルをリポジトリにコミットしないでください。
