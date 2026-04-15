import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// Inicializar Firebase Admin
// Você precisa baixar o serviceAccountKey.json do Firebase Console
// https://console.firebase.google.com/project/educandario-site/settings/serviceaccounts/adminsdk

const serviceAccountPath = process.env.FIREBASE_KEY_PATH || './serviceAccountKey.json';

if (!fs.existsSync(serviceAccountPath)) {
  console.error(
    `❌ Arquivo de credenciais não encontrado: ${serviceAccountPath}\n` +
    'Para obter este arquivo:\n' +
    '1. Acesse: https://console.firebase.google.com \n' +
    '2. Vá em Configurações do Projeto > Contas de Serviço\n' +
    '3. Clique em "Gerar nova chave privada"\n' +
    '4. Salve o arquivo como serviceAccountKey.json\n' +
    '5. Coloque-o na raiz do projeto\n'
  );
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Importar variáveis de ambiente do .env
const dotenv = await import('dotenv');
dotenv.config();

const projectId = process.env.VITE_FIREBASE_PROJECT_ID || 'educandario-site';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // O bucket do Firebase Admin SDK deve usar .appspot.com, não .firebasestorage.app
  storageBucket: `${projectId}.appspot.com`,
  projectId: projectId,
});

const storage = admin.storage().bucket();
const db = admin.firestore();

async function cleanupOrphanedFiles() {
  console.log('🧹 Iniciando limpeza de arquivos órfãos...\n');

  try {
    // 1. Listar todos os arquivos no Storage
    console.log('📂 Listando arquivos no Storage...');
    const [files] = await storage.getFiles();
    console.log(`✓ Total de ${files.length} arquivo(s) encontrado(s)\n`);

    // 2. Verificar cada arquivo
    let orphanedCount = 0;
    let validCount = 0;

    for (const file of files) {
      const filePath = file.name;
      
      // Extrair o ID do documento do caminho do arquivo
      // Padrão esperado: documents/{id}-{filename}
      const pathParts = filePath.split('/');
      
      if (pathParts.length !== 2 || pathParts[0] !== 'documents') {
        console.log(`⚠️  Arquivo com estrutura inesperada: ${filePath}`);
        continue;
      }

      const fileNameWithId = pathParts[1];
      const documentId = fileNameWithId.split('-')[0];

      // Verificar se o documento existe no Firestore
      try {
        const doc = await db.collection('documents').doc(documentId).get();

        if (!doc.exists) {
          // Arquivo órfão encontrado!
          orphanedCount++;
          console.log(`🗑️  [${orphanedCount}] Deletando arquivo órfão: ${filePath}`);
          
          // Deletar o arquivo
          await file.delete();
          console.log(`    ✓ Deletado com sucesso\n`);
        } else {
          validCount++;
          console.log(`✓ [${validCount}] Arquivo válido: ${filePath}`);
        }
      } catch (error) {
        console.error(`❌ Erro ao verificar documento ${documentId}:`, error.message);
      }
    }

    // 3. Resumo
    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMO DA LIMPEZA');
    console.log('='.repeat(50));
    console.log(`📁 Total de arquivos: ${files.length}`);
    console.log(`✓ Arquivos válidos: ${validCount}`);
    console.log(`🗑️  Arquivos órfãos deletados: ${orphanedCount}`);
    console.log('='.repeat(50) + '\n');

    if (orphanedCount === 0) {
      console.log('✨ Nenhum arquivo órfão encontrado! Storage está limpo.\n');
    } else {
      console.log(`🎉 ${orphanedCount} arquivo(s) órfão(s) deletado(s) com sucesso!\n`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante limpeza:', error);
    process.exit(1);
  }
}

// Executar
cleanupOrphanedFiles();
