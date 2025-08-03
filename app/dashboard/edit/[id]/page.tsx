import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { prisma } from "../../../../lib/prisma"
import { notFound } from "next/navigation"
import { CreateJobOfferForm } from "../../../../components/create-job-offer-form"

async function getJobOffer(id: string, userEmail: string) {
  const offer = await prisma.jobOffer.findFirst({
    where: {
      id,
      createdByEmail: userEmail,
    },
  })
  return offer
}

export default async function EditJobOfferPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    redirect("/api/auth/signin")
  }

  const { id } = await params
  const offer = await getJobOffer(id, session.user.email)
  if (!offer) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Modifica Annuncio</h1>
          <p className="text-lg text-gray-600">
            Modifica i dettagli del tuo annuncio
          </p>
        </div>
        
        <CreateJobOfferForm 
          initialData={offer}
          isEditing={true}
          offerId={id}
        />
      </div>
    </div>
  )
} 