# Architecture Rationale / なぜこの構成か

This document explains why each technology was chosen and the trade-offs made.

---

## 1. Runtime: Bun

**English:**
Bun provides a fast JavaScript/TypeScript runtime with a built-in bundler, test runner, and package manager. For a Discord bot, the main benefit is fast startup and the ability to run `.ts` files directly in both development and production without a separate build step for the server.

**日本語:**
Bun は高速な JavaScript / TypeScript ランタイムで、バンドラー・テストランナー・パッケージマネージャーが内包されています。Discord ボットにとって最大のメリットは起動が速く、サーバー側を開発・本番双方で `.ts` を直接実行できる点です。

**Trade-off:**
Not every environment has Bun pre-installed, and some packages may not yet be fully optimized for it. The template stays within well-supported packages (discord.js, Hono, Drizzle, React) to minimize this risk.

---

## 2. Bot Framework: discord.js

**English:**
discord.js is the most mature Node.js library for the Discord API. It has excellent TypeScript definitions, supports intents, slash commands, context menus, modals, and interactions. This lets the template stay close to the official API while still being productive.

**日本語:**
discord.js は Discord API 用 Node.js ライブラリの中で最も成熟しています。TypeScript 定義が充実し、intents / スラッシュコマンド / コンテキストメニュー / モーダル / インタラクションに対応。公式 API に近づつつも、生産性を保てます。

---

## 3. Web Framework: Hono

**English:**
Hono is a tiny, fast, and standards-based web framework. It runs on Bun, Node, Deno, and edge runtimes. The admin UI and Discord Activity can share the same HTTP process as the bot, keeping deployment simple.

**日本語:**
Hono は小さく速く、標準ベースの Web フレームワークです。Bun / Node / Deno / エッジランタイムで動き、管理画面と Discord Activity をボットと同じ HTTP プロセスで動かせるため、デプロイがシンプルになります。

---

## 4. Database: Turso / SQLite + Drizzle ORM

**English:**
SQLite keeps local development zero-config. Turso adds a managed, distributed SQLite path for production, including group-level tokens and per-guild databases. Drizzle ORM provides a lightweight, type-safe layer with migrations and schema definitions in simple TypeScript.

**日本語:**
SQLite はローカル開発をゼロ構成にできます。Turso は本番用のマネージド分散 SQLite を提供し、グループトークン・per-guild DB に対応。Drizzle ORM は軽量で型安全な ORM レイヤーで、マイグレーションやスキーマ定義を TypeScript で行えます。

**Trade-off:**
The per-guild pattern assumes a provisioning strategy. The template uses file-based SQLite by default and a placeholder URL strategy for Turso. You can replace `src/db/provision.ts` with real Turso API calls when scaling.

---

## 5. Frontend: React + Vite

**English:**
React is the most familiar library for building admin interfaces. Vite provides a fast dev server and an optimized build. The `web/` directory is deliberately a shell: it demonstrates routing, OAuth, and an Activity entry point, but leaves the actual UI/UX to the project using the template.

**日本語:**
React は管理画面を作る上で最も馴染み深いライブラリです。Vite は高速な dev サーバーと最適化されたビルドを提供。`web/` ディレクトリは意図的に「側」になっており、ルーティング・OAuth・Activity エントリポイントを示しつつ、実際の UI/UX はテンプレートを使うプロジェクトに委ねています。

---

## 6. Project Layout

**English:**
The layout separates concerns so that contributors can find code quickly:

- `src/commands` and `src/context-menus` are auto-discovered, lowering the barrier to adding features.
- `src/db` separates `control` (registry) from `guild` (per-guild schemas), making multi-tenancy explicit.
- `src/services` is the intended place for domain logic, avoiding bloated command files.
- `src/web` keeps HTTP concerns isolated from the Discord client.

**日本語:**
関心事を分離し、コントリビューターがすぐにコードを見つけられるようにしています：

- `src/commands` / `src/context-menus` は自動検出されるため、機能追加の障壁が低い。
- `src/db` は `control`（レジストリ）と `guild`（per-guild スキーマ）を分離し、マルチテナンシーを明確に。
- `src/services` はドメインロジック用の場所で、コマンドファイルが肥大化するのを防ぐ。
- `src/web` は HTTP 関心事を Discord client から分離。

---

## 7. Scope: Japanese and English Speakers

**English:**
The template targets both Japanese and English-speaking developers. The repository defaults to English in `README.md`, while `README.ja.md` provides a full Japanese translation. Code, comments, and command names use English so that the source stays international. Documentation is being provided in both languages where it matters most.

**日本語:**
本テンプレートは日本語話者・英語話者の両方を対象にしています。リポジトリは `README.md` を英語でデフォルトとし、`README.ja.md` で完全な日本語訳を提供。コード・コメント・コマンド名は英語のままにして国際的に使えるようにし、重要なドキュメントは両言語で提供する方針です。
