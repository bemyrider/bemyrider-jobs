"use client"

import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { JobOffer } from "@prisma/client"

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
    } catch (error) {
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
    } catch (error) {
      alert('Errore di connessione')
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant={offer.isActive ? "default" : "outline"}>
        {offer.isActive ? "Attivo" : "Disattivato"}
      </Badge>
      <a href={`/dashboard/edit/${offer.id}`}>
        <Button variant="outline" size="sm">
          Modifica
        </Button>
      </a>
      <Button 
        onClick={handleToggle} 
        variant="outline" 
        size="sm"
      >
        {offer.isActive ? "Disattiva" : "Attiva"}
      </Button>
      <Button 
        onClick={handleDelete} 
        variant="destructive" 
        size="sm"
      >
        Elimina
      </Button>
    </div>
  )
} 