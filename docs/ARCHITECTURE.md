# 📚 Guia de Arquitetura - Educandário Frontend

**Versão:** 1.0  
**Data:** 10 de abril de 2026  
**Objetivo:** Documentar a arquitetura preparada para migração Supabase

---

## 🎯 Estrutura de Pastas

```
educandario-site/
├── src/
│   ├── types/
│   │   └── index.ts              ← Tipos centralizados
│   ├── services/
│   │   ├── supabaseClient.ts      ← Cliente Supabase (vazio)
│   │   ├── documentService.ts     ← Lógica de documentos
│   │   └── auditService.ts        ← Lógica de auditoria
│   ├── hooks/
│   │   ├── useDocuments.ts        ← Hook de documentos
│   │   └── useAuditLogs.ts        ← Hook de logs
│   ├── components/
│   ├── pages/
│   └── ...
├── SUPABASE_DATABASE_SCHEMA.md
├── MIGRATION_PLAN.md              ← Este arquivo
└── ...
```

---

## 🔄 Fluxo de Dados

```
┌──────────────────────┐
│   React Component    │
│   (Transparency)     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Custom Hook         │
│  useDocuments()      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Service            │
│  documentService     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Backend Service    │
│   Firebase/Supabase  │
└──────────────────────┘
```

### Exemplo Prático: Upload de Documento

```
1. User clica em "Upload" no Admin
   → Component: Transparency/index.tsx
   
2. Component chama hook
   → Hook: useDocuments()
   → Método: upload(file, metadata)
   
3. Hook chama service
   → Service: documentService.ts
   → Método: uploadDocument(file, metadata)
   
4. Service se conecta ao Firebase
   → Firebase: Firestore + Storage
   → Resultado: Documento salvo
   
5. Hook atualiza estado
   → State: documents[], loading, error
   
6. Component re-renderiza com novo documento
   → UI: Lista atualizada com novo PDF
```

---

## 📦 Camadas da Aplicação

### 1️⃣ Presentation Layer (UI Components)

Responsáveis pela exibição e interação do usuário.

**Arquivos:**
- `src/pages/Admin/Transparency/index.tsx` - Lista e gerencia documentos
- `src/components/ProjectCards/index.tsx` - Cartão de projeto
- `src/components/EditDocumentModal.tsx` - Modal de edição

**Responsabilidades:**
- ✅ Renderizar UI
- ✅ Capturar eventos do usuário (cliques, inputs)
- ✅ Chamar hooks
- ✅ Exibir feedback (loading, erros, sucesso)

---

### 2️⃣ State Management Layer (Custom Hooks)

Gerenciam o estado da aplicação e chamam os services.

**Arquivos:**
- `src/hooks/useDocuments.ts` - Gerencia documentos
- `src/hooks/useAuth.ts` - Gerencia autenticação
- `src/hooks/useAuditLogs.ts` - Gerencia logs

**Responsabilidades:**
- ✅ Manter estado (documents[], loading, error)
- ✅ Chamar services
- ✅ Processar respostas
- ✅ Expor métodos para componentes (upload, delete, update)

**Exemplo: useDocuments.ts**

```typescript
export const useDocuments = () => {
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File, metadata: ... ) => {
    try {
      setLoading(true);
      const result = await documentService.uploadDocument(file, metadata);
      setDocuments([...documents, result]);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { documents, loading, error, upload, ... };
};
```

---

### 3️⃣ Service Layer (Business Logic)

Contém a lógica de negócio, independente da UI.

**Arquivos:**
- `src/services/firebase/documents.ts` - Operações de documentos
- `src/services/firebase/auth.ts` - Autenticação
- `src/services/auditService.ts` - Auditoria

**Responsabilidades:**
- ✅ Chamar APIs (Firebase, Supabase)
- ✅ Transformar dados
- ✅ Validar entrada
- ✅ Fazer retry em caso de falha
- ✅ Logar operações (audit)

**Exemplo: documents.ts**

```typescript
export async function uploadDocument(
  file: File,
  metadata: DocumentMetadata
): Promise<DocumentMetadata> {
  // 1. Validar
  if (!file || !metadata.name) throw new Error('Invalid data');

  // 2. Upload para Storage
  const fileRef = ref(storage, `documents/${uuid()}-${file.name}`);
  await uploadBytes(fileRef, file);
  const fileUrl = await getDownloadURL(fileRef);

  // 3. Salvar metadata no Firestore
  const docRef = doc(collection(db, 'documents'));
  const docData = { ...metadata, fileUrl, uploadedAt: new Date() };
  await setDoc(docRef, docData);

  // 4. Log de auditoria
  await logAuditAction('upload', docRef.id, { fileName: file.name });

  return docData;
}
```

---

### 4️⃣ Data Layer (Backend Services)

Responsável pela persistência e comunicação com backend.

**Serviços:**
- Firebase Firestore (banco de dados)
- Firebase Storage (arquivos)
- Firebase Authentication (autenticação)

**Responsabilidades:**
- ✅ Armazenar dados
- ✅ Recuperar dados
- ✅ Validar acesso (regras de segurança)
- ✅ Fazer backups

---

## 🔀 Padrões de Design

### 1. Service + Hook Pattern

```
Service (pura, testável)
  ↓
Hook (state + service)
  ↓
Component (UI)
```

**Vantagem:** Separação clara de responsabilidades, fácil de testar.

---

### 2. Error Handling

Erros são tratados em múltiplas camadas:

```
Component → try/catch local
Hook → try/catch + setError
Service → try/catch + log
API → erro de rede
```

---

### 3. Loading States

Para cada operação, há 3 estados:

```
loading = false, error = null      → Estado inicial
loading = true                     → Operação em progresso
loading = false, error = "msg"     → Erro
loading = false, error = null      → Sucesso
```

---

## 🔐 Segurança

### Autenticação

1. **Firebase Auth** - Valida email/senha
2. **Custom Claims** - Define admin role
3. **Firestore Rules** - Valida acesso aos dados

### Autorização

```firestore
// Apenas admins podem deletar
match /documents/{docId} {
  allow delete: if request.auth.token.admin == true;
}
```

### CORS & Storage

- Storage bloqueia DELETE do navegador (CORS)
- Solução: Deletar apenas metadata no Firestore
- Cleanup de arquivos orphaned via script Node.js

---

## 📊 Fluxo de Dados Completo

### Upload de Documento

```
1. User seleciona arquivo PDF
   └─> Component: Transparency/index.tsx
       └─> State: selectedFile = File

2. User clica "Upload"
   └─> handleUpload(file)
       └─> Hook: documents.upload(file, metadata)
           └─> State: uploading = true

3. Hook inicia operação
   └─> Service: documentService.uploadDocument(file, metadata)
       
       a) Storage: uploadBytes(fileRef, file)
          └─> Resultado: fileUrl = "https://storage/.../file.pdf"
       
       b) Firestore: setDoc(docRef, docData)
          └─> Resultado: docId = "abc123"
       
       c) Audit: logAuditAction('upload', docId, ...)
          └─> Resultado: auditLogId = "log001"

4. Hook atualiza estado
   └─> State: 
       documents = [{ id: "abc123", name: "...", fileUrl, ... }]
       uploading = false
       error = null

5. Component re-renderiza
   └─> UI: Novo documento aparece na lista
```

### Editar Documento

```
1. User clica "Edit" no documento
   └─> Modal abre com dados atuais

2. User muda nome e clica "Save"
   └─> Hook: documents.update(docId, {name: "Novo"})

3. Service atualiza Firestore
   └─> Firestore: updateDoc(docRef, {name: "Novo"})
       └─> Audit: logAuditAction('update', docId, ...)

4. Hook atualiza estado
   └─> documents = [...] (com meu nome novo)

5. Component re-renderiza
   └─> UI: Documento com novo nome
```

### Deletar Documento

```
1. User clica "Delete"
   └─> Modal de confirmação aparece

2. User confirma
   └─> Hook: documents.delete(docId)

3. Service deleta Firestore (metadata apenas)
   └─> Firestore: deleteDoc(docRef)
       └─> Storage: arquivo fica orphaned (não pode deletar via CORS)
       └─> Audit: logAuditAction('delete', docId, ...)

4. Hook atualiza estado
   └─> documents = [...].filter(d => d.id !== docId)

5. Component re-renderiza
   └─> UI: Documento desaparece da lista
```

---

## 🧪 Testabilidade

A estrutura é altamente testável:

### Teste de Service

```typescript
describe('documentService', () => {
  test('uploadDocument deve salvar arquivo', async () => {
    const file = new File(['pdf'], 'test.pdf');
    const metadata = { name: 'Test', category: 'reports' };
    
    const result = await documentService.uploadDocument(file, metadata);
    
    expect(result.name).toBe('Test');
    expect(result.fileUrl).toBeDefined();
  });
});
```

### Teste de Hook

```typescript
describe('useDocuments', () => {
  test('upload deve adicionar documento à lista', async () => {
    const { result } = renderHook(() => useDocuments());
    
    await act(async () => {
      await result.current.upload(file, metadata);
    });
    
    expect(result.current.documents).toHaveLength(1);
  });
});
```

---

## 🚀 Próximos Passos

1. **Migração para Supabase** - Se necessário
2. **Adicionar Real-time** - Com listeners do Firestore
3. **Cache Local** - Com IndexedDB para offline
4. **GraphQL API** - Para queries mais eficientes

---

## 📚 Liens Úteis

- [Estrutura do Firestore](./FIRESTORE_SETUP.md)
- [Plano de Migração](./MIGRATION_PLAN.md)
- [Limpeza de Storage](./CLEANUP_INSTRUCTIONS.md)
