import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../lib/auth'
import { prisma } from '../../../../lib/prisma'

export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const offers = await prisma.jobOffer.findMany({
    where: {
      createdByEmail: session.user.email,
    },
    include: {
      applications: true,
    },
  })

  return NextResponse.json(offers)
}
