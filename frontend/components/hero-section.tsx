"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpenCheck, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-32 pb-20">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground"
          >
            <Sparkles className="h-4 w-4 text-accent" />
            <span>AI-Powered Book Generation</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-4xl text-5xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            Generate a book in minutes.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg text-muted-foreground text-pretty leading-relaxed"
          >
            Choose a genre, describe your idea, and get a beautifully formatted book + PDF. Transform your concepts into
            complete manuscripts with the power of AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10"
          >
            <Link href="/generate">
              <Button size="lg" className="h-12 gap-2 px-8 text-base">
                <BookOpenCheck className="h-5 w-5" />
                Generate a Book
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-20 w-full max-w-5xl"
          >
            <div className="relative rounded-2xl border border-border bg-card p-2 shadow-2xl shadow-primary/5">
              <div className="absolute -top-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
              <div className="rounded-xl bg-muted/30 p-8">
                <div className="flex gap-8">
                  <div className="flex-1 space-y-4">
                    <div className="h-3 w-24 rounded bg-muted" />
                    <div className="h-10 rounded-lg bg-muted" />
                    <div className="h-3 w-20 rounded bg-muted" />
                    <div className="h-10 rounded-lg bg-muted" />
                    <div className="h-3 w-28 rounded bg-muted" />
                    <div className="h-24 rounded-lg bg-muted" />
                  </div>
                  <div className="hidden flex-1 flex-col items-center justify-center rounded-xl border border-border bg-card p-8 lg:flex">
                    <BookOpenCheck className="h-16 w-16 text-accent/40" />
                    <p className="mt-4 text-sm text-muted-foreground">Your book preview will appear here</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
