<p align="center">
  <img src="logo-horizontal.svg" alt="openPly" width="500">
</p>

<p align="center">
  <strong>Free, local-first AI coding assistant. Your code never leaves your machine.</strong>
</p>

openPly is an open-source AI coding assistant that understands your codebase and makes precise edits through natural language. It runs entirely locally or uses top open-source models via OpenRouter.

## Why openPly?

| vs Freebuff | vs Claude Code | vs Cline |
|---|---|---|
| **Local-first** — runs on Ollama, no server needed | **Free** — ad-supported, no subscription | **CLI-native** — no IDE lock-in |
| **MIT License** — truly open | **Multi-model** — any OpenRouter model | **Agent mesh** — not sequential pipelines |
| **No data collection** — your code stays yours | **Local option** — works offline | **Git-native** — auto commits & PRs |

## Install

```bash
npm install -g openply
```

## Quick start

```bash
cd your-project
openply
```

Then tell it what to do:

```
ply> add rate limiting to all API endpoints
ply> refactor the database connection to use a connection pool
ply> @debugger fix the type errors in src/services
```

## Features

### Knowledge files
Create `knowledge.md` in your project root — openPly reads it for context on every request.

### Custom agents
Run `/init` to create an `.agents/` directory with agent definitions. Invoke them with `@AgentName`.

### Web app builder
Build full-stack apps from a description:

```bash
openply web "a todo app with React frontend and Express backend" --preview
```

### Built-in agents
Use `@AgentName` in your prompts:

- `@git-committer` — Create meaningful git commits
- `@debugger` — Analyze and fix bugs
- `@refactorer` — Refactor code for maintainability
- `@documenter` — Generate documentation
- `@tester` — Write and run tests

### Bash mode
Run terminal commands from the REPL with `/bash <command>`.

### Chat history
Past sessions are saved. Browse them with `openply history`.

### VS Code extension
Install the openPly extension for VS Code to start a terminal, chat, or explain selected code.

## How it's free

openPly displays non-intrusive text ads in the terminal. No subscription. No credits. No API keys required for local mode.

## Commands

| Command | Description |
|---|---|
| `/help` | Show help |
| `/new` | Start a new session |
| `/init` | Create knowledge.md + .agents/ |
| `/bash <cmd>` | Run a terminal command |
| `/config` | Show current configuration |
| `/model` | List available models |
| `/exit` | Quit |

### CLI

| Command | Description |
|---|---|
| `openply` | Start interactive session |
| `openply web <desc>` | Build a web app from description |
| `openply agents` | List built-in agents |
| `openply config` | View/update configuration |
| `openply history` | Browse past sessions |

## Architecture

openPly uses a **PlyMesh** — a mesh of specialized agents:

```
┌─────────────┐     ┌─────────────┐
│ File Finder │────▶│   Planner   │
│ (scans repo)│     │ (analyzes)  │
└─────────────┘     └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
       ┌──────────┐ ┌──────────┐ ┌──────────┐
       │  Editor  │ │   Bash   │ │  Search  │
       │(edits fs)│ │(commands)│ │(grep/glob)│
       └────┬─────┘ └──────────┘ └──────────┘
            ▼
       ┌──────────┐
       │ Reviewer │
       │(validates)│
       └──────────┘
```

## Models

### Cloud (OpenRouter)
DeepSeek V4 Pro, MiMo 2.5 Pro, Kimi K2.7 Code, DeepSeek V4 Flash, MiMo 2.5, MiniMax M3

### Local (Ollama)
DeepSeek Coder V2, CodeLlama, Qwen 2.5 Coder

## SDK

```bash
npm install openply
```

```typescript
import { Orchestrator, LLMClient } from 'openply'

const llm = new LLMClient('deepseek/deepseek-v4-flash', apiKey)
const orchestrator = new Orchestrator(llm, { cwd: '/project', files: [], prompt: '', history: [], config })
await orchestrator.init()
const result = await orchestrator.run('Add error handling to all API endpoints')
```

## License

MIT
