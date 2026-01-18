"use client"

import { motion } from "framer-motion"

interface BookAnimationProps {
  isAnimating: boolean
}

export function BookAnimation({ isAnimating }: BookAnimationProps) {
  return (
    <div className="relative flex h-48 w-48 items-center justify-center">
      {/* Book spine */}
      <motion.div
        className="absolute h-36 w-3 origin-left rounded-l-sm bg-primary"
        style={{ left: "50%", transform: "translateX(-50%)" }}
      />

      {/* Left page (back cover) */}
      <motion.div
        className="absolute h-36 w-24 origin-right rounded-l-md bg-card shadow-lg"
        style={{
          right: "50%",
          borderLeft: "4px solid var(--primary)",
        }}
        initial={{ rotateY: 0 }}
        animate={isAnimating ? { rotateY: [0, -30, 0] } : { rotateY: 0 }}
        transition={{
          duration: 2,
          repeat: isAnimating ? Number.POSITIVE_INFINITY : 0,
          ease: "easeInOut",
        }}
      >
        <div className="flex h-full flex-col justify-center p-4">
          <div className="mb-2 h-2 w-12 rounded bg-muted" />
          <div className="h-2 w-16 rounded bg-muted" />
          <div className="mt-4 space-y-1">
            <div className="h-1 w-full rounded bg-muted/60" />
            <div className="h-1 w-full rounded bg-muted/60" />
            <div className="h-1 w-3/4 rounded bg-muted/60" />
          </div>
        </div>
      </motion.div>

      {/* Right page (front cover) */}
      <motion.div
        className="absolute h-36 w-24 origin-left rounded-r-md bg-card shadow-xl"
        style={{
          left: "50%",
          borderRight: "2px solid var(--border)",
        }}
        initial={{ rotateY: 0 }}
        animate={isAnimating ? { rotateY: [0, 30, 0] } : { rotateY: 0 }}
        transition={{
          duration: 2,
          repeat: isAnimating ? Number.POSITIVE_INFINITY : 0,
          ease: "easeInOut",
        }}
      >
        <div className="flex h-full flex-col justify-center p-4">
          <div className="mb-2 h-2 w-12 rounded bg-accent/40" />
          <div className="h-2 w-16 rounded bg-accent/30" />
          <div className="mt-4 space-y-1">
            <div className="h-1 w-full rounded bg-muted/60" />
            <div className="h-1 w-full rounded bg-muted/60" />
            <div className="h-1 w-3/4 rounded bg-muted/60" />
          </div>
        </div>
      </motion.div>

      {/* Floating pages effect */}
      {isAnimating && (
        <>
          <motion.div
            className="absolute h-32 w-20 rounded bg-muted/30"
            style={{ left: "calc(50% + 2px)" }}
            initial={{ rotateY: 0, opacity: 0 }}
            animate={{ rotateY: [0, 45, 0], opacity: [0, 0.5, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.3,
            }}
          />
          <motion.div
            className="absolute h-32 w-20 rounded bg-muted/20"
            style={{ left: "calc(50% + 4px)" }}
            initial={{ rotateY: 0, opacity: 0 }}
            animate={{ rotateY: [0, 60, 0], opacity: [0, 0.3, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.6,
            }}
          />
        </>
      )}

      {/* Sparkle effects when animating */}
      {isAnimating && (
        <>
          <motion.div
            className="absolute h-2 w-2 rounded-full bg-accent"
            initial={{ scale: 0, x: 40, y: -40 }}
            animate={{ scale: [0, 1, 0], x: [40, 60, 80], y: [-40, -60, -80] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
          />
          <motion.div
            className="absolute h-1.5 w-1.5 rounded-full bg-accent"
            initial={{ scale: 0, x: -40, y: -30 }}
            animate={{ scale: [0, 1, 0], x: [-40, -60, -80], y: [-30, -50, -70] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
          />
          <motion.div
            className="absolute h-1 w-1 rounded-full bg-primary"
            initial={{ scale: 0, x: 30, y: 40 }}
            animate={{ scale: [0, 1, 0], x: [30, 50, 70], y: [40, 60, 80] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
          />
        </>
      )}
    </div>
  )
}
