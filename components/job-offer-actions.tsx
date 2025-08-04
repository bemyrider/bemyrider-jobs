"use client"

import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { JobOffer } from "@prisma/client"
import { Pencil, X, Power, PowerOff } from "lucide-react"

interface JobOfferActionsProps {
  offer: JobOffer
}

export function JobOfferActions({ offer }: JobOfferActionsProps) {
  const handleDelete = async () => {
    if (!confirm('Sei sicuro di voler eliminare questo annuncio? Questa azione non può essere annullata.')) {
      return
    }

    try {
      const response = await fetch(`/api/dashboard/job-offers/${offer.id}/delete`, {
        method: 'DELETE',
      })

      if (response.ok) {
        window.location.reload()
      } else {
        alert('Errore durante l\'eliminazione')
      }
    } catch {
      alert('Errore di connessione')
    }
  }

  const handleToggle = async () => {
    try {
      const response = await fetch(`/api/dashboard/job-offers/${offer.id}/toggle`, {
        method: 'POST',
      })

      if (response.ok) {
        window.location.reload()
      } else {
        alert('Errore durante l\'aggiornamento')
      }
    } catch {
      alert('Errore di connessione')
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
      <Badge variant={offer.isActive ? "default" : "outline"} className="self-start">
        {offer.isActive ? "Attivo" : "Disattivato"}
      </Badge>
      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
        <a href={`/dashboard/edit/${offer.id}`} className="flex-1 sm:flex-none">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full sm:w-auto h-9 px-3"
            title="Modifica annuncio"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </a>
        <Button 
          onClick={handleToggle} 
          variant="outline" 
          size="sm"
          className="flex-1 sm:flex-none w-full sm:w-auto h-9 px-3"
          title={offer.isActive ? "Disattiva annuncio" : "Attiva annuncio"}
        >
          {offer.isActive ? (
            <PowerOff className="h-4 w-4" />
          ) : (
            <Power className="h-4 w-4" />
          )}
        </Button>
        <Button 
          onClick={handleDelete} 
          variant="destructive" 
          size="sm"
          className="flex-1 sm:flex-none w-full sm:w-auto h-9 px-3"
          title="Elimina annuncio"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
} 