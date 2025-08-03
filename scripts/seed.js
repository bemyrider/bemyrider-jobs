const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Crea alcuni annunci di esempio
  const jobOffers = await Promise.all([
    prisma.jobOffer.create({
      data: {
        businessName: 'Pizzeria Roma',
        city: 'Roma',
        zone: 'Centro',
        schedule: '18:00-23:00',
        days: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
        vehicleType: ['bici', 'scooter'],
        hourlyRate: '12',
        details: 'Cerchiamo rider per consegna pizze nel centro di Roma. Esperienza preferibile ma non necessaria.',
        contactEmail: 'lavora@pizzeriaroma.it',
        contactPhone: '3331234567',
      }
    }),
    prisma.jobOffer.create({
      data: {
        businessName: 'Sushi Express',
        city: 'Milano',
        zone: 'Navigli',
        schedule: '19:00-23:30',
        days: ['Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'],
        vehicleType: ['scooter', 'auto'],
        hourlyRate: '15',
        details: 'Consegna sushi in zona Navigli. Richiesto mezzo proprio e patente.',
        contactEmail: 'hr@sushiexpress.it',
        contactPhone: '3498765432',
      }
    }),
    prisma.jobOffer.create({
      data: {
        businessName: 'Burger King',
        city: 'Torino',
        zone: 'Centro',
        schedule: '12:00-15:00 e 19:00-22:00',
        days: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'],
        vehicleType: ['bici', 'piedi'],
        hourlyRate: '10',
        details: 'Consegna hamburger in centro città. Turni flessibili, possibilità di lavorare solo pranzo o solo cena.',
        contactEmail: 'torino@burgerking.it',
        contactPhone: '0111234567',
      }
    }),
    prisma.jobOffer.create({
      data: {
        businessName: 'Gelateria Dolce Vita',
        city: 'Firenze',
        zone: 'Centro Storico',
        schedule: '14:00-20:00',
        days: ['Sab', 'Dom'],
        vehicleType: ['bici'],
        hourlyRate: '11',
        details: 'Consegna gelati nel centro storico di Firenze. Lavoro weekend ideale per studenti.',
        contactEmail: 'info@gelateriadolcevita.it',
        contactPhone: '0559876543',
      }
    }),
  ])

  console.log(`✅ Created ${jobOffers.length} job offers`)
  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
