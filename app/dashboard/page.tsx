import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { JobOfferActions } from "@/components/job-offer-actions"
import { JobOffersList } from "@/components/job-offers-list"
import { prisma } from "@/lib/prisma"
import { JobOffer, Application } from "@prisma/client"

type JobOfferWithApplications = JobOffer & {
  _count: { applications: number }
  applications: Application[]
}

async function getData(email: string): Promise<JobOfferWithApplications[]> {
  const offers = await prisma.jobOffer.findMany({
    where: {
      createdByEmail: email,
    },
    include: {
      _count: {
        select: {
          applications: true,
        },
      },
      applications: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return offers
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/signin")
  }

  const offers = await getData(session.user.email)

  return (
    <div className="bg-background pt-16">
      {/* Pulsante fisso per pubblicare annuncio */}
      <div className="fixed top-20 right-4 z-40">
        <Button asChild className="shadow-lg">
          <a href="/publish">Pubblica Annuncio</a>
        </Button>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Sezione di benvenuto */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Benvenuto nella tua Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            In questa sezione puoi gestire tutti i tuoi annunci di lavoro. 
            Pubblica nuove offerte, modifica quelle esistenti o elimina quelle non più attive. 
            Qui vedrai anche tutte le candidature ricevute per ogni posizione.
          </p>
        </div>

        {/* Lista degli annunci */}
        <JobOffersList offers={offers} />
      </div>
    </div>
  )
}
