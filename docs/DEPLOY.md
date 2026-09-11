# Deploy

## Railway

1. Create a project and connect your GitHub repo.
2. Set environment variables in Railway Dashboard.
3. Add a start command: `bun run dist/index.js`.
4. Build command: `bun run build && bun run build:web`.

## Docker

Build:

```bash
docker build -t discord-bot-template .
docker run -p 3000:3000 --env-file .env -v $(pwd)/data:/app/data discord-bot-template
```

## Local

```bash
bun run build
bun run build:web
bun run start
```
