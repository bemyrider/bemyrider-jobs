import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { prisma } from "../../lib/prisma"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { JobOfferActions } from "../../components/job-offer-actions"
import { JobOffer, Application } from "@prisma/client"

type JobOfferWithApplications = JobOffer & {
  _count: { applications: number }
  applications: Application[]
}

async function getData(email: string): Promise<JobOfferWithApplications[]> {
  const offers = await prisma.jobOffer.findMany({
    where: { createdByEmail: { equals: email } },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { applications: true } },
      applications: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
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
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-bemyrider-blue">Dashboard esercente</h1>
          <p className="text-sm text-muted-foreground">Gestisci i tuoi annunci e visualizza le candidature</p>
        </div>
        <a href="/publish">
          <Button className="bg-bemyrider-orange hover:bg-bemyrider-orange/90">Pubblica nuovo annuncio</Button>
        </a>
      </div>

      {offers.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nessun annuncio pubblicato</CardTitle>
            <CardDescription>Pubblica il tuo primo annuncio per iniziare a ricevere candidature.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-6">
          {offers.map((offer) => (
            <Card key={offer.id} className="border">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{offer.businessName}</CardTitle>
                    <CardDescription>
                      {offer.city} {offer.zone ? `- ${offer.zone}` : ""} • {offer.schedule}
                    </CardDescription>
                  </div>
                  <JobOfferActions offer={offer} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(offer.vehicleType) ? offer.vehicleType : [offer.vehicleType]).map((v, i) => (
                    <Badge key={`${offer.id}-veh-${i}`} variant="secondary">{v}</Badge>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  Candidature totali: {offer._count?.applications ?? 0}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <h3 className="font-medium">Candidature recenti</h3>
                {offer.applications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Ancora nessuna candidatura.</p>
                ) : (
                  <div className="space-y-3">
                    {offer.applications.map((app: Application) => (
                      <div key={app.id} className="rounded-md border p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <div className="font-medium">{app.fullName}</div>
                            <div className="text-xs text-muted-foreground">{app.email} • {app.phone}</div>
                          </div>
                          <Badge variant="outline">{app.vehicleType}</Badge>
                        </div>
                        <div className="mt-2 text-sm">
                          <div><span className="text-muted-foreground">Disponibilità:</span> {app.availability}</div>
                          {app.cvLink ? (
                            <div className="truncate">
                              <span className="text-muted-foreground">CV:</span>{" "}
                              <a className="text-primary underline" href={app.cvLink} target="_blank" rel="noreferrer">
                                {app.cvLink}
                              </a>
                            </div>
                          ) : null}
                          {app.message ? (
                            <div className="mt-2 text-muted-foreground whitespace-pre-wrap">{app.message}</div>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
