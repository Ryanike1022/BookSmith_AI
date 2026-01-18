from __future__ import annotations

import json
import subprocess
from pathlib import Path

from mcp.server.fastmcp import FastMCP

from my_project.tools.book_tools import (
    init_book_structure as init_book_structure_impl,
    set_book_outline as set_book_outline_impl,
    create_chapter as create_chapter_impl,
    append_to_chapter as append_to_chapter_impl,
)



# ✅ MCP Server Name
mcp = FastMCP("my_project_backend")

# ✅ This sets backend root to: my_project/
BACKEND_ROOT = Path(__file__).resolve().parents[1]


def safe_path(rel_path: str) -> Path:
    """Prevent escaping backend root directory."""
    target = (BACKEND_ROOT / rel_path).resolve()
    if not str(target).startswith(str(BACKEND_ROOT.resolve())):
        raise ValueError("Path escapes backend root")
    return target


@mcp.tool()
def list_backend(dir: str = ".") -> str:
    """List files/folders inside backend.

    Args:
        dir: relative directory path inside backend root
    """
    p = safe_path(dir)
    if not p.exists():
        return f"Directory not found: {dir}"

    items = []
    for child in sorted(p.iterdir()):
        items.append(
            {
                "name": child.name,
                "type": "dir" if child.is_dir() else "file",
            }
        )

    return json.dumps(items, indent=2)


@mcp.tool()
def read_file(path: str) -> str:
    """Read a file from backend root.

    Args:
        path: relative file path inside backend root
    """
    p = safe_path(path)
    if not p.exists() or not p.is_file():
        return f"File not found: {path}"
    return p.read_text(encoding="utf-8")


@mcp.tool()
def write_file(path: str, content: str) -> str:
    """Write/overwrite a backend file.

    Args:
        path: relative file path inside backend root
        content: file content
    """
    p = safe_path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding="utf-8")
    return f"✅ Written: {path}"


@mcp.tool()
def run_backend_command(command: str) -> str:
    """Run SAFE backend commands (whitelisted).

    Allowed prefixes:
    - npm
    - pnpm
    - yarn
    - python
    - uvicorn
    - pytest
    - uv

    Args:
        command: command string to run
    """
    allowed_starts = (
        "npm ",
        "pnpm ",
        "yarn ",
        "python ",
        "uvicorn ",
        "pytest",
        "uv ",
    )

    if not command.startswith(allowed_starts):
        return (
            "❌ Command blocked.\n"
            "Allowed prefixes: npm, pnpm, yarn, python, uvicorn, pytest, uv"
        )

    try:
        result = subprocess.run(
            command,
            cwd=str(BACKEND_ROOT),
            shell=True,
            capture_output=True,
            text=True,
            timeout=60,
        )

        out = result.stdout.strip()
        err = result.stderr.strip()

        combined = ""
        if out:
            combined += f"STDOUT:\n{out}\n\n"
        if err:
            combined += f"STDERR:\n{err}\n\n"

        combined += f"(exit code: {result.returncode})"
        return combined

    except subprocess.TimeoutExpired:
        return "⏱️ Command timed out (60s)."
    except Exception as e:
        return f"❌ Failed to run command: {e}"


@mcp.tool()
def init_book_structure() -> str:
    return init_book_structure_impl()

@mcp.tool()
def set_book_outline(title: str, chapters: list[str]) -> str:
    return set_book_outline_impl(title, chapters)

@mcp.tool()
def create_chapter(no: int, title: str) -> str:
    return create_chapter_impl(no, title)

@mcp.tool()
def append_to_chapter(no: int, content: str) -> str:
    return append_to_chapter_impl(no, content)




def main():
    mcp.run(transport="stdio")


if __name__ == "__main__":
    main()
