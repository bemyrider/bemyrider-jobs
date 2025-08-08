import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { CreateJobOfferForm } from "@/components/create-job-offer-form"

interface EditPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPage({ params }: EditPageProps) {
  const session = await getServerSession()

  if (!session?.user?.email) {
    redirect("/api/auth/signin")
  }

  const { id } = await params
  
  const offer = await prisma.jobOffer.findUnique({
    where: {
      id,
      createdByEmail: session.user.email,
    },
  })

  if (!offer) {
    redirect("/dashboard")
  }

  return (
    <div className="bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Modifica Annuncio</h1>
          <p className="text-gray-600">
            Modifica i dettagli del tuo annuncio di lavoro.
          </p>
        </div>
        
        <CreateJobOfferForm initialData={offer} isEditing={true} offerId={id} />
      </div>
    </div>
  )
} 