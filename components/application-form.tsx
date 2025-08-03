"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

interface ApplicationFormProps {
  jobOfferId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function ApplicationForm({ jobOfferId, onSuccess, onCancel }: ApplicationFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    vehicleType: "bici",
    availability: "",
    cvLink: "",
    presentation: ""
  })

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
          message: formData.presentation, // Mappa presentation a message per il database
          jobOfferId
        }),
      })

      if (response.ok) {
        alert("Candidatura inviata con successo! L'esercente ti contatterà presto.")
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          vehicleType: "bici",
          availability: "",
          cvLink: "",
          presentation: ""
        })
        onSuccess?.()
      } else {
        alert("Errore nell'invio della candidatura")
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
        <CardTitle>Candidati per questa posizione</CardTitle>
        <CardDescription>
          Compila il modulo per inviare la tua candidatura
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nome e Cognome *</label>
            <Input
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Mario Rossi"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email *</label>
            <Input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="mario@email.com"
            />
          </div>

          <div>
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

          <div>
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
            <Button type="button" variant="outline" onClick={onCancel}>
              Annulla
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
