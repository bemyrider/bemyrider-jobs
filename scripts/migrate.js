const { execSync } = require('child_process');

console.log('🔄 Starting database migration...');

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Deploy migrations with increased timeout
  console.log('🚀 Deploying migrations...');
  execSync('npx prisma migrate deploy --schema=./prisma/schema.prisma', { 
    stdio: 'inherit',
    env: { ...process.env, PRISMA_MIGRATE_LOCK_TIMEOUT: '30000' }
  });
  
  console.log('✅ Database migration completed successfully!');
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}
