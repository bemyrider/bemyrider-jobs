import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { JobOfferActions } from "@/components/job-offer-actions"
import { HelpButton } from "@/components/help-button"
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
  const session = await getServerSession()

  if (!session?.user?.email) {
    redirect("/api/auth/signin")
  }

  const offers = await getData(session.user.email)

  return (
    <div className="bg-background pt-16">
      {/* Pulsante fisso per pubblicare annuncio */}
      <div className="fixed top-20 right-4 z-40 publish-button">
        <Button asChild className="shadow-lg">
          <a href="/publish">Pubblica Annuncio</a>
        </Button>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Sezione di benvenuto */}
        <div className="mb-8 dashboard-welcome">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Benvenuto nella tua Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            In questa sezione puoi gestire tutti i tuoi annunci di lavoro. 
            Pubblica nuove offerte, modifica quelle esistenti o elimina quelle non più attive. 
            Qui vedrai anche tutte le candidature ricevute per ogni posizione.
          </p>
        </div>

        {offers.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Non hai ancora pubblicato nessun annuncio.
                </p>
                <Button asChild>
                  <a href="/publish">Pubblica il tuo primo annuncio</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 md:space-y-6 job-offers-list">
            {offers.map((offer) => (
              <Card key={offer.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <CardTitle className="text-lg">{offer.businessName}</CardTitle>
                      <CardDescription>
                        {offer.city} {offer.zone ? `- ${offer.zone}` : ""} • {offer.schedule}
                      </CardDescription>
                    </div>
                    <JobOfferActions offer={offer} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Dettagli</h4>
                      <p className="text-sm text-muted-foreground">{offer.details}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Orari di Lavoro</h4>
                        <p className="text-sm text-muted-foreground">{offer.schedule}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Giorni</h4>
                        <p className="text-sm text-muted-foreground">
                          {offer.days && offer.days.length > 0 
                            ? offer.days.join(", ") 
                            : "Non specificato"
                          }
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">
                        Candidature ({offer._count.applications})
                      </h4>
                      {offer.applications.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Nessuna candidatura ancora.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {offer.applications.map((app) => (
                            <div key={app.id} className="p-3 bg-gray-50 rounded-md">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <div>
                                  <p className="font-medium">{app.fullName}</p>
                                  <p className="text-sm text-muted-foreground">{app.email}</p>
                                  <p className="text-sm text-muted-foreground">{app.phone}</p>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(app.createdAt).toLocaleDateString("it-IT")}
                                </div>
                              </div>
                              {app.message && app.message.trim() ? (
                                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                                  <div className="text-xs font-medium text-muted-foreground mb-1">Messaggio del candidato:</div>
                                  <div className="text-sm text-gray-700 whitespace-pre-wrap">{app.message}</div>
                                </div>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <HelpButton tourType="dashboard" />
    </div>
  )
}
