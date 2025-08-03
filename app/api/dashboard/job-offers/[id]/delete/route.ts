import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

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

    // Elimina l'annuncio (cascade eliminerà anche le candidature)
    await prisma.jobOffer.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting job offer:', error)
    return NextResponse.json(
      { error: 'Failed to delete job offer' },
      { status: 500 }
    )
  }
} 