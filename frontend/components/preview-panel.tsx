"use client"

import { motion, AnimatePresence } from "framer-motion"
import { BookAnimation } from "@/components/book-animation"
import { ProgressSteps } from "@/components/progress-steps"
import { Button } from "@/components/ui/button"
import { Download, Copy, RefreshCw, BookOpen } from "lucide-react"
import { toast } from "sonner"

interface PreviewPanelProps {
  status: "idle" | "running" | "completed" | "error"
  currentStep: number
  progress: number
  content: string
  onDownloadPdf: () => void
  onCopyMarkdown: () => void
  onNewGeneration: () => void
}

export function PreviewPanel({
  status,
  currentStep,
  progress,
  content,
  onDownloadPdf,
  onCopyMarkdown,
  onNewGeneration,
}: PreviewPanelProps) {
  const handleCopy = () => {
    onCopyMarkdown()
    toast.success("Markdown copied to clipboard!")
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-lg"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Book Preview</h3>
        {status === "completed" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
          >
            Complete
          </motion.div>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-1 flex-col items-center justify-center text-center"
            >
              <div className="rounded-full bg-muted p-6">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Your book preview will appear here</p>
              <p className="mt-1 text-xs text-muted-foreground/70">Fill in the form and click Generate Book</p>
            </motion.div>
          )}

          {status === "running" && (
            <motion.div
              key="running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-1 flex-col items-center justify-center gap-8"
            >
              <BookAnimation isAnimating={true} />

              <div className="w-full max-w-xs space-y-4">
                <ProgressSteps currentStep={currentStep} />

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full bg-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {status === "completed" && (
            <motion.div
              key="completed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-1 flex-col"
            >
              <div className="flex-1 overflow-auto rounded-lg border border-border bg-muted/30 p-4">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed">{content}</pre>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={onDownloadPdf} className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                <Button variant="outline" onClick={handleCopy} className="flex-1 gap-2 bg-transparent">
                  <Copy className="h-4 w-4" />
                  Copy Markdown
                </Button>
                <Button variant="secondary" onClick={onNewGeneration} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  New
                </Button>
              </div>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-1 flex-col items-center justify-center text-center"
            >
              <div className="rounded-full bg-destructive/10 p-6">
                <BookOpen className="h-12 w-12 text-destructive" />
              </div>
              <p className="mt-4 font-medium text-destructive">Generation failed</p>
              <p className="mt-1 text-sm text-muted-foreground">Please try again or check your connection</p>
              <Button variant="outline" onClick={onNewGeneration} className="mt-4 gap-2 bg-transparent">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
