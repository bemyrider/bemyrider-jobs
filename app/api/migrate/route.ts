import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';

export async function POST(request: NextRequest) {
  try {
    // Verifica che sia una richiesta autorizzata (puoi aggiungere autenticazione)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.MIGRATION_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔄 Starting database migration via API...');

    // Genera il client Prisma
    execSync('npx prisma generate', { stdio: 'inherit' });

    // Applica le migrazioni con timeout aumentato
    execSync('npx prisma migrate deploy', { 
      stdio: 'inherit',
      env: { ...process.env, PRISMA_MIGRATE_LOCK_TIMEOUT: '30000' }
    });

    console.log('✅ Database migration completed successfully!');

    return NextResponse.json({ 
      success: true, 
      message: 'Database migration completed successfully' 
    });

  } catch (error) {
    console.error('❌ Migration failed:', error);
    return NextResponse.json({ 
      error: 'Migration failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
