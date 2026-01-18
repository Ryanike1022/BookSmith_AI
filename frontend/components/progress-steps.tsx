"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Check, Loader2 } from "lucide-react"

interface ProgressStepsProps {
  currentStep: number
}

const steps = [
  { id: 1, label: "Creating outline…" },
  { id: 2, label: "Researching…" },
  { id: 3, label: "Writing chapters…" },
  { id: 4, label: "Finalizing…" },
]

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => {
        const isComplete = currentStep > step.id
        const isActive = currentStep === step.id
        const isPending = currentStep < step.id

        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center gap-3"
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
                isComplete
                  ? "border-accent bg-accent text-accent-foreground"
                  : isActive
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-muted text-muted-foreground"
              }`}
            >
              <AnimatePresence mode="wait">
                {isComplete ? (
                  <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Check className="h-4 w-4" />
                  </motion.div>
                ) : isActive ? (
                  <motion.div key="loader" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </motion.div>
                ) : (
                  <motion.span
                    key="number"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="text-xs font-medium"
                  >
                    {step.id}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <span
              className={`text-sm transition-colors ${
                isComplete ? "text-foreground" : isActive ? "font-medium text-foreground" : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}
