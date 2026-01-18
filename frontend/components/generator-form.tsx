"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Sparkles } from "lucide-react"

interface GeneratorFormProps {
  formData: {
    genre: string
    topic: string
    description: string
    tone: string
    audience: string
  }
  setFormData: (data: GeneratorFormProps["formData"]) => void
  onSubmit: () => void
  isGenerating: boolean
}

const genres = ["Self-help", "Business", "Productivity", "Finance", "Health", "Technology/AI", "Education"]

const tones = ["Neutral", "Motivational", "Professional", "Friendly"]

export function GeneratorForm({ formData, setFormData, onSubmit, isGenerating }: GeneratorFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex h-full flex-col"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Create Your Book</h2>
        <p className="mt-1 text-sm text-muted-foreground">Fill in the details below to generate your custom book</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-5">
        <div className="space-y-2">
          <Label htmlFor="genre">Genre</Label>
          <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
            <SelectTrigger id="genre" className="h-11">
              <SelectValue placeholder="Select a genre" />
            </SelectTrigger>
            <SelectContent>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Input
            id="topic"
            placeholder="e.g., Building habits for success"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Description <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Provide additional details about your book..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="min-h-[100px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tone">Tone</Label>
          <Select value={formData.tone} onValueChange={(value) => setFormData({ ...formData, tone: value })}>
            <SelectTrigger id="tone" className="h-11">
              <SelectValue placeholder="Select a tone" />
            </SelectTrigger>
            <SelectContent>
              {tones.map((tone) => (
                <SelectItem key={tone} value={tone}>
                  {tone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="audience">Target Audience</Label>
          <Input
            id="audience"
            placeholder="e.g., Young professionals, entrepreneurs"
            value={formData.audience}
            onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
            className="h-11"
          />
        </div>

        <div className="mt-auto pt-4">
          <Button
            type="submit"
            size="lg"
            className="h-12 w-full gap-2 text-base"
            disabled={isGenerating || !formData.genre || !formData.topic}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate Book
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
