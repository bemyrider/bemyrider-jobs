import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { CreateJobOfferForm } from "@/components/create-job-offer-form"
import { HelpButton } from "@/components/help-button"

export default async function PublishPage() {
  const session = await getServerSession()

  if (!session?.user?.email) {
    redirect("/api/auth/signin")
  }

  return (
    <div className="bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pubblica Annuncio</h1>
          <p className="text-gray-600">
            Crea un nuovo annuncio di lavoro per trovare il rider perfetto per la tua attività.
          </p>
        </div>
        
        <CreateJobOfferForm />
      </div>
      <HelpButton tourType="publish" />
    </div>
  )
}
