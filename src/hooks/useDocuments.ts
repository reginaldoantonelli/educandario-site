/**
 * Hook useDocuments
 * 
 * Encapsula toda a lógica de documentos
 * Limpa a UI dos componentes
 * 
 * Uso:
 * const { documents, loading, error, deleteDocument, createDocument } = useDocuments();
 */

import { useState, useCallback, useEffect } from 'react';
import { documentService } from '@/services/documentService';
import { auditService } from '@/services/auditService';

interface Document {
  id: number | string;
  title: string;
  category_id?: string;
  category?: string;
  year: string;
  visibilidade: 'public' | 'private' | 'restricted';
  file_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UseDocumentsReturn {
  documents: Document[];
  loading: boolean;
  error: string | null;
  fetchDocuments: () => Promise<void>;
  createDocument: (doc: Omit<Document, 'id' | 'created_at'>) => Promise<Document | null>;
  updateDocument: (id: number | string, updates: Partial<Document>, title: string) => Promise<boolean>;
  deleteDocument: (id: number | string, title: string) => Promise<boolean>;
  clearError: () => void;
}

export function useDocuments(): UseDocumentsReturn {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carregar documentos do serviço
   */
  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const docs = await documentService.getDocuments();
      setDocuments(docs);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar documentos';
      setError(message);
      console.error('Erro em fetchDocuments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Criar novo documento
   */
  const createDocument = useCallback(
    async (doc: Omit<Document, 'id' | 'created_at'>) => {
      try {
        setLoading(true);
        setError(null);

        const newDoc = await documentService.createDocument(doc);
        await auditService.addLog(`📤 Arquivo enviado: ${newDoc.title}`);

        setDocuments(prev => [newDoc, ...prev]);
        return newDoc;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao criar documento';
        setError(message);
        console.error('Erro em createDocument:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Atualizar documento
   */
  const updateDocument = useCallback(
    async (id: number | string, updates: Partial<Document>, title: string) => {
      try {
        setLoading(true);
        setError(null);

        await documentService.updateDocument(id, updates);
        await auditService.addLog(`✏️ Arquivo editado: ${title}`);

        setDocuments(prev =>
          prev.map(d => (d.id === id ? { ...d, ...updates } : d))
        );
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao editar documento';
        setError(message);
        console.error('Erro em updateDocument:', err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Deletar documento
   */
  const deleteDocument = useCallback(
    async (id: number | string, title: string) => {
      try {
        setLoading(true);
        setError(null);

        await documentService.deleteDocument(id);
        await auditService.addLog(`🗑️ Arquivo removido: ${title}`);

        setDocuments(prev => prev.filter(d => d.id !== id));
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao deletar documento';
        setError(message);
        console.error('Erro em deleteDocument:', err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Limpar mensagem de erro
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Carregar documentos ao montar o componente
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    clearError
  };
}
