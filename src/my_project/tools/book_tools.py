from __future__ import annotations

import json
from pathlib import Path

# project root = my_project/
PROJECT_ROOT = Path(__file__).resolve().parents[3]

BOOK_DIR = PROJECT_ROOT / "book"
CHAPTERS_DIR = BOOK_DIR / "chapters"
OUTLINE_PATH = BOOK_DIR / "outline.json"


def init_book_structure() -> str:
    """Create book folder structure + outline.json."""
    CHAPTERS_DIR.mkdir(parents=True, exist_ok=True)
    if not OUTLINE_PATH.exists():
        OUTLINE_PATH.write_text(
            json.dumps({"title": "", "chapters": []}, indent=2),
            encoding="utf-8",
        )
    return f"✅ Book structure ready at {BOOK_DIR}"


def set_book_outline(title: str, chapters: list[str]) -> str:
    """Save outline.json."""
    CHAPTERS_DIR.mkdir(parents=True, exist_ok=True)
    outline = {"title": title, "chapters": [{"no": i + 1, "title": ch} for i, ch in enumerate(chapters)]}
    OUTLINE_PATH.write_text(json.dumps(outline, indent=2), encoding="utf-8")
    return "✅ outline.json saved"


def create_chapter(no: int, title: str) -> str:
    """Create a chapter markdown file."""
    CHAPTERS_DIR.mkdir(parents=True, exist_ok=True)
    chapter_path = CHAPTERS_DIR / f"chapter_{no:02d}.md"
    if chapter_path.exists():
        return f"⚠️ Chapter already exists: {chapter_path.name}"

    chapter_path.write_text(f"# Chapter {no}: {title}\n\n", encoding="utf-8")
    return f"✅ Created {chapter_path.name}"


def append_to_chapter(no: int, content: str) -> str:
    """Append content to chapter markdown file."""
    CHAPTERS_DIR.mkdir(parents=True, exist_ok=True)
    chapter_path = CHAPTERS_DIR / f"chapter_{no:02d}.md"
    if not chapter_path.exists():
        return f"❌ Chapter doesn't exist: chapter_{no:02d}.md"

    with open(chapter_path, "a", encoding="utf-8") as f:
        f.write("\n" + content.strip() + "\n")
    return f"✅ Appended to {chapter_path.name}"
