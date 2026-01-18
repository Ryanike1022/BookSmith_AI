"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { BookOpen, ArrowLeft } from "lucide-react"
import { GeneratorForm } from "@/components/generator-form"
import { PreviewPanel } from "@/components/preview-panel"
import { toast } from "sonner"
import {
  generateBook,
  getJobStatus,
  getJobResult,
  downloadPdf,
  getStepFromStatus,
  getProgressFromStep,
} from "@/lib/api"

type GenerationStatus = "idle" | "running" | "completed" | "error"

const DEMO_CONTENT = `# The Art of Building Better Habits

## Chapter 1: Understanding Habit Formation

Habits are the invisible architecture of daily life. Research shows that approximately 40% of our daily actions are driven by habits rather than conscious decisions. This chapter explores the neurological loop that drives every habit: the cue, routine, and reward.

### The Habit Loop

Every habit follows a predictable pattern:
1. **Cue**: The trigger that initiates the behavior
2. **Routine**: The behavior itself
3. **Reward**: The benefit you gain from the behavior

Understanding this loop is the first step to changing your habits.

## Chapter 2: The Power of Small Changes

James Clear's concept of "atomic habits" teaches us that 1% improvements compound over time. Small changes might seem insignificant in the moment, but over months and years, they can lead to remarkable results.

### The Mathematics of Improvement

If you improve by 1% each day for one year:
1.01^365 = 37.78

That's nearly 38 times better by the end of the year.

## Chapter 3: Environment Design

Your environment shapes your behavior more than you realize. This chapter covers how to design your surroundings to make good habits easier and bad habits harder.

### Practical Strategies
- Make cues for good habits obvious and visible
- Reduce friction for positive behaviors
- Increase friction for negative behaviors
- Use implementation intentions

## Conclusion

Building better habits is a journey, not a destination. By understanding the science of habit formation and applying these strategies consistently, you can transform your daily routines and achieve your goals.`

export default function GeneratePage() {
  const [formData, setFormData] = useState({
    genre: "",
    topic: "",
    description: "",
    tone: "",
    audience: "",
  })
  const [status, setStatus] = useState<GenerationStatus>("idle")
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [content, setContent] = useState("")
  const [jobId, setJobId] = useState<string | null>(null)

  const pollStatus = useCallback(async (id: string) => {
    try {
      const statusResponse = await getJobStatus(id)
      const step = getStepFromStatus(statusResponse.status)
      setCurrentStep(step)
      setProgress(getProgressFromStep(step))

      if (statusResponse.status === "completed") {
        const resultResponse = await getJobResult(id)
        setContent(resultResponse.content)
        setStatus("completed")
        toast.success("Book generated successfully!")
      } else if (statusResponse.status === "error") {
        setStatus("error")
        toast.error("Generation failed. Please try again.")
      } else {
        setTimeout(() => pollStatus(id), 2000)
      }
    } catch {
      // Demo mode: simulate generation
      simulateGeneration()
    }
  }, [])

  const simulateGeneration = useCallback(() => {
    let step = 1
    const interval = setInterval(() => {
      setCurrentStep(step)
      setProgress(getProgressFromStep(step))

      if (step >= 4) {
        clearInterval(interval)
        setTimeout(() => {
          setContent(DEMO_CONTENT)
          setStatus("completed")
          setCurrentStep(5)
          setProgress(100)
          toast.success("Book generated successfully!")
        }, 1000)
      }
      step++
    }, 2000)
  }, [])

  useEffect(() => {
    if (jobId && status === "running") {
      pollStatus(jobId)
    }
  }, [jobId, status, pollStatus])

  const handleSubmit = async () => {
    setStatus("running")
    setCurrentStep(1)
    setProgress(0)
    setContent("")

    try {
      const response = await generateBook({
        genre: formData.genre,
        topic: formData.topic,
        description: formData.description,
        tone: formData.tone,
        audience: formData.audience,
      })
      setJobId(response.job_id)
    } catch {
      // Demo mode: simulate generation
      simulateGeneration()
    }
  }

  const handleDownloadPdf = () => {
    if (jobId) {
      downloadPdf(jobId)
    } else {
      toast.info("Demo mode: PDF download would happen here")
    }
  }

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(content)
  }

  const handleNewGeneration = () => {
    setStatus("idle")
    setCurrentStep(0)
    setProgress(0)
    setContent("")
    setJobId(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <div className="h-6 w-px bg-border" />
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <BookOpen className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">BookSmith AI</span>
            </Link>
          </div>
        </div>
      </motion.header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
            <GeneratorForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              isGenerating={status === "running"}
            />
          </div>

          <PreviewPanel
            status={status}
            currentStep={currentStep}
            progress={progress}
            content={content}
            onDownloadPdf={handleDownloadPdf}
            onCopyMarkdown={handleCopyMarkdown}
            onNewGeneration={handleNewGeneration}
          />
        </div>
      </main>
    </div>
  )
}
