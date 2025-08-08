const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkOffers() {
  try {
    console.log('🔍 Controllo annunci nel database...\n')
    
    // Conta tutti gli annunci
    const totalOffers = await prisma.jobOffer.count()
    console.log(`📊 Totale annunci: ${totalOffers}`)
    
    // Conta annunci attivi
    const activeOffers = await prisma.jobOffer.count({
      where: { isActive: true }
    })
    console.log(`✅ Annunci attivi: ${activeOffers}`)
    
    // Conta annunci inattivi
    const inactiveOffers = await prisma.jobOffer.count({
      where: { isActive: false }
    })
    console.log(`❌ Annunci inattivi: ${inactiveOffers}`)
    
    // Mostra i dettagli degli annunci attivi
    if (activeOffers > 0) {
      console.log('\n📋 Dettagli annunci attivi:')
      const offers = await prisma.jobOffer.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          businessName: true,
          city: true,
          zone: true,
          schedule: true,
          days: true,
          vehicleType: true,
          isActive: true,
          createdAt: true,
          createdByEmail: true
        }
      })
      
      offers.forEach((offer, index) => {
        console.log(`\n${index + 1}. ${offer.businessName}`)
        console.log(`   📍 ${offer.city}${offer.zone ? ` - ${offer.zone}` : ''}`)
        console.log(`   ⏰ ${offer.schedule}`)
        console.log(`   📅 ${offer.days.join(', ')}`)
        console.log(`   🚗 ${offer.vehicleType.join(', ')}`)
        console.log(`   👤 ${offer.createdByEmail}`)
        console.log(`   📅 Creato: ${offer.createdAt.toLocaleString('it-IT')}`)
        console.log(`   ✅ Attivo: ${offer.isActive}`)
      })
    }
    
    // Test API response
    console.log('\n🌐 Test API response...')
    const testOffers = await prisma.jobOffer.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
    
    console.log(`API dovrebbe restituire ${testOffers.length} annunci`)
    testOffers.forEach((offer, index) => {
      console.log(`${index + 1}. ${offer.businessName} - ${offer.city} - ${offer.vehicleType.join(', ')}`)
    })
    
  } catch (error) {
    console.error('❌ Errore durante il controllo:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkOffers() 