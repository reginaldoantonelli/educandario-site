/**
 * Hook para testar conexão Firebase
 * Remover depois que validar que está funcionando
 */

import { useEffect, useState } from 'react';

export const useFirebaseStatus = () => {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkFirebase = async () => {
      try {
        // Tentar importar Firebase
        const { app } = await import('@/services/firebase');
        
        if (app) {
          setStatus('connected');
          setMessage(`✅ Firebase conectado: ${app.automaticDataCollectionEnabled}`);
        }
      } catch (error) {
        setStatus('error');
        setMessage(`❌ Erro ao conectar Firebase: ${error}`);
      }
    };

    checkFirebase();
  }, []);

  return { status, message };
};
