const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "")

export interface GenerateRequest {
  genre: string
  topic: string
  description?: string
  tone: string
  audience: string
}

export interface GenerateResponse {
  job_id: string
}

export interface StatusResponse {
  status: "pending" | "creating_outline" | "researching" | "writing" | "finalizing" | "completed" | "error"
}

export interface ResultResponse {
  content: string
}

export async function generateBook(data: GenerateRequest): Promise<GenerateResponse> {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to start generation")
  }

  return response.json()
}

export async function getJobStatus(jobId: string): Promise<StatusResponse> {
  const response = await fetch(`${API_BASE_URL}/status/${jobId}`)

  if (!response.ok) {
    throw new Error("Failed to get status")
  }

  return response.json()
}

export async function getJobResult(jobId: string): Promise<ResultResponse> {
  const response = await fetch(`${API_BASE_URL}/result/${jobId}`)

  if (!response.ok) {
    throw new Error("Failed to get result")
  }

  return response.json()
}

export function downloadPdf(jobId: string): void {
  window.open(`${API_BASE_URL}/download/pdf/${jobId}`, "_blank")
}

export function getStepFromStatus(status: StatusResponse["status"]): number {
  switch (status) {
    case "pending":
      return 0
    case "creating_outline":
      return 1
    case "researching":
      return 2
    case "writing":
      return 3
    case "finalizing":
      return 4
    case "completed":
      return 5
    default:
      return 0
  }
}

export function getProgressFromStep(step: number): number {
  return Math.min((step / 4) * 100, 100)
}
