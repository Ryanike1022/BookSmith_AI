from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from crewai_tools import SerperDevTool
from typing import List

from my_project.tools.crewai_tools import (
    init_book_structure_tool,
    set_book_outline_tool,
    create_chapter_tool,
    append_to_chapter_tool,
)



@CrewBase
class MyProject():
    """BookSmith AI Blueprint Generator crew"""

    agents: List[BaseAgent]
    tasks: List[Task]

    # -------------------
    # AGENTS (3)
    # -------------------

    @agent
    def outline_architect(self) -> Agent:
        return Agent(
            config=self.agents_config["outline_architect"],
            verbose=True,
            tools=[init_book_structure_tool, set_book_outline_tool],
        )

    @agent
    def researcher(self) -> Agent:
        return Agent(
            config=self.agents_config["researcher"],
            verbose=True,
            tools=[SerperDevTool()]  # Serper only for researcher
        )

    @agent
    def final_compiler(self) -> Agent:
        return Agent(
            config=self.agents_config["final_compiler"],
            verbose=True,
            tools=[create_chapter_tool, append_to_chapter_tool],
            
        )

    # -------------------
    # TASKS (3)
    # -------------------

    @task
    def outline_task(self) -> Task:
        return Task(config=self.tasks_config["outline_task"])

    @task
    def research_task(self) -> Task:
        return Task(config=self.tasks_config["research_task"])

    @task
    def compile_book_task(self) -> Task:
        return Task(
            config=self.tasks_config["compile_book_task"],
            output_file="output/book_final.md"
        )

    # -------------------
    # CREW
    # -------------------

    @crew
    def crew(self) -> Crew:
        """Creates the BookSmith AI crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
            max_rpm=4 
        )
