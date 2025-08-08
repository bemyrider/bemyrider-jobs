"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { X } from "lucide-react"
import { useTooltip } from "./tooltip-provider"

interface JobOffer {
  id: string
  businessName: string
  city: string
}

interface ApplicationModalProps {
  jobOffer: JobOffer
  isOpen: boolean
  onClose: () => void
}

export function ApplicationModal({ jobOffer, isOpen, onClose }: ApplicationModalProps) {
  const [loading, setLoading] = useState(false)
  const { startApplicationTour } = useTooltip()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    vehicleType: "",
    availability: "",
    cvLink: "",
    presentation: ""
  })

  // Avvia il tour quando il modal si apre per la prima volta
  useEffect(() => {
    if (isOpen) {
      const hasSeenApplicationTour = localStorage.getItem('bemyrider-welcome-application')
      if (!hasSeenApplicationTour) {
        // Delay per permettere al modal di renderizzare completamente
        const timer = setTimeout(() => {
          startApplicationTour()
          localStorage.setItem('bemyrider-welcome-application', 'true')
        }, 500)
        return () => clearTimeout(timer)
      }
    }
  }, [isOpen, startApplicationTour])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          jobOfferId: jobOffer.id
        }),
      })

      if (response.ok) {
        alert("Candidatura inviata con successo! L'esercente ti contatterà presto.")
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          vehicleType: "",
          availability: "",
          cvLink: "",
          presentation: ""
        })
        onClose()
      } else {
        alert("Errore nell'invio della candidatura")
      }
    } catch {
      alert("Errore di connessione")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto application-modal">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Candidati per {jobOffer.businessName}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="contact-fields">
              <label className="text-sm font-medium">Nome e Cognome *</label>
              <Input
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Mario Rossi"
              />
            </div>

            <div className="contact-fields">
              <label className="text-sm font-medium">Email *</label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="mario@email.com"
              />
            </div>

            <div className="contact-fields">
              <label className="text-sm font-medium">Telefono *</label>
              <Input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+39 123 456 7890"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tipo di Mezzo *</label>
              <Select
                required
                value={formData.vehicleType}
                onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona il tuo mezzo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bici">Bicicletta</SelectItem>
                  <SelectItem value="scooter">Scooter</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                                          <SelectItem value="piedi">Mezzo non richiesto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Disponibilità Oraria *</label>
              <Input
                required
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                placeholder="es. Part-time serale, Full-time"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Link CV (opzionale)</label>
              <Input
                type="url"
                value={formData.cvLink}
                onChange={(e) => setFormData({ ...formData, cvLink: e.target.value })}
                placeholder="https://linkedin.com/in/tuonome"
              />
            </div>

            <div className="presentation-field">
              <label className="text-sm font-medium">Breve Presentazione *</label>
              <Textarea
                required
                value={formData.presentation}
                onChange={(e) => setFormData({ ...formData, presentation: e.target.value })}
                placeholder="Presentati brevemente e spiega perché sei il candidato ideale"
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Inviando..." : "Invia Candidatura"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Annulla
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
