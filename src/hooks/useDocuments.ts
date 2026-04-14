/**
 * useDocuments Hook (Firebase Implementation)
 * 
 * React hook for managing document operations (upload, download, list, delete)
 * Wraps firebaseDocumentService with React state management
 * 
 * Usage:
 * const { documents, loading, uploading, error, upload, list, delete: deleteDoc } = useDocuments();
 */

import { useState, useCallback } from 'react';
import type {
  DocumentMetadata,
  DocumentFilter,
  UploadProgress,
  UploadDocumentInput,
} from '@/services/api/documents';
import { DocumentServiceError } from '@/services/api/documents';
import { firebaseDocumentService } from '@/services/firebase/documents';

interface UseDocumentsReturn {
  // State
  documents: DocumentMetadata[];
  loading: boolean;
  uploading: boolean;
  error: DocumentServiceError | null;
  uploadProgress: UploadProgress | null;
  total: number;
  
  // Operations
  upload: (file: File, metadata: UploadDocumentInput) => Promise<DocumentMetadata>;
  list: (filter?: DocumentFilter) => Promise<void>;
  getMetadata: (documentId: string) => Promise<DocumentMetadata>;
  getURL: (documentId: string) => Promise<string>;
  delete: (documentId: string) => Promise<void>;
  update: (
    documentId: string,
    updates: Partial<Omit<DocumentMetadata, 'id' | 'uploadedBy' | 'uploadedAt'>>
  ) => Promise<DocumentMetadata>;
  search: (query: string) => Promise<DocumentMetadata[]>;
  clearError: () => void;
}

/**
 * Hook for document management
 * Provides state and methods for document operations
 */
export const useDocuments = (): UseDocumentsReturn => {
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<DocumentServiceError | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [total, setTotal] = useState(0);

  // Upload document
  const upload = useCallback(
    async (file: File, metadata: UploadDocumentInput) => {
      try {
        setUploading(true);
        setError(null);
        
        const result = await firebaseDocumentService.uploadDocument(
          file,
          metadata,
          (progress) => {
            setUploadProgress(progress);
          }
        );

        // Add to list
        setDocuments((prev) => [result, ...prev]);
        setUploadProgress(null);
        return result;
      } catch (err) {
        const error = err as DocumentServiceError;
        setError(error);
        throw error;
      } finally {
        setUploading(false);
      }
    },
    []
  );

  // List documents
  const list = useCallback(async (filter?: DocumentFilter) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await firebaseDocumentService.listDocuments(filter);
      setDocuments(result.documents);
      setTotal(result.total);
    } catch (err) {
      const error = err as DocumentServiceError;
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get document metadata
  const getMetadata = useCallback(async (documentId: string) => {
    try {
      setError(null);
      return await firebaseDocumentService.getDocumentMetadata(documentId);
    } catch (err) {
      const error = err as DocumentServiceError;
      setError(error);
      throw error;
    }
  }, []);

  // Get document URL
  const getURL = useCallback(async (documentId: string) => {
    try {
      setError(null);
      return await firebaseDocumentService.getDocumentURL(documentId);
    } catch (err) {
      const error = err as DocumentServiceError;
      setError(error);
      throw error;
    }
  }, []);

  // Delete document
  const deleteDoc = useCallback(async (documentId: string) => {
    try {
      setError(null);
      await firebaseDocumentService.deleteDocument(documentId);
      
      // Remove from list
      setDocuments((prev) => prev.filter((d) => d.id !== documentId));
    } catch (err) {
      const error = err as DocumentServiceError;
      setError(error);
      throw error;
    }
  }, []);

  // Update document
  const update = useCallback(
    async (
      documentId: string,
      updates: Partial<Omit<DocumentMetadata, 'id' | 'uploadedBy' | 'uploadedAt'>>
    ) => {
      try {
        setError(null);
        const result = await firebaseDocumentService.updateDocument(
          documentId,
          updates
        );
        
        // Update in list
        setDocuments((prev) =>
          prev.map((d) => (d.id === documentId ? result : d))
        );
        
        return result;
      } catch (err) {
        const error = err as DocumentServiceError;
        setError(error);
        throw error;
      }
    },
    []
  );

  // Search documents
  const search = useCallback(async (query: string) => {
    try {
      setError(null);
      return await firebaseDocumentService.searchDocuments(query);
    } catch (err) {
      const error = err as DocumentServiceError;
      setError(error);
      throw error;
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    documents,
    loading,
    uploading,
    error,
    uploadProgress,
    total,
    upload,
    list,
    getMetadata,
    getURL,
    delete: deleteDoc,
    update,
    search,
    clearError,
  };
};
