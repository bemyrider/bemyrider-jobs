import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()

    // Verifica che l'annuncio appartenga all'utente
    const existingOffer = await prisma.jobOffer.findFirst({
      where: {
        id,
        createdByEmail: session.user.email,
      },
    })

    if (!existingOffer) {
      return NextResponse.json({ error: 'Annuncio non trovato' }, { status: 404 })
    }

    // Assicuriamoci che vehicleType e days siano array
    const vehicleType = Array.isArray(body.vehicleType) ? body.vehicleType : [body.vehicleType]
    const days = Array.isArray(body.days) ? body.days : []

    // Aggiorna l'annuncio
    const updatedOffer = await prisma.jobOffer.update({
      where: { id },
      data: {
        businessName: body.businessName,
        city: body.city,
        zone: body.zone,
        schedule: body.schedule, // Solo gli orari (es. "18:00-22:00")
        days: days, // Solo i giorni (es. ["Lun", "Mar", "Mer", "Gio", "Ven"])
        vehicleType: vehicleType,
        hourlyRate: body.hourlyRate,
        details: body.details,
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
      },
    })

    return NextResponse.json(updatedOffer)
  } catch (error) {
    console.error('Error updating job offer:', error)
    return NextResponse.json(
      { error: 'Failed to update job offer' },
      { status: 500 }
    )
  }
} 