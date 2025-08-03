"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { JobOffer } from "@prisma/client"

interface CreateJobOfferFormProps {
  onSuccess?: () => void
  initialData?: Partial<JobOffer>
  isEditing?: boolean
  offerId?: string
}

export function CreateJobOfferForm({ onSuccess, initialData, isEditing = false, offerId }: CreateJobOfferFormProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [formData, setFormData] = useState({
    businessName: initialData?.businessName || "",
    city: initialData?.city || "",
    schedule: initialData?.schedule || "",
    days: initialData?.days || [],
    vehicleType: initialData?.vehicleType?.[0] || "qualsiasi",
    hourlyRate: initialData?.hourlyRate || "",
    details: initialData?.details || "",
    contactEmail: initialData?.contactEmail || ""
  })

  const [selectedDays, setSelectedDays] = useState<string[]>(
    Array.isArray(initialData?.days) ? initialData.days : []
  )

  const daysOptions = [
    { value: "Lun", label: "Lunedì" },
    { value: "Mar", label: "Martedì" },
    { value: "Mer", label: "Mercoledì" },
    { value: "Gio", label: "Giovedì" },
    { value: "Ven", label: "Venerdì" },
    { value: "Sab", label: "Sabato" },
    { value: "Dom", label: "Domenica" },
  ]

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => {
      if (prev.includes(day)) {
        return prev.filter(d => d !== day)
      } else {
        return [...prev, day]
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = isEditing ? `/api/dashboard/job-offers/${offerId}` : "/api/job-offers"
      const method = isEditing ? "PUT" : "POST"
      
      const submitData = {
        ...formData,
        days: selectedDays
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        alert(isEditing ? "Annuncio aggiornato con successo!" : "Annuncio creato con successo!")
        if (!isEditing) {
          setFormData({
            businessName: "",
            city: "",
            schedule: "",
            days: [],
            vehicleType: "qualsiasi",
            hourlyRate: "",
            details: "",
            contactEmail: ""
          })
          setSelectedDays([])
          // Reindirizza alla dashboard dopo la creazione di un nuovo annuncio
          router.push('/dashboard')
        } else {
          // Per la modifica, chiama onSuccess se fornito
          onSuccess?.()
        }
      } else {
        alert(isEditing ? "Errore nell'aggiornamento dell'annuncio" : "Errore nella creazione dell'annuncio")
      }
    } catch (error) {
      alert("Errore di connessione")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Modifica Annuncio" : "Pubblica un Annuncio"}</CardTitle>
        <CardDescription>
          {isEditing ? "Modifica i dettagli del tuo annuncio" : "Cerca rider nella tua zona per la tua attività"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nome Attività *</label>
            <Input
              required
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="es. Pizzeria Roma"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Città / Zona *</label>
            <Input
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="es. Milano, Roma, Napoli"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Orari di Lavoro *</label>
            <Input
              required
              value={formData.schedule}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              placeholder="es. 18:00-22:00"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Giorni della Settimana *</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {daysOptions.map((day) => (
                <label key={day.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedDays.includes(day.value)}
                    onChange={() => handleDayToggle(day.value)}
                    className="rounded border-gray-300 text-bemyrider-blue focus:ring-bemyrider-blue"
                  />
                  <span className="text-sm">{day.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Tipo di Mezzo Preferito</label>
            <Select
              value={formData.vehicleType}
              onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona tipo di mezzo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="qualsiasi">Qualsiasi</SelectItem>
                <SelectItem value="bici">Bicicletta</SelectItem>
                <SelectItem value="scooter">Scooter</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="piedi">Mezzo non richiesto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Retribuzione Oraria (opzionale)</label>
            <Input
              value={formData.hourlyRate}
              onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
              placeholder="es. €10-12/ora"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Dettagli Aggiuntivi</label>
            <Textarea
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              placeholder="Descrivi i requisiti, benefici, o altre informazioni utili"
              rows={4}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email di Contatto *</label>
            <Input
              required
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              placeholder="es. nome@email.com"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (isEditing ? "Aggiornando..." : "Pubblicando...") : (isEditing ? "Aggiorna Annuncio" : "Pubblica Annuncio")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
