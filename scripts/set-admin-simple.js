/**
 * Script Simples para Definir Admin Claim via Firebase Admin SDK
 * 
 * PASSO 1: Obter a chave de serviço
 * ================================
 * 1. Abra: https://console.firebase.google.com
 * 2. Selecione o projeto "educandario-site"
 * 3. Clique em ⚙️ (Configurações) → Project Settings
 * 4. Vá para a aba "Service Accounts"
 * 5. Clique em "Generate New Private Key"
 * 6. Um arquivo JSON será baixado
 * 7. Renomeie para "firebase-key.json" e coloque na raiz do projeto
 * 
 * PASSO 2: Instalar dependência
 * ============================
 * npm install firebase-admin
 * 
 * PASSO 3: Executar o script
 * ========================
 * node scripts/set-admin-simple.js
 */

const admin = require('firebase-admin');

// Carregar a chave de serviço
// Se estiver recebendo erro, siga os passos acima
const serviceAccount = require('../firebase-key.json');

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'educandario-site'
});

const auth = admin.auth();

// Lista de emails para tornar admin
const ADMIN_EMAILS = [
  'admin@educandarionsa.com.br',
  // Adicione mais emails aqui se necessário
];

async function setAdminClaims() {
  console.log('🔑 Iniciando definição de custom claims...\n');
  
  for (const email of ADMIN_EMAILS) {
    try {
      console.log(`📧 Processando: ${email}`);
      
      // Obter usuário
      const user = await auth.getUserByEmail(email);
      console.log(`   ✓ UID: ${user.uid}`);
      
      // Definir claim
      await auth.setCustomUserClaims(user.uid, { admin: true });
      console.log(`   ✓ Admin claim definido`);
      console.log(`   ✅ Sucesso!\n`);
      
    } catch (error) {
      console.error(`   ❌ Erro: ${error.message}\n`);
    }
  }
  
  console.log('✅ Processo concluído!');
  console.log('⏱️  O usuário precisará fazer login novamente para refletir as mudanças');
  process.exit(0);
}

// Executar
setAdminClaims().catch(err => {
  console.error('❌ Erro geral:', err);
  process.exit(1);
});
