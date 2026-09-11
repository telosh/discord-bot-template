# Contributing

Thank you for your interest in contributing!

## How to Contribute

1. Fork the repository and create a feature branch.
2. Run `bun install` to install dependencies.
3. Make your changes.
4. Run `bun run typecheck`, `bun run typecheck:web`, `bun run test`, `bun run build`, and `bun run build:web`.
5. Commit with a clear message.
6. Open a pull request.

## Development Workflow

```bash
bun install
cp .env.example .env
bun run db:migrate:all
bun run deploy:commands
bun run dev
```

## Code Style

- Use TypeScript and follow the existing project structure.
- Keep command logic in `src/commands/` and domain logic in `src/services/`.
- Add tests when possible.
- Update documentation if your change affects setup or architecture.

## Questions?

Feel free to open an issue for questions or discussion.
