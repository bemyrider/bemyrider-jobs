"use client"

import { useRef } from "react"
import { JobOffersList } from "../components/job-offers-list"

export default function HomePage() {
  const listRef = useRef<HTMLDivElement>(null)

  return (
    <div className="min-h-screen">
      {/* LISTA ANNUNCI */}
      <section ref={listRef} className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="max-w-6xl mx-auto">
          <JobOffersList />
        </div>
      </section>
    </div>
  )
}
