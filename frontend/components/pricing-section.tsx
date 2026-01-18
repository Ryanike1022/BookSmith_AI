"use client"

import { motion } from "framer-motion"
import { Check, Sparkles, Zap, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "Get started with AI book generation",
    icon: Sparkles,
    features: [
      "Basic AI generation",
      "Standard quality output",
      "PDF download",
      "Up to 5 chapters",
      "Community support",
    ],
    cta: "Start Free",
    href: "/generate",
    highlight: false,
    badge: "Current",
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "Enhanced quality and longer books",
    icon: Zap,
    features: [
      "Advanced AI models",
      "Higher quality prose",
      "Up to 20 chapters",
      "Multiple export formats",
      "Priority generation queue",
      "Email support",
    ],
    cta: "Coming Soon",
    href: "#",
    highlight: true,
    badge: "Popular",
  },
  {
    name: "Enterprise",
    price: "$49",
    period: "/month",
    description: "Maximum quality for serious authors",
    icon: Crown,
    features: [
      "Premium AI models",
      "Publication-ready quality",
      "Unlimited chapters",
      "Custom styling & branding",
      "API access",
      "Dedicated support",
    ],
    cta: "Coming Soon",
    href: "#",
    highlight: false,
    badge: null,
  },
]

export function PricingSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade as you need higher quality output and more features. Our paid tiers use advanced AI
            models for significantly better prose quality.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl border p-8 ${
                tier.highlight ? "border-accent bg-accent/5 shadow-lg shadow-accent/10" : "border-border bg-card"
              }`}
            >
              {tier.badge && (
                <div
                  className={`absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-medium ${
                    tier.highlight ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {tier.badge}
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${tier.highlight ? "bg-accent/20" : "bg-secondary"}`}>
                  <tier.icon className={`h-5 w-5 ${tier.highlight ? "text-accent" : "text-muted-foreground"}`} />
                </div>
                <h3 className="text-xl font-semibold">{tier.name}</h3>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{tier.price}</span>
                {tier.period && <span className="text-muted-foreground">{tier.period}</span>}
              </div>

              <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>

              <ul className="mt-8 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 shrink-0 text-accent" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                {tier.name === "Free" ? (
                  <Link href={tier.href} className="block">
                    <Button className="w-full" variant={tier.highlight ? "default" : "outline"}>
                      {tier.cta}
                    </Button>
                  </Link>
                ) : (
                  <Button className="w-full" variant={tier.highlight ? "default" : "outline"} disabled>
                    {tier.cta}
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          Paid tiers use more advanced AI models that produce significantly better narrative flow, character
          development, and prose quality.
        </motion.p>
      </div>
    </section>
  )
}
