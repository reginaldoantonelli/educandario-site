import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// 🔍 Debug - Verificar variáveis
import './debug';

// Configuração Firebase (vem do .env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validar configuração
if (!firebaseConfig.projectId) {
  console.error('❌ ERRO: VITE_FIREBASE_PROJECT_ID não está definido no .env');
  console.error('🔧 Verifique se o arquivo .env foi criado corretamente');
} else {
  console.log('✅ Firebase initializing...');
  console.log('📝 Project:', firebaseConfig.projectId);
}

// Inicializar Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized successfully!');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
}

// Serviços Firebase
export const auth = getAuth(app!);
export const firestore = getFirestore(app!);
export const storage = getStorage(app!);

// 🔍 [DEBUG] Configurar persistência com logs
import { setPersistence, browserLocalPersistence } from 'firebase/auth';

console.log('🔍 [DEBUG] Inicializando Firebase Auth...');

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('✅ [DEBUG] Persistência LOCAL (IndexedDB/localStorage) configurada com sucesso!');
    console.log('💾 [DEBUG] Firebase agora salvará sessões no navegador');
  })
  .catch((err) => {
    console.error('❌ [DEBUG] FALHA na persistência:', err);
    console.error('💥 [DEBUG] IndexedDB pode estar bloqueado ou corrompido');
    console.error('🔧 [DEBUG] Erro completo:', JSON.stringify(err, null, 2));
  });
