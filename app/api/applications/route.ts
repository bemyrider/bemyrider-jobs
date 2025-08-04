import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { sendApplicationEmail } from '../../../lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Salva la candidatura nel database
    const application = await prisma.application.create({
      data: {
        jobOfferId: body.jobOfferId,
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        vehicleType: body.vehicleType,
        availability: body.availability,
        cvLink: body.cvLink,
        message: body.message || body.presentation, // Usa message se presente, altrimenti presentation
      },
      include: {
        jobOffer: true
      }
    })

    // Invia email di notifica all'esercente
    try {
      await sendApplicationEmail({
        to: application.jobOffer.contactEmail,
        businessName: application.jobOffer.businessName,
        applicantName: application.fullName,
        applicantEmail: application.email,
        applicantPhone: application.phone,
        vehicleType: application.vehicleType,
        availability: application.availability,
        cvLink: application.cvLink || undefined,
        message: application.message || undefined,
      })
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      // Non blocchiamo la candidatura se l'email fallisce
    }

    return NextResponse.json(
      { message: 'Application submitted successfully', id: application.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error submitting application:', error)
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}

// Endpoint per ottenere le candidature (per future dashboard)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobOfferId = searchParams.get('jobOfferId')

    const where = jobOfferId ? { jobOfferId } : {}

    const applications = await prisma.application.findMany({
      where,
      include: {
        jobOffer: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(applications)
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}
