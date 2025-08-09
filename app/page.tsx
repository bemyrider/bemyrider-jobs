import { JobOffersList } from "@/components/job-offers-list"
import { HelpButton } from "@/components/help-button"

// Force dynamic rendering per contenuto che cambia frequentemente
export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <div className="bg-gray-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <JobOffersList />
      </div>
      <HelpButton tourType="home" />
    </div>
  )
}
