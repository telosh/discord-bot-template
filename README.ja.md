# discord-bot-template

[![CI](https://github.com/telosh/discord-bot-template/actions/workflows/ci.yml/badge.svg)](https://github.com/telosh/discord-bot-template/actions)
[![License](https://img.shields.io/github/license/telosh/discord-bot-template)](LICENSE)
[![Bun](https://img.shields.io/badge/Bun-1.1%2B-black?logo=bun)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7%2B-blue?logo=typescript)](https://www.typescriptlang.org)

> **Bun + discord.js + Hono + React + Turso** を使った OSS 用 Discord ボットテンプレート。

[English README](./README.md)

自分だけの Discord ボットを作るための、整理された出発点です。Web 管理画面と Discord Activity は「側（shell）」として含まれているため、そのまま拡張できます。

## なぜこの構成か？

このテンプレートは **長期的なメンテナンス性** と **拡張のしやすさ** を重視して選んでいます。

- **Bun** — 高速なランタイムで、TypeScript をそのまま実行。パッケージ管理もモダン。
- **discord.js** — Discord API の Node.js ライブラリとして最も成熟しており、コミュニティ・情報が豊富。
- **Hono** — 軽量・高速・移植性の高い HTTP フレームワーク。Bun / Node / エッジランタイムで動く。
- **React + Vite** — 管理画面 / Activity に使える、現代的で馴染み深い Web スタック。
- **Turso / SQLite** — ローカル開発はゼロ構成。本番では管理された per-guild データベースへ移行しやすい。

設計の詳細は [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) と [docs/ARCHITECTURE_RATIONALE.md](docs/ARCHITECTURE_RATIONALE.md) を参照してください。

## 機能

- スラッシュコマンド自動ローダー（`src/commands/<category>/<name>.ts`）
- Zod による型安全な環境変数検証
- Turso / SQLite + Drizzle ORM による per-guild DB テンプレ
- Web 管理画面 / Activity 殻（Hono + Vite + React）
- Discord OAuth ログイン殻
- Docker / docker-compose 対応
- Bun による GitHub Actions CI

## クイックスタート

```bash
bun install
cp .env.example .env
# .env を Discord 認証情報で編集
bun run db:migrate:all
bun run deploy:commands
bun run dev
```

## コマンドの追加

`src/commands/general/hello.ts` を作成します：

```ts
import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../../discord/command.js';

export const command: Command = {
  data: new SlashCommandBuilder().setName('hello').setDescription('Say hello'),
  async execute(interaction) {
    await interaction.reply('Hello, world!');
  },
};
```

その後、登録します：

```bash
bun run deploy:commands
```

## プロジェクト構成

```
src/
  commands/        # スラッシュコマンド（自動ロード）
  context-menus/   # コンテキストメニュー（自動ロード）
  config/          # 環境変数・定数
  db/              # Drizzle スキーマ、control + per-guild クライアント
  discord/         # Client、コマンド型、ローダー、権限
  events/          # Discord.js イベントハンドラ
  infra/           # ロガー
  services/        # ドメインサービス
  web/             # Hono サーバー、認証、Activity
  index.ts         # エントリポイント
  deploy-commands.ts
web/               # Vite + React 殻
```

## ドキュメント

- [セットアップ](docs/SETUP.md)
- [デプロイ](docs/DEPLOY.md)
- [アーキテクチャ](docs/ARCHITECTURE.md)
- [なぜこの構成か](docs/ARCHITECTURE_RATIONALE.md)

## ライセンス

MIT — [LICENSE](LICENSE) を参照。
