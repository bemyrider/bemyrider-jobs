import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    // Per retrocompatibilità accettiamo sia "vehicle" che "vehicleType" come nome parametro
    const vehicle = searchParams.get('vehicle') ?? searchParams.get('vehicleType')
    const pageParam = parseInt(searchParams.get('page') || '1', 10)
    const pageSizeParam = parseInt(searchParams.get('pageSize') || '10', 10)
    const since = searchParams.get('since') // Per notifiche

    const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam
    const pageSize = Number.isNaN(pageSizeParam) || pageSizeParam < 1 ? 10 : Math.min(pageSizeParam, 50)
    const skip = (page - 1) * pageSize

    const where: Prisma.JobOfferWhereInput = {
      isActive: true,
    }

    if (city) {
      where.city = {
        contains: city,
        mode: 'insensitive',
      }
    }

    if (vehicle) {
      // vehicleType è un array in schema; supportiamo un solo valore alla volta
      where.vehicleType = {
        has: vehicle,
      }
    }

    // Filtro per data (per notifiche)
    if (since) {
      where.createdAt = {
        gte: new Date(since)
      }
    }

    const [items, totalCount] = await Promise.all([
      prisma.jobOffer.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: since ? 0 : skip, // Non paginare se stiamo controllando per notifiche
        take: since ? undefined : pageSize, // Prendi tutti se stiamo controllando per notifiche
      }),
      prisma.jobOffer.count({ where }),
    ])

    return NextResponse.json({ items, totalCount, page, pageSize })
  } catch (error) {
    console.error('Error fetching job offers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch job offers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Assicuriamoci che vehicleType sia un array
    const vehicleType = Array.isArray(body.vehicleType) ? body.vehicleType : [body.vehicleType]
    
    // Gestiamo i giorni separatamente dagli orari
    const days = Array.isArray(body.days) ? body.days : []
    
    const newJobOffer = await prisma.jobOffer.create({
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
        createdByEmail: session.user.email, // Salva l'email dell'utente autenticato
      }
    })

    return NextResponse.json(newJobOffer, { status: 201 })
  } catch (error) {
    console.error('Error creating job offer:', error)
    return NextResponse.json(
      { error: 'Failed to create job offer' },
      { status: 500 }
    )
  }
}
