<p align="center">
  <img src="logo-horizontal.svg" alt="openPly" width="500">
</p>

<p align="center">
  <strong>Free, local-first AI coding assistant with a full web IDE.</strong>
  <br>
  Multi-session &middot; Multi-agent &middot; Design Partner &middot; Terminal &middot; File Editor &middot; Slash Commands
</p>

<p align="center">
  <a href="https://openply.pages.dev">Web App</a> &middot;
  <a href="#install">Install</a> &middot;
  <a href="#features">Features</a> &middot;
  <a href="#cli">CLI</a> &middot;
  <a href="#web-app">Web App</a> &middot;
  <a href="#license">License</a>
</p>

---

openPly is an open-source AI coding assistant available as both a **CLI** and a **web IDE**. It combines a multi-agent architecture with a full-featured web interface — sessions, agents, design partner, terminal, file editor, and more. Free, private, and open (MIT).

## Install

```bash
npm install -g openply
```

```bash
# Start CLI
cd your-project
openply
```

```bash
# Open web IDE
openply web
```

Or just use the [hosted web app](https://openply.pages.dev/app) — no install needed.

## Web App

The openPly web IDE (`/app`) gives you everything:

### Layout
```
┌─ Top Bar ─────────────────────────────────────────────┐
├─ Agent Bar: [Plan|Build] | Agent ▼ | [YOLO] | model ──┤
├─ Tool Bar: [Search] [Web] [Todo] [Shortcuts] ─────────┤
├──────┬──────────────────────┬─────────────────────────┤
│      │                      │ Code | Edit | Term | Set│
│ Sess │     Chat Panel       │                         │
│ ions │  (markdown, slash    │   (right panel tabs)    │
│ +    │   cmds, streaming)   │                         │
│ File │                      │                         │
├──────┴──────────────────────┴─────────────────────────┤
├─ Status Bar: mode | model | msgs | files | 📊 ───────┤
```

### Key Features

| Feature | Description |
|---|---|
| **Multi-session** | Create, rename, switch sessions. Independent history per session. Auto-persisted to browser. |
| **5 Agents** | Planner (read-only), Editor, Explorer, Debugger, Reviewer. Switch with dropdown. |
| **Plan/Build modes** | Plan = read-only analysis. Build = full read/write/exec. Toggle instantly. |
| **Auto-accept (YOLO)** | Skip confirmations for rapid implementation. One-click toggle. |
| **17 Design modes** | `/design` — audit, recolor, redesign, typeset, accessibility, responsive, dark mode, motion, tokens, create, finish, and more. |
| **Grep search** | `/search` or toolbar — ripgrep/findstr across your codebase. |
| **Web search** | `/web` or toolbar — search the web from within the IDE. |
| **Todo tracking** | `/todo` or toolbar — add, check, and manage tasks. |
| **Code viewer** | Read-only code view with syntax highlighting. |
| **File editor** | Edit files directly in the browser and save through the API. |
| **Terminal** | Run bash commands with real-time output. |
| **Checkpoints & Undo** | Auto-checkpoints before every response. `/undo` or `Esc` to rewind. |
| **Slash commands** | `/help`, `/model`, `/agent`, `/mode`, `/search`, `/web`, `/todo`, `/checkpoint`, `/undo`, `/design`, `/share`, `/export`, `/diagnostics` — autocomplete with Tab. |
| **Multi-provider** | OpenRouter (200+ models), OpenAI, Anthropic, Ollama local. Switch per session. |
| **Share & Export** | `/share` copies a shareable link. `/export` downloads as Markdown. |
| **Keyboard shortcuts** | `Esc`=undo, `Ctrl+K`=clear chat, `Ctrl+Shift+P`=toggle plan/build. |

### Slash Commands

| Command | Description |
|---|---|
| `/help` | Show all commands |
| `/model <name>` | Switch model |
| `/agent <name>` | Switch agent (planner/editor/explorer/debugger/reviewer) |
| `/mode <plan\|build>` | Switch mode |
| `/search <query>` | Grep search codebase |
| `/web <query>` | Search the web |
| `/todo <task>` | Add a todo |
| `/checkpoint` | Save a checkpoint |
| `/undo` | Undo to last checkpoint |
| `/design` | Open Design Partner (17 modes) |
| `/share` | Copy share link |
| `/export` | Export as Markdown |
| `/clear` | Clear chat |
| `/session` | Show session info |
| `/diagnostics` | Show full diagnostics |

## Design Partner

17 modes for design system management:

| Mode | Description |
|---|---|
| `audit` | Scan UI for issues, score, and prioritize |
| `checkup` | Traffic-light scores for layout, color, typography |
| `smell` | Detect visual inconsistencies |
| `recolor` | Build OKLCH color system with semantic roles |
| `typeset` | Typography scale, hierarchy, rhythm |
| `spacing` | Consistent spacing and layout grid |
| `icons` | Icon audit and consistency check |
| `redesign` | Complete visual transformation |
| `relayout` | Reorganize component tree and layout |
| `finish` | Final pre-ship polish and hardening |
| `create` | Design new page from brief |
| `access` | WCAG accessibility audit and fixes |
| `responsive` | Responsive design review |
| `dark` | Dark mode implementation |
| `motion` | Animation audit and performance |
| `tokens` | Extract patterns into design tokens |
| `review` | Full design review with feedback |

## CLI

```bash
openply                          # Start interactive session
openply web                      # Open web IDE
openply web "<desc>" --preview   # Build a web app from description
openply agents                   # List built-in agents
openply config                   # View/update configuration
openply history                  # Browse past sessions
```

### CLI Slash Commands

| Command | Description |
|---|---|
| `/help` | Show help |
| `/init` | Create knowledge.md + .agents/ |
| `/bash <cmd>` | Run a terminal command |
| `/model` | List/switch models |
| `/config` | Show configuration |
| `/exit` | Quit |

### CLI Built-in Agents

Use `@AgentName` in prompts:
- `@git-committer` — Create meaningful git commits
- `@debugger` — Analyze and fix bugs
- `@refactorer` — Refactor code for maintainability
- `@documenter` — Generate documentation
- `@tester` — Write and run tests

## Models

### Cloud (OpenRouter)
DeepSeek V4 Pro/Flash, MiMo 2.5 Pro, Kimi K2.7 Code, MiniMax M3, GPT-4o, Claude Sonnet 4, and 200+ more.

### Local (Ollama)
Llama 3.2, CodeLlama, Qwen 2.5 Coder, DeepSeek Coder, Mistral, and any Ollama model.

### Bring Your Own Key
OpenAI, Anthropic — configure in the web app Settings panel.

## Architecture

openPly uses **PlyMesh** — a mesh of specialized agents:

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
