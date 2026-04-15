/**
 * Document Services - Usage Examples
 * 
 * This file contains practical examples of how to use the Document Services
 * in different scenarios (components, pages, admin panels)
 * 
 * Copy and adapt these patterns to your use case!
 */

// ============================================================================
// EXAMPLE 1: Upload Document in Modal
// ============================================================================

/* 
  Location: src/components/DocumentUploadModal/DocumentUploadModal.tsx
  
  Usage: User uploads new document with progress tracking
*/

export const DocumentUploadExample = () => {
  const { upload, uploading, uploadProgress, error, clearError } = useDocuments();
  
  const handleUpload = async (file: File) => {
    try {
      clearError();
      
      const document = await upload(file, {
        name: file.name,
        type: 'pdf',
        category: 'reports',
        public: true,
        tags: ['2026', 'finance'],
      });
      
      console.log('Upload successful:', document.id);
      // Show success toast
      // Close modal
    } catch (err) {
      console.error('Upload failed:', error?.message);
      // Show error toast
    }
  };

  return (
    <div>
      <input 
        type="file" 
        onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
        disabled={uploading}
      />
      
      {uploading && uploadProgress && (
        <div className="flex items-center gap-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all" 
              style={{ width: `${uploadProgress.currentProgress}%` }}
            />
          </div>
          <span>{uploadProgress.currentProgress}%</span>
        </div>
      )}
      
      {error && (
        <div className="text-red-500">
          {error.message}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// EXAMPLE 2: List and Filter Documents
// ============================================================================

/*
  Location: src/pages/Admin/DocumentsPage/index.tsx
  
  Usage: List all documents with filtering by category
*/

export const DocumentListExample = () => {
  const { documents, loading, list } = useDocuments();
  
  useEffect(() => {
    // Load all public documents
    list({ public: true, limit: 20 });
  }, []);
  
  const handleFilterByCategory = async (category: string) => {
    await list({
      category,
      public: true,
      limit: 20,
    });
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => handleFilterByCategory('reports')}>Relatórios</button>
        <button onClick={() => handleFilterByCategory('transparency')}>Transparência</button>
      </div>
      
      <div className="space-y-2">
        {documents.map((doc) => (
          <div key={doc.id} className="flex justify-between items-center border p-2 rounded">
            <div>
              <h3>{doc.name}</h3>
              <p className="text-sm text-gray-500">
                {(doc.size / 1024).toFixed(2)} KB • {doc.category}
              </p>
            </div>
            <button onClick={() => handleDownload(doc.id)}>Download</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// EXAMPLE 3: Download Document with Rate Limit Handling
// ============================================================================

/*
  Location: src/pages/Public/DocumentsPage/index.tsx
  
  Usage: Download public document with error handling
*/

export const DocumentDownloadExample = () => {
  const { getURL, error, clearError } = useDocuments();
  
  const handleDownload = async (documentId: string, documentName: string) => {
    try {
      clearError();
      
      // Get signed URL
      const url = await getURL(documentId);
      
      // Open in new tab or download
      window.open(url, '_blank');
      
    } catch (err) {
      if (error?.code === 'RATE_LIMIT_EXCEEDED') {
        console.log('Limite de downloads atingido. Tente novamente em 1 minuto.');
      } else {
        console.error('Download failed:', error?.message);
      }
    }
  };

  return (
    <button onClick={() => handleDownload('doc-123', 'report.pdf')}>
      Baixar PDF
    </button>
  );
};

// ============================================================================
// EXAMPLE 4: Search Documents
// ============================================================================

/*
  Location: src/components/DocumentSearch/index.tsx
  
  Usage: Search documents by name or tags
*/

export const DocumentSearchExample = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DocumentMetadata[]>([]);
  const { search, error } = useDocuments();

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }
    
    try {
      const docs = await search(searchQuery);
      setResults(docs);
    } catch (err) {
      console.error('Search failed:', error?.message);
    }
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          handleSearch(e.target.value);
        }}
        placeholder="Pesquisar documentos..."
      />
      
      <div className="mt-4">
        {results.map((doc) => (
          <div key={doc.id} className="border p-2 rounded mb-2">
            <h4>{doc.name}</h4>
            {doc.tags && <p className="text-sm">{doc.tags.join(', ')}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// EXAMPLE 5: Delete Document (Admin Only)
// ============================================================================

/*
  Location: src/components/AdminDocumentList/index.tsx
  
  Usage: Admin deletes document
*/

export const DocumentDeleteExample = () => {
  const { delete: deleteDoc, error } = useDocuments();
  
  const handleDelete = async (documentId: string) => {
    if (!window.confirm('Confirmar deleção?')) return;
    
    try {
      await deleteDoc(documentId);
      console.log('Document deleted successfully');
    } catch (err) {
      if (error?.code === 'PERMISSION_DENIED') {
        console.log('Sem permissão para deletar este documento');
      } else {
        console.error('Delete failed:', error?.message);
      }
    }
  };

  return (
    <button onClick={() => handleDelete('doc-123')} className="text-red-500">
      Deletar
    </button>
  );
};

// ============================================================================
// EXAMPLE 6: Update Document Visibility/Tags
// ============================================================================

/*
  Location: src/pages/Admin/EditDocumentPage/index.tsx
  
  Usage: Admin updates document metadata
*/

export const DocumentUpdateExample = () => {
  const { update, error } = useDocuments();
  
  const handleMakePublic = async (documentId: string) => {
    try {
      const updated = await update(documentId, {
        public: true,
      });
      console.log('Document is now public');
    } catch (err) {
      console.error('Update failed:', error?.message);
    }
  };
  
  const handleAddTags = async (documentId: string) => {
    try {
      const updated = await update(documentId, {
        tags: ['important', '2026'],
      });
      console.log('Tags added');
    } catch (err) {
      console.error('Update failed:', error?.message);
    }
  };

  return (
    <div>
      <button onClick={() => handleMakePublic('doc-123')}>
        Tornar Público
      </button>
      <button onClick={() => handleAddTags('doc-123')}>
        Adicionar Tags
      </button>
    </div>
  );
};

// ============================================================================
// EXAMPLE 7: Protected Download Link Component
// ============================================================================

/*
  Location: src/components/DocumentDownloadButton/index.tsx
  
  Usage: Reusable button that handles download with proper error states
*/

export const DocumentDownloadButtonComponent = ({ 
  documentId, 
  documentName 
}: { 
  documentId: string;
  documentName: string;
}) => {
  const { getURL, error, clearError } = useDocuments();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      clearError();
      
      const url = await getURL(documentId);
      const link = document.createElement('a');
      link.href = url;
      link.download = documentName;
      link.click();
      
    } catch (err) {
      // Error is already in useState via useDocuments hook
      console.error('Download error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button 
        onClick={handleClick} 
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Baixando...' : 'Baixar'}
      </button>
      
      {error && (
        <p className="text-red-500 text-sm mt-2">
          {error.code === 'RATE_LIMIT_EXCEEDED'
            ? 'Muitos downloads. Tente novamente em 1 minuto.'
            : error.message}
        </p>
      )}
    </div>
  );
};

// ============================================================================
// EXAMPLE 8: Bulk Upload with Queue
// ============================================================================

/*
  Location: src/components/BulkDocumentUpload/index.tsx
  
  Usage: Upload multiple files sequentially
*/

export const BulkDocumentUploadExample = () => {
  const { upload, uploadProgress, error } = useDocuments();
  const [queue, setQueue] = useState<File[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (queue.length > 0 && currentIndex < queue.length) {
      uploadFile(queue[currentIndex]);
    }
  }, [currentIndex, queue]);

  const uploadFile = async (file: File) => {
    try {
      await upload(file, {
        name: file.name,
        type: 'pdf',
        category: 'bulk-import',
        public: false,
      });
      
      setCurrentIndex(prev => prev + 1);
    } catch (err) {
      console.error('Upload failed:', error?.message);
      // Remove failed file and continue
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleFilesSelected = (files: File[]) => {
    setQueue(Array.from(files));
    setCurrentIndex(0);
  };

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={(e) => handleFilesSelected(Array.from(e.target.files || []))}
        disabled={queue.length > 0}
      />
      
      {queue.length > 0 && (
        <div>
          <p>Upload {currentIndex} de {queue.length}</p>
          {uploadProgress && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${uploadProgress.currentProgress}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// ERROR CODES REFERENCE
// ============================================================================

/*
Document Service Error Codes:

UPLOAD_FAILED
  └─ File could not be uploaded to storage

FILE_TOO_LARGE
  └─ File exceeds 50 MB limit
  └─ context: { size, maxSize }

UNSUPPORTED_FILE_TYPE
  └─ File type not supported (only PDF, documents)
  └─ context: { type }

RATE_LIMIT_EXCEEDED
  └─ User exceeded download limit (10 per minute)
  └─ context: { limit: 10, window: '1 minuto' }

PERMISSION_DENIED
  └─ User doesn't have permission (not owner/admin)

DOCUMENT_NOT_FOUND
  └─ Document ID doesn't exist
  └─ context: { documentId }

AUTH_REQUIRED
  └─ User must be logged in

INVALID_FILE
  └─ File object is invalid or missing

Invalid Error Codes - Avoid These:
  └─ Can occur for unknown errors or service failures
*/

// ============================================================================
// COMMON PATTERNS
// ============================================================================

/*
1. PROGRESS TRACKING FOR UPLOADS
   ├─ Use uploadProgress to show visual feedback
   ├─ Structure: { currentProgress: 0-100, totalBytes, uploadedBytes }
   └─ Example: <ProgressBar value={uploadProgress.currentProgress} />

2. ERROR RECOVERY
   ├─ Always call clearError() before new operation
   ├─ Check error.code for specific error type
   └─ Retry logic: await operation() wrapped in try-catch

3. PERMISSION CHECKS
   ├─ Component should check user.role immediately
   ├─ Service will also check and throw PERMISSION_DENIED
   └─ Don't wait for service - check in UI first

4. PAGINATION
   ├─ Use filter: { limit: 20, offset: 0 }
   ├─ Track total response to know limit
   ├─ hasMore tells you if more results exist
   └─ Increment offset for next page

5. SEARCH
   ├─ Minimum 2 characters to search
   ├─ Searches by name AND tags (client-side filter)
   ├─ Only searches public documents
   └─ Returns max 10 results
*/
