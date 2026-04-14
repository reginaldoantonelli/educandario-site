/**
 * Arquivo de DEBUG - Verificar variáveis Firebase
 * Delete este arquivo após validar que tudo funciona corretamente
 */

console.log('🔍 DEBUG - Variáveis Firebase:');
console.log('VITE_FIREBASE_API_KEY:', import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Definida' : '❌ FALTANDO');
console.log('VITE_FIREBASE_AUTH_DOMAIN:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '❌ FALTANDO');
console.log('VITE_FIREBASE_PROJECT_ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '❌ FALTANDO');
console.log('VITE_FIREBASE_STORAGE_BUCKET:', import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '❌ FALTANDO');
console.log('VITE_FIREBASE_MESSAGING_SENDER_ID:', import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '❌ FALTANDO');
console.log('VITE_FIREBASE_APP_ID:', import.meta.env.VITE_FIREBASE_APP_ID ?? '❌ FALTANDO');
console.log('VITE_FIREBASE_MEASUREMENT_ID:', import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? '⚠️ Opcional');
console.log('VITE_ENV:', import.meta.env.VITE_ENV ?? 'development');
