/**
 * Hook useAuditLogs
 * 
 * Gerencia logs de auditoria
 * Usado pela página Settings para exibir histórico
 * 
 * Uso:
 * const { logs, loading, clearLogs } = useAuditLogs();
 */

import { useState, useCallback, useEffect } from 'react';
import { auditService } from '@/services/auditService';

interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  timestamp: string;
  created_at?: string;
}

export interface UseAuditLogsReturn {
  logs: AuditLog[];
  loading: boolean;
  error: string | null;
  fetchLogs: () => Promise<void>;
  clearLogs: () => Promise<void>;
  clearError: () => void;
}

export function useAuditLogs(): UseAuditLogsReturn {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carregar logs de auditoria
   */
  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const auditLogs = await auditService.getLogs();
      setLogs(auditLogs);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar logs';
      setError(message);
      console.error('Erro em fetchLogs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Limpar todos os logs
   */
  const clearAllLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await auditService.clearLogs();
      setLogs([]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao limpar logs';
      setError(message);
      console.error('Erro em clearLogs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Limpar mensagem de erro
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Carregar logs ao montar o componente
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    loading,
    error,
    fetchLogs,
    clearLogs: clearAllLogs,
    clearError
  };
}
