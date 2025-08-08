'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { MapPin, Clock, Bike, Car, BikeIcon, Footprints, Euro, ChevronDown, ChevronUp } from 'lucide-react'
import { JobOfferActions } from './job-offer-actions'
import { JobOffer, Application } from '@prisma/client'
import { useState } from 'react'

type JobOfferWithApplications = JobOffer & {
  _count: { applications: number }
  applications: Application[]
}

interface DashboardJobOffersListProps {
  offers: JobOfferWithApplications[]
}

export function DashboardJobOffersList({ offers }: DashboardJobOffersListProps) {
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set())

  const toggleDescription = (offerId: string) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(offerId)) {
        newSet.delete(offerId)
      } else {
        newSet.add(offerId)
      }
      return newSet
    })
  }

  const getVehicleIcon = (vehicle: string) => {
    switch (vehicle.toLowerCase()) {
      case 'bici':
      case 'bike':
        return <Bike className="h-4 w-4" />
      case 'auto':
      case 'car':
        return <Car className="h-4 w-4" />
      case 'scooter':
        return <BikeIcon className="h-4 w-4" />
      case 'piedi':
      case 'foot':
        return <Footprints className="h-4 w-4" />
      default:
        return <Bike className="h-4 w-4" />
    }
  }

  const getVehicleLabel = (vehicle: string) => {
    switch (vehicle.toLowerCase()) {
      case 'bici':
      case 'bike':
        return 'Bici'
      case 'auto':
      case 'car':
        return 'Auto'
      case 'scooter':
        return 'Scooter'
      case 'piedi':
      case 'foot':
        return 'A piedi'
      default:
        return vehicle
    }
  }

  if (offers.length === 0) {
    return (
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
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
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
  )
} 