/**
 * Serviço de Documentos
 * 
 * Abstração de dados - Fácil migração localStorage → Supabase
 * 
 * ATUALMENTE: localStorage
 * FUTURO: Supabase
 */

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

const DOCUMENTS_KEY = 'documents';

export class DocumentService {
  /**
   * Carregar todos os documentos
   * 
   * localStorage: JSON.parse
   * Supabase: supabase.from('documents').select()
   */
  async getDocuments(): Promise<Document[]> {
    try {
      const saved = localStorage.getItem(DOCUMENTS_KEY);
      if (!saved) return [];
      return JSON.parse(saved);
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
      return [];
    }
  }

  /**
   * Buscar documento por ID
   */
  async getDocumentById(id: number | string): Promise<Document | null> {
    try {
      const docs = await this.getDocuments();
      return docs.find(d => d.id === id) || null;
    } catch (error) {
      console.error('Erro ao buscar documento:', error);
      return null;
    }
  }

  /**
   * Criar novo documento
   * 
   * IMPORTANTE: Antes de Supabase, certifique-se de:
   * - Validar arquivo (tamanho, tipo)
   * - Upload para Supabase Storage
   * - Obter file_url
   */
  async createDocument(doc: Omit<Document, 'id' | 'created_at'>): Promise<Document> {
    try {
      const docs = await this.getDocuments();
      
      const newDoc: Document = {
        ...doc,
        id: Date.now(),
        created_at: new Date().toISOString()
      };

      const updated = [newDoc, ...docs];
      localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(updated));
      
      return newDoc;
    } catch (error) {
      throw this.handleError(error, 'criar');
    }
  }

  /**
   * Atualizar documento
   */
  async updateDocument(
    id: number | string,
    updates: Partial<Document>
  ): Promise<Document> {
    try {
      const docs = await this.getDocuments();
      const doc = docs.find(d => d.id === id);
      
      if (!doc) throw new Error('Documento não encontrado');

      const updated = {
        ...doc,
        ...updates,
        updated_at: new Date().toISOString()
      };

      const allDocs = docs.map(d => d.id === id ? updated : d);
      localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(allDocs));
      
      return updated;
    } catch (error) {
      throw this.handleError(error, 'atualizar');
    }
  }

  /**
   * Deletar documento
   * 
   * localStorage: filter + setItem
   * Supabase: supabase.from('documents').delete().eq('id', id)
   */
  async deleteDocument(id: number | string): Promise<void> {
    try {
      const docs = await this.getDocuments();
      const filtered = docs.filter(d => d.id !== id);
      
      if (filtered.length === docs.length) {
        throw new Error('Documento não encontrado');
      }

      localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(filtered));
    } catch (error) {
      throw this.handleError(error, 'deletar');
    }
  }

  /**
   * Limpar cache local (útil para soft refresh)
   */
  async clearCache(): Promise<void> {
    try {
      localStorage.removeItem(DOCUMENTS_KEY);
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
    }
  }

  /**
   * Tratamento de erros centralizado
   */
  private handleError(error: unknown, action: string) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error(`Erro ao ${action} documento:`, error);
    
    return {
      code: 'DOCUMENT_ERROR',
      message: `Erro ao ${action} documento: ${message}`,
      status: 500
    };
  }
}

/**
 * Instância singleton do serviço
 * Importar como: import { documentService } from '@/services/documentService'
 */
export const documentService = new DocumentService();
