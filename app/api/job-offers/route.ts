import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const vehicleType = searchParams.get('vehicleType')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Costruisci i filtri
    const where: Prisma.JobOfferWhereInput = {
      isActive: true,
    }

    if (city) {
      where.city = {
        contains: city,
        mode: 'insensitive',
      }
    }

    if (vehicleType && vehicleType !== 'tutti') {
      where.vehicleType = {
        has: vehicleType,
      }
    }

    // Esegui la query con paginazione
    const [offers, totalCount] = await Promise.all([
      prisma.jobOffer.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.jobOffer.count({ where }),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      offers,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    })
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
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      businessName,
      city,
      zone,
      schedule,
      days,
      vehicleType,
      hourlyRate,
      details,
      contactEmail,
      contactPhone,
    } = body

    // Validazione dei campi obbligatori
    if (!businessName || !city || !schedule || !days || !vehicleType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const offer = await prisma.jobOffer.create({
      data: {
        businessName,
        city,
        zone,
        schedule,
        days,
        vehicleType,
        hourlyRate,
        details,
        contactEmail: contactEmail || session.user.email,
        contactPhone,
        createdByEmail: session.user.email,
      },
    })

    return NextResponse.json(offer, { status: 201 })
  } catch (error) {
    console.error('Error creating job offer:', error)
    return NextResponse.json(
      { error: 'Failed to create job offer' },
      { status: 500 }
    )
  }
}
