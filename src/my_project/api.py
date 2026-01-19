from fastapi import FastAPI, BackgroundTasks, HTTPException, Request
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from uuid import uuid4
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

import os
import markdown
from weasyprint import HTML

from my_project.crew import MyProject


app = FastAPI(title="BookSmith AI API", version="1.0.0")

# ✅ CORS: allow frontend domains (localhost + vercel)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://book-smith-ai.vercel.app", #vercel deployment
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# In-memory jobs store (fine for demo)
JOBS = {}


class GenerateRequest(BaseModel):
    genre: str = Field(..., example="Self-help")
    topic: str = Field(..., example="Discipline for students")
    description: str = Field("", example="Make it motivating, practical and no fluff")
    tone: str = Field("Neutral", example="Motivational and encouraging")
    audience: str = Field("General", example="Students aged 15-25")


def run_generation(job_id: str, request: GenerateRequest):
    """
    Background worker that runs CrewAI and saves the final markdown output.
    """
    try:
        JOBS[job_id]["status"] = "in_progress"
        JOBS[job_id]["started_at"] = datetime.now().isoformat()

        os.makedirs("output", exist_ok=True)
        output_file = f"output/{job_id}_book_final.md"

        final_topic = (
            f"Genre: {request.genre}\n"
            f"Topic: {request.topic}\n"
            f"Audience: {request.audience}\n"
            f"Tone: {request.tone}\n"
            f"Extra instructions: {request.description}\n"
        )

        inputs = {
            "topic": final_topic,
            "current_year": str(datetime.now().year),
        }

        # Run crew
        MyProject().crew().kickoff(inputs=inputs)

        # Crew writes here by default
        default_file = "output/book_final.md"
        if not os.path.exists(default_file):
            raise FileNotFoundError("output/book_final.md not found. Crew may have failed.")

        # Read + save result per job
        with open(default_file, "r", encoding="utf-8") as f:
            md = f.read()

        with open(output_file, "w", encoding="utf-8") as f:
            f.write(md)

        JOBS[job_id]["status"] = "completed"
        JOBS[job_id]["completed_at"] = datetime.now().isoformat()
        JOBS[job_id]["output_file"] = output_file

    except Exception as e:
        JOBS[job_id]["status"] = "failed"
        JOBS[job_id]["error"] = str(e)


# -------------------
# ROUTES
# -------------------

# ✅ Render healthcheck uses HEAD /
@app.api_route("/", methods=["GET", "HEAD"])
async def root(request: Request):
    return {"message": "Welcome to the BookSmith AI API!"}


@app.post("/generate")
def generate_book(request: GenerateRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid4())

    JOBS[job_id] = {
        "status": "queued",
        "requested_at": datetime.now().isoformat(),
        "request": request.model_dump(),
    }

    background_tasks.add_task(run_generation, job_id, request)

    return {
        "job_id": job_id,
        "status": "queued",
        "message": "Book generation started.",
    }


@app.get("/status/{job_id}")
def get_status(job_id: str):
    if job_id not in JOBS:
        raise HTTPException(status_code=404, detail="Job not found")
    return JOBS[job_id]


@app.get("/result/{job_id}")
def get_result(job_id: str):
    if job_id not in JOBS:
        raise HTTPException(status_code=404, detail="Job not found")

    job = JOBS[job_id]

    if job["status"] != "completed":
        raise HTTPException(
            status_code=400,
            detail=f"Job not completed yet. Current status: {job['status']}",
        )

    path = job.get("output_file")
    if not path or not os.path.exists(path):
        raise HTTPException(status_code=500, detail="Output file not found")

    with open(path, "r", encoding="utf-8") as f:
        md = f.read()

    return {
        "job_id": job_id,
        "content": md,
    }


@app.get("/download/pdf/{job_id}")
def download_pdf(job_id: str):
    if job_id not in JOBS:
        raise HTTPException(status_code=404, detail="Job not found")

    job = JOBS[job_id]
    if job["status"] != "completed":
        raise HTTPException(status_code=400, detail=f"Job not completed yet: {job['status']}")

    md_path = job.get("output_file")
    if not md_path or not os.path.exists(md_path):
        raise HTTPException(status_code=500, detail="Markdown file not found")

    # Read markdown
    with open(md_path, "r", encoding="utf-8") as f:
        md_text = f.read()

    # Convert markdown -> HTML
    html_content = markdown.markdown(md_text, extensions=["extra", "tables", "fenced_code"])

    # Wrap in basic HTML template
    full_html = f"""
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body {{
            font-family: Arial, sans-serif;
            margin: 40px;
            line-height: 1.6;
          }}
          h1, h2, h3 {{
            margin-top: 24px;
          }}
          code {{
            background: #f4f4f4;
            padding: 2px 4px;
            border-radius: 4px;
          }}
          pre {{
            background: #f4f4f4;
            padding: 10px;
            border-radius: 6px;
            overflow-x: auto;
          }}
        </style>
      </head>
      <body>
        {html_content}
      </body>
    </html>
    """

    # Save PDF
    pdf_path = md_path.replace(".md", ".pdf")
    HTML(string=full_html).write_pdf(pdf_path)

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=f"{job_id}_BookSmithAI.pdf",
    )
