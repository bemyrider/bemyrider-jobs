import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../../../lib/auth'
import { prisma } from '../../../../../../lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const offer = await prisma.jobOffer.findFirst({
      where: {
        id: params.id,
        createdByEmail: session.user.email,
      },
    })

    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
    }

    const updatedOffer = await prisma.jobOffer.update({
      where: { id: params.id },
      data: { isActive: !offer.isActive },
    })

    return NextResponse.json(updatedOffer)
  } catch (error) {
    console.error('Error toggling offer:', error)
    return NextResponse.json({ error: 'Failed to toggle offer' }, { status: 500 })
  }
} 