import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../../../lib/auth'
import { prisma } from '../../../../../../lib/prisma'

export async function DELETE(
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

    await prisma.jobOffer.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Offer deleted successfully' })
  } catch (error) {
    console.error('Error deleting offer:', error)
    return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 })
  }
} 