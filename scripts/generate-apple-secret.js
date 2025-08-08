const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Configurazione - Modifica questi valori
const config = {
  privateKeyPath: './AuthKey_S34HG5C88G.p8', // Percorso al file .p8 scaricato da Apple
  teamId: '79K6W58FPR', // Il tuo Team ID dal portale Apple Developer
  clientId: 'it.bemyrider.app.bemyrider-jobs.web', // Il tuo Service ID
  keyId: 'S34HG5C88G' // L'ID della chiave creata
};

function generateAppleSecret() {
  try {
    // Verifica che il file della chiave privata esista
    if (!fs.existsSync(config.privateKeyPath)) {
      console.error('❌ File della chiave privata non trovato!');
      console.log('📁 Assicurati che il file .p8 sia nella directory corrente');
      console.log('🔧 Modifica il percorso in config.privateKeyPath');
      return;
    }

    // Leggi la chiave privata
    const privateKey = fs.readFileSync(config.privateKeyPath, 'utf8');

    // Genera il token JWT
    const token = jwt.sign({}, privateKey, {
      algorithm: 'ES256',
      expiresIn: '180d',
      audience: 'https://appleid.apple.com',
      issuer: config.teamId,
      subject: config.clientId,
      keyid: config.keyId
    });

    console.log('✅ Client Secret generato con successo!');
    console.log('\n📋 Copia questo valore nel tuo .env.local:');
    console.log('='.repeat(50));
    console.log(`APPLE_SECRET=${token}`);
    console.log('='.repeat(50));
    
    // Salva anche in un file per riferimento
    const outputPath = './apple-secret.txt';
    fs.writeFileSync(outputPath, `APPLE_SECRET=${token}`);
    console.log(`\n💾 Il secret è stato salvato anche in: ${outputPath}`);
    
    console.log('\n⚠️  IMPORTANTE:');
    console.log('- Questo token scade dopo 180 giorni');
    console.log('- Mantieni il file .p8 al sicuro');
    console.log('- Non committare mai il file .p8 o il secret nel repository');

  } catch (error) {
    console.error('❌ Errore durante la generazione del secret:', error.message);
    
    if (error.message.includes('ES256')) {
      console.log('\n💡 Suggerimento: Assicurati di aver installato la dipendenza jsonwebtoken:');
      console.log('npm install jsonwebtoken');
    }
  }
}

// Verifica che tutti i parametri siano configurati
const requiredFields = ['teamId', 'clientId', 'keyId'];
const missingFields = requiredFields.filter(field => 
  config[field] === 'YOUR_TEAM_ID' || 
  config[field] === 'YOUR_KEY_ID' ||
  config[field] === 'com.yourcompany.bemyrider-jobs.web'
);

if (missingFields.length > 0) {
  console.error('❌ Configurazione incompleta!');
  console.log('🔧 Modifica questi valori nello script:');
  missingFields.forEach(field => {
    console.log(`- ${field}: ${config[field]}`);
  });
  console.log('\n📖 Vedi APPLE_AUTH_SETUP.md per le istruzioni complete');
} else {
  generateAppleSecret();
} 