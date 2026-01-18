from crewai.tools import tool
from .book_tools import init_book_structure, set_book_outline, create_chapter, append_to_chapter


@tool("init_book_structure")
def init_book_structure_tool() -> str:
    """Create book folder structure + outline.json if missing."""
    return init_book_structure()


@tool("set_book_outline")
def set_book_outline_tool(title: str, chapters: list[str]) -> str:
    """Save outline.json for the book."""
    return set_book_outline(title, chapters)


@tool("create_chapter")
def create_chapter_tool(no: int, title: str) -> str:
    """Create a chapter markdown file."""
    return create_chapter(no, title)


@tool("append_to_chapter")
def append_to_chapter_tool(no: int, content: str) -> str:
    """Append content to a chapter markdown file."""
    return append_to_chapter(no, content)
