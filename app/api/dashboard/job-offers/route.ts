import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import { prisma } from '../../../../lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const offers = await prisma.jobOffer.findMany({
      where: { createdByEmail: session.user.email },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { applications: true } },
        applications: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    return NextResponse.json(offers)
  } catch (error) {
    console.error('Error fetching dashboard offers:', error)
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 })
  }
}
