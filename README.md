# 📚 BookSmith AI — Agentic Book Blueprint Generator (CrewAI × MCP × FastAPI × Next.js)

BookSmith AI is an **agentic book blueprint generator** built to demonstrate **modern multi-agent orchestration** and **tool-driven AI workflows** in a production-style architecture.

Instead of relying on a single “one-shot prompt”, BookSmith is designed as a **pipeline of specialized agents** (CrewAI) that collaborate to generate:

- a structured outline (saved to disk)
- grounded research notes
- a polished mini-book blueprint manuscript
- file-based outputs (outline + chapters)

On top of that, the project integrates **MCP (Model Context Protocol)** so Claude Desktop can act as a **control panel** to inspect, write, and run safe commands in the project — using the *same tool layer* used by the agents.

---

## ✅ Why I built this (Approach & Thinking)

Most LLM apps fail in production because they are:
- purely conversational
- not reproducible
- not tool-based
- not modular
- difficult to debug

So I approached BookSmith like a real system:

### 🧠 Key design goals
1) **Pipeline architecture over single prompt**
2) **Specialized roles (agents) over one general model**
3) **Tool-driven persistence** (agents write real files)
4) **Human-in-the-loop control layer (MCP)** for debugging + automation
5) **Frontend + API wrapper** to make it product-like (not just scripts)

---

## 🏗️ System Architecture (High Level)

### The architecture has 3 layers:

#### 1) Product Layer (UI + API)
- **Next.js frontend** for user interaction
- **FastAPI backend** for API endpoints and job execution

#### 2) Agent Layer (CrewAI Orchestration)
A sequential CrewAI pipeline with specialized agents:
- Outline Architect
- Researcher
- Final Compiler

#### 3) Tool Layer (Shared Source of Truth)
A single shared module that controls:
- file read/write
- outline creation
- chapter creation/appending

This tool layer is used by both:
✅ CrewAI agents  
✅ MCP server tools (Claude Desktop)

So the agents and MCP are **truly synced**.

---

## 🤖 Multi-Agent Orchestration (CrewAI)

### Why CrewAI?
CrewAI gives an organized framework to build:
- agents with roles
- task pipelines
- tool usage
- config-driven prompts

### Agents (3)
| Agent | Responsibility | Tools |
|------|----------------|------|
| **Outline Architect** | Creates full book blueprint & table of contents | `init_book_structure`, `set_book_outline` |
| **Researcher** | Web research with citations/sources | `SerperDevTool` |
| **Final Compiler** | Generates final manuscript + saves chapters | `create_chapter`, `append_to_chapter` |

### Execution Mode
Crew is run in **sequential** order:

1) Outline task  
2) Research task  
3) Compile task  

This ensures the system is predictable and structured.

---

## 🧰 Tool-Driven Output (No Fake File Writes)

A key part of this system is:  
✅ agents don’t just “say” they wrote a file — they actually do.

Tools implemented inside `src/my_project/tools/book_tools.py`:

- `init_book_structure()`  
  creates:
  - `book/outline.json`
  - `book/chapters/`

- `set_book_outline(title, chapters)`  
  writes:
  - `book/outline.json`

- `create_chapter(no, title)`  
  creates:
  - `book/chapters/chapter_XX.md`

- `append_to_chapter(no, content)`  
  appends markdown content into the chapter file

---

## 🔌 MCP Integration (Claude Desktop as a Control Layer)

### Why MCP?
MCP turns Claude Desktop into a **developer interface** for your AI system.

Instead of:
- writing new scripts for inspection
- manually opening files
- debugging in a scattered way

Claude can use tools to:
✅ list project directories  
✅ read generated files  
✅ write content into files  
✅ run safe, whitelisted commands  
✅ operate on book outputs through tools  

### The key architectural win
I didn’t want MCP to duplicate logic.

So I built MCP as a **thin wrapper** around the same shared tool layer:

- CrewAI uses: `book_tools.py`
- MCP uses: `book_tools.py`

That means MCP + Agents always act on the same truth.

---

## 🌐 Backend + Frontend Wrapping

### Backend (FastAPI)
Backend exposes generation endpoints and provides:
- `/docs` OpenAPI UI
- `/generate` to start generation
- `/status/{job_id}` to track progress
- `/result/{job_id}` to retrieve result
- `/download/pdf/{job_id}` (optional extension)

FastAPI acts as the “production wrapper” for the crew.

### Frontend (Next.js)
The UI was generated quickly using v0 + shadcn, then connected to backend via:

- `NEXT_PUBLIC_API_BASE_URL`
- fetch calls to `/generate`, `/status`, `/result`

Frontend makes this look like a real SaaS product.

---

## 📁 Project Structure

```bash
my_project/
├─ src/
│  └─ my_project/
│     ├─ api.py                 # FastAPI app
│     ├─ crew.py                # CrewAI orchestrator (agents + tasks)
│     ├─ main.py                # Entry point
│     ├─ config/
│     │  ├─ agents.yaml
│     │  └─ tasks.yaml
│     └─ tools/
│        ├─ book_tools.py       # Shared tool layer (truth source)
│        └─ crewai_tools.py     # CrewAI wrappers
├─ frontend/                    # Next.js + shadcn UI
├─ mcp_backend/
│  └─ server.py                 # MCP server (Claude Desktop connector)
├─ book/
│  ├─ outline.json              # generated outline
│  └─ chapters/
│     └─ chapter_01.md          # generated chapter content
└─ output/
   └─ book_final.md             # compiled blueprint output
