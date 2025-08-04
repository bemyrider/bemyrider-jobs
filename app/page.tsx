"use client"

import { JobOffersList } from "@/components/job-offers-list"

export default function HomePage() {
  return (
    <div className="bg-gray-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <JobOffersList />
      </div>
    </div>
  )
}
