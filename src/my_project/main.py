#!/usr/bin/env python
import os
import sys
import json
import warnings
from datetime import datetime

from my_project.crew import MyProject

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")


def run(topic: str = "AI LLMs"):
    """
    Run the BookSmith AI crew with a given topic.
    """
    os.makedirs("output", exist_ok=True)

    inputs = {
        "topic": topic,
        "current_year": str(datetime.now().year)
    }

    try:
        MyProject().crew().kickoff(inputs=inputs)
        print("\n✅ BookSmith AI finished!")
        print("📄 Saved: output/book_final.md")
    except Exception as e:
        raise Exception(f"Error while running crew: {e}")


def run_with_trigger(trigger_payload: dict):
    """
    Run the crew with trigger payload (useful for FastAPI later).
    """
    os.makedirs("output", exist_ok=True)

    inputs = {
        "crewai_trigger_payload": trigger_payload,
        "topic": trigger_payload.get("topic", ""),
        "current_year": str(datetime.now().year)
    }

    try:
        return MyProject().crew().kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(f"Error while running crew with trigger: {e}")


if __name__ == "__main__":
    # CLI Usage:
    # python -m my_project.main "Your Topic"
    topic = sys.argv[1] if len(sys.argv) > 1 else "AI LLMs"
    run(topic)
