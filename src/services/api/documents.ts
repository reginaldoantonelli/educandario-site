/**
 * Document Service - Agnostic Interface Layer
 * 
 * This interface defines the contract for document operations (upload, download, delete)
 * Independent from Firebase/Supabase implementation details.
 * 
 * Allows future migration to different backends without changing component code.
 */

export interface DocumentMetadata {
  id: string;
  name: string;
  type: 'pdf' | 'document' | 'image' | 'other';
  size: number; // bytes
  uploadedBy: string; // userId
  uploadedAt: Date;
  updatedAt?: Date;
  category?: string;
  public: boolean; // true = accessible to users, false = admin only
  tags?: string[];
  url?: string; // Signed or public URL
  fileUrl?: string; // Supabase URL
  storagePath?: string; // Supabase storage path
  description?: string;
}

/**
 * Input data for uploading a document
 * Size is automatically calculated from the file
 * Id, uploadedAt, and uploadedBy are auto-generated
 */
export interface UploadDocumentInput {
  name: string;
  type?: 'pdf' | 'document' | 'image' | 'other';
  category?: string;
  public?: boolean;
  tags?: string[];
  description?: string;
}

export interface UploadProgress {
  currentProgress: number; // 0-100
  totalBytes: number;
  uploadedBytes: number;
}

export interface DocumentFilter {
  category?: string;
  type?: DocumentMetadata['type'];
  public?: boolean;
  search?: string; // Search by name or tags
  limit?: number;
  offset?: number;
}

export interface DocumentService {
  /**
   * Upload a document file to storage
   * Returns DocumentMetadata with generated ID
   */
  uploadDocument(
    file: File,
    metadata: UploadDocumentInput,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<DocumentMetadata>;

  /**
   * Get list of documents with optional filtering
   * Returns paginated results
   */
  listDocuments(filter?: DocumentFilter): Promise<{
    documents: DocumentMetadata[];
    total: number;
    hasMore: boolean;
  }>;

  /**
   * Get specific document metadata
   */
  getDocumentMetadata(documentId: string): Promise<DocumentMetadata>;

  /**
   * Get download URL (signed URL with expiration for security)
   * Signed URLs prevent direct access to storage paths
   */
  getDocumentURL(
    documentId: string,
    expirationMinutes?: number // default: 1440 (24 hours)
  ): Promise<string>;

  /**
   * Delete a document
   * Only admin or owner can delete
   */
  deleteDocument(documentId: string): Promise<void>;

  /**
   * Update document metadata (public flag, category, tags)
   * Only admin or owner can update
   */
  updateDocument(
    documentId: string,
    updates: Partial<Omit<DocumentMetadata, 'id' | 'uploadedBy' | 'uploadedAt'>>
  ): Promise<DocumentMetadata>;

  /**
   * Search documents by name or tags
   */
  searchDocuments(query: string, limit?: number): Promise<DocumentMetadata[]>;

  /**
   * Get audit log for a document (download, delete, update history)
   */
  getDocumentAuditLog(documentId: string): Promise<AuditLogEntry[]>;
}

export interface AuditLogEntry {
  id: string;
  documentId: string;
  action: 'upload' | 'download' | 'delete' | 'update' | 'view';
  userId: string;
  userEmail?: string;
  timestamp: Date;
  details?: Record<string, unknown>;
  ipAddress?: string;
}

export interface DocumentError extends Error {
  code: string;
  context?: Record<string, unknown>;
}

/**
 * Custom Error Class for Document Operations
 * Provides structured error handling with context
 */
export class DocumentServiceError extends Error implements DocumentError {
  code: string;
  context?: Record<string, unknown>;

  constructor(
    message: string,
    code: string,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'DocumentServiceError';
    this.code = code;
    this.context = context;
  }
}
