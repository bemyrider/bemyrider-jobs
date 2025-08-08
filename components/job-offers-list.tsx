'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { MapPin, Clock, Bike, Car, BikeIcon, Footprints, Search, SlidersHorizontal, X, Euro, ChevronDown, ChevronUp } from 'lucide-react'
import { ApplicationModal } from './application-modal'


interface JobOffer {
  id: string
  businessName: string
  city: string
  zone?: string
  schedule: string
  days: string[]
  vehicleType: string[]
  hourlyRate?: string
  details?: string
  contactEmail: string
  contactPhone?: string
  createdAt: string
}

export function JobOffersList() {
  const [items, setItems] = useState<JobOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [cityFilter, setCityFilter] = useState('')
  const [cityFilterDebounced, setCityFilterDebounced] = useState('')
  const [vehicleFilter, setVehicleFilter] = useState('tutti')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [totalCount, setTotalCount] = useState(0)

  const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  
  // Stato per tracking dell'espansione delle descrizioni
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set())

  // Funzione per toggle dell'espansione della descrizione
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

  // Debounce per il filtro città
  useEffect(() => {
    const timer = setTimeout(() => {
      setCityFilterDebounced(cityFilter)
    }, 500)

    return () => clearTimeout(timer)
  }, [cityFilter])

  // Build query string from filters and pagination
  const buildQuery = useCallback((p: number) => {
    const params = new URLSearchParams()
    if (cityFilterDebounced) params.set('city', cityFilterDebounced)
    if (vehicleFilter && vehicleFilter !== 'tutti') params.set('vehicleType', vehicleFilter)
    params.set('page', String(p))
    params.set('limit', String(pageSize))
    return params.toString()
  }, [cityFilterDebounced, vehicleFilter, pageSize])

  // Fetch page helper
  const fetchPage = useCallback(async (p: number, append = false) => {
    try {
      if (append) setLoadingMore(true)
      else {
        setLoading(true)
        setError(null)
      }

      const qs = buildQuery(p)
      const res = await fetch(`/api/job-offers?${qs}`, { cache: 'no-store' })
      const data = await res.json()

      const newItems: JobOffer[] = Array.isArray(data)
        ? data // fallback legacy (array)
        : Array.isArray(data?.offers)
          ? data.offers
          : Array.isArray(data?.items)
            ? data.items
            : []

      const newTotal = typeof data?.pagination?.totalCount === 'number' 
        ? data.pagination.totalCount 
        : typeof data?.totalCount === 'number' 
          ? data.totalCount 
          : (Array.isArray(data) ? data.length : 0)

      if (append) {
        setItems(prev => [...prev, ...newItems])
      } else {
        setItems(newItems)
      }
      setTotalCount(newTotal)
    } catch (e: unknown) {
      console.error('Error fetching job offers:', e)
      setError('Errore nel caricamento degli annunci')
      if (!append) setItems([])
    } finally {
      if (append) setLoadingMore(false)
      else setLoading(false)
    }
  }, [buildQuery])

  // Initial load
  useEffect(() => {
    fetchPage(1, false)
    setPage(1)
  }, [fetchPage])

  // Refetch on filter change (reset page)
  useEffect(() => {
    fetchPage(1, false)
    setPage(1)
  }, [cityFilterDebounced, vehicleFilter, fetchPage])

  const canLoadMore = items.length < totalCount

  const handleLoadMore = async () => {
    const next = page + 1
    await fetchPage(next, true)
    setPage(next)
  }

  const handleClearCityFilter = () => {
    setCityFilter('')
    setCityFilterDebounced('')
  }

  const handleClearVehicleFilter = () => {
    setVehicleFilter('tutti')
  }

  const handleVehicleFilterChange = (value: string) => {
    setVehicleFilter(value)
    // Chiudi il pannello dopo la selezione
    setTimeout(() => setIsSheetOpen(false), 300)
  }

  const getVehicleIcon = (vehicle: string) => {
    switch (vehicle) {
      case 'bici': return <BikeIcon className="h-4 w-4" />
      case 'scooter': return <Bike className="h-4 w-4" />
      case 'auto': return <Car className="h-4 w-4" />
      case 'piedi': return <Footprints className="h-4 w-4" />
      default: return null
    }
  }

  const getVehicleLabel = (vehicle: string) => {
    switch (vehicle) {
      case 'bici': return 'Bicicletta'
      case 'scooter': return 'Scooter'
      case 'auto': return 'Automobile'
      case 'piedi': return 'Mezzo non richiesto'
      default: return vehicle
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex flex-col space-y-4">
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-72 bg-muted animate-pulse rounded" />
          <div className="flex gap-4">
            <div className="h-10 w-full max-w-sm bg-muted animate-pulse rounded" />
            <div className="h-10 w-32 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4 space-y-3">
              <div className="h-5 w-2/3 bg-muted animate-pulse rounded" />
              <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">

      {/* Header con ricerca e filtri */}
      <div className="flex flex-col space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-bemyrider-blue">Trova il tuo prossimo ingaggio</h1>
        <p className="text-muted-foreground">Esplora le opportunità di ingaggio disponibili nella tua zona</p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca per città..."
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button 
            variant="outline" 
            className="gap-2 border-bemyrider-blue text-bemyrider-blue hover:bg-bemyrider-blue hover:text-white"
            onClick={() => setIsSheetOpen(!isSheetOpen)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtri
            {(cityFilterDebounced || (vehicleFilter && vehicleFilter !== 'tutti')) && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                {(cityFilterDebounced ? 1 : 0) + (vehicleFilter && vehicleFilter !== 'tutti' ? 1 : 0)}
              </Badge>
            )}
          </Button>

          {/* Modal Filtri */}
          {isSheetOpen && (
            <div 
              className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
              onClick={() => setIsSheetOpen(false)}
            >
              <div 
                className="bg-white rounded-lg shadow-xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-6 border-b">
                  <div>
                    <h2 className="text-xl font-semibold">Filtra Annunci</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Seleziona i criteri per filtrare gli annunci
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsSheetOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo di mezzo richiesto</label>
                    <Select value={vehicleFilter} onValueChange={handleVehicleFilterChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona un mezzo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tutti">Tutti i mezzi</SelectItem>
                        <SelectItem value="bici">Bicicletta</SelectItem>
                        <SelectItem value="scooter">Scooter</SelectItem>
                        <SelectItem value="auto">Automobile</SelectItem>
                        <SelectItem value="piedi">Mezzo non richiesto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={() => setIsSheetOpen(false)}
                      variant="outline"
                      className="flex-1 border-bemyrider-blue text-bemyrider-blue hover:bg-bemyrider-blue hover:text-white"
                    >
                      Chiudi
                    </Button>
                    <Button 
                      onClick={() => {
                        setVehicleFilter('tutti')
                        setIsSheetOpen(false)
                      }}
                      variant="ghost"
                      className="flex-1 text-bemyrider-orange hover:bg-bemyrider-orange hover:text-white"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filtri attivi */}
      {(cityFilterDebounced || (vehicleFilter && vehicleFilter !== 'tutti')) && (
        <div className="flex flex-wrap gap-2">
          {cityFilterDebounced && (
            <Badge variant="secondary" className="gap-2">
              <MapPin className="h-3 w-3" />
              {cityFilterDebounced}
              <button onClick={handleClearCityFilter} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {vehicleFilter && vehicleFilter !== 'tutti' && (
            <Badge variant="secondary" className="gap-2">
              {getVehicleIcon(vehicleFilter)}
              {getVehicleLabel(vehicleFilter)}
              <button onClick={handleClearVehicleFilter} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Lista annunci */}
      <div className="space-y-6">
        {error && (
          <div className="text-center py-8 text-red-600">{error}</div>
        )}

        {items.length === 0 && !error ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {cityFilterDebounced || (vehicleFilter && vehicleFilter !== 'tutti') 
                ? 'Nessun annuncio trovato con i filtri applicati' 
                : 'Nessun annuncio trovato'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((offer) => (
              <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{offer.businessName}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {offer.city} {offer.zone && `- ${offer.zone}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(offer.vehicleType) ? offer.vehicleType : [offer.vehicleType]).map((vehicle, index) => (
                      <Badge key={`${offer.id}-vehicle-${index}`} variant="secondary" className="flex items-center gap-1">
                        {getVehicleIcon(vehicle)}
                        {getVehicleLabel(vehicle)}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{offer.schedule}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {(Array.isArray(offer.days) ? offer.days : [offer.days]).map((day, index) => (
                      <Badge key={`${offer.id}-day-${index}`} variant="outline">{day}</Badge>
                    ))}
                  </div>

                  {offer.details && (
                    <div className="space-y-2">
                      <p className={`text-sm text-muted-foreground ${expandedDescriptions.has(offer.id) ? '' : 'line-clamp-2'}`}>
                        {offer.details}
                      </p>
                      {offer.details.length > 100 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleDescription(offer.id)}
                          className="h-auto p-0 text-xs text-bemyrider-blue hover:text-bemyrider-blue/80 hover:bg-transparent"
                        >
                          {expandedDescriptions.has(offer.id) ? (
                            <>
                              Mostra meno <ChevronUp className="h-3 w-3 ml-1" />
                            </>
                          ) : (
                            <>
                              Leggi di più <ChevronDown className="h-3 w-3 ml-1" />
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-4">
                  {offer.hourlyRate && (
                                      <div className="flex items-center gap-1 text-bemyrider-orange font-medium">
                    <Euro className="h-4 w-4" />
                    {offer.hourlyRate}/ora
                  </div>
                  )}
                  <Button 
                    onClick={() => setSelectedOffer(offer)}
                    className="ml-auto bg-bemyrider-orange hover:bg-bemyrider-orange/90 text-white"
                  >
                    Candidati
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        {canLoadMore && (
          <div className="flex justify-center py-6">
            <Button onClick={handleLoadMore} disabled={loadingMore} variant="outline">
              {loadingMore ? 'Caricamento...' : 'Carica altri'}
            </Button>
          </div>
        )}
      </div>

      {selectedOffer && (
        <ApplicationModal
          jobOffer={selectedOffer}
          isOpen={!!selectedOffer}
          onClose={() => setSelectedOffer(null)}
        />
      )}
    </div>
  )
}
