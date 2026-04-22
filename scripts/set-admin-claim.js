/**
 * Script para definir custom claims (admin: true) no Firebase
 * 
 * Uso: node scripts/set-admin-claim.js admin@email.com
 * 
 * ⚠️  IMPORTANTE: Você precisa de uma chave de serviço do Firebase
 * 1. Vá para Firebase Console → Project Settings → Service Accounts
 * 2. Clique em "Generate New Private Key"
 * 3. Salve o arquivo JSON na pasta do projeto como "firebase-key.json"
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Email do usuário (passe via argumentos ou defina aqui)
const userEmail = process.argv[2] || 'admin@educandarionsa.com.br';

// Caminho para a chave de serviço
const keyPath = path.join(__dirname, '../firebase-key.json');

// Verificar se a chave existe
if (!fs.existsSync(keyPath)) {
  console.error('❌ ERRO: Arquivo firebase-key.json não encontrado!');
  console.error('📝 Passos para obter a chave:');
  console.error('   1. Vá a https://console.firebase.google.com');
  console.error('   2. Selecione seu projeto');
  console.error('   3. Project Settings → Service Accounts');
  console.error('   4. "Generate New Private Key"');
  console.error('   5. Salve como: scripts/../firebase-key.json');
  process.exit(1);
}

// Inicializar Firebase Admin SDK
const serviceAccount = require(keyPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

const auth = admin.auth();

// Função para definir custom claim
async function setAdminClaim(email) {
  try {
    console.log(`🔍 Buscando usuário: ${email}`);
    
    // Obter usuário pelo email
    const user = await auth.getUserByEmail(email);
    console.log(`✅ Usuário encontrado: ${user.uid}`);
    
    // Definir custom claim
    console.log('⚙️  Definindo custom claim admin: true...');
    await auth.setCustomUserClaims(user.uid, { admin: true });
    
    console.log(`✅ Custom claim definido com sucesso!`);
    console.log(`📝 Dados do usuário:`);
    console.log(`   UID: ${user.uid}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Admin: true`);
    console.log(`\n⏱️  A mudança será refletida no próximo login do usuário`);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

// Executar
setAdminClaim(userEmail).then(() => {
  process.exit(0);
});
