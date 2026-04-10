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
           ├─→ localStorage (AGORA)
           └─→ Supabase (DEPOIS)
```

---

## 📖 Como Usar

### 1️⃣ Usar Hook em Componente

```typescript
import { useDocuments } from '@/hooks/useDocuments';

export function TransparencyAdmin() {
  const {
    documents,      // Array de documentos
    loading,        // boolean
    error,          // string | null
    createDocument, // async (doc) => Document | null
    updateDocument, // async (id, updates, title) => boolean
    deleteDocument, // async (id, title) => boolean
    fetchDocuments, // async () => void
    clearError      // () => void
  } = useDocuments();

  // Seu código aqui
  return (
    <div>
      {/* Render baseado em documents, loading, error */}
    </div>
  );
}
```

### 2️⃣ Exemplos de Operações

#### Listar Documentos

```typescript
const { documents, loading } = useDocuments();

{loading && <p>Carregando...</p>}
{documents.map(doc => (
  <div key={doc.id}>{doc.title}</div>
))}
```

#### Criar Documento

```typescript
const { createDocument } = useDocuments();

const newDoc = await createDocument({
  title: 'Estatuto.pdf',
  category: 'Institucional',
  year: '2024',
  visibilidade: 'public'
});
```

#### Deletar Documento

```typescript
const { deleteDocument } = useDocuments();

const success = await deleteDocument(docId, 'Estatuto.pdf');
if (success) {
  setDeleteModalOpen(false);
  // Auditoria registrada automaticamente ✅
}
```

### 3️⃣ Acessar Logs de Auditoria

```typescript
import { useAuditLogs } from '@/hooks/useAuditLogs';

export function SettingsHistory() {
  const { logs, loading } = useAuditLogs();

  return (
    <div>
      {logs.map(log => (
        <div key={log.id}>
          <p>{log.action}</p>
          <p>{log.timestamp}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔐 Tipos Disponíveis

### Document

```typescript
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
```

### AuditLog

```typescript
interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  timestamp: string;
  created_at?: string;
}
```

### Category

```typescript
interface Category {
  id: string;
  category_key: string;
  title: string;
  short_title: string;
  description: string;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}
```

---

## 🚦 Estados e Tratamento de Erros

```typescript
const { documents, loading, error, clearError } = useDocuments();

if (loading) return <p>Carregando...</p>;

if (error) return (
  <div>
    <p>Erro: {error}</p>
    <button onClick={clearError}>Descartar</button>
  </div>
);

return (
  <div>
    {documents.map(doc => (
      <DocumentCard key={doc.id} doc={doc} />
    ))}
  </div>
);
```

---

## 🔄 Antes vs Depois da Refatoração

### ❌ Antes (Direto no Componente)

```typescript
export function TransparencyAdmin() {
  const [documents, setDocuments] = useState([
    { id: 1, nome: 'Estatuto.pdf', ... },
  ]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      setDocuments(docs.filter(d => d.id !== docId));
      addAuditLog(`🗑️ Arquivo removido`);
      setIsDeleting(false);
    }, 800);
  };

  return (
    // ... 400+ linhas de JSX
  );
}
```

**Problemas:**

- Componente muito grande
- Lógica misturada com UI
- Difícil de testar
- Difícil de reutilizar

### ✅ Depois (Com Hooks e Services)

```typescript
export function TransparencyAdmin() {
  const {
    documents,
    loading,
    deleteDocument
  } = useDocuments();

  const handleConfirmDelete = async () => {
    const success = await deleteDocument(docId, 'Estatuto.pdf');
    if (success) {
      setDeleteModalOpen(false);
    }
  };

  return (
    // ... UI limpa
  );
}
```

**Benefícios:**

- ✅ Componente limpo e legível
- ✅ Lógica centralizada
- ✅ Fácil de testar
- ✅ Reutilizável em outros componentes

---

## 🧪 Como Testar

### Testar Hook

```typescript
import { renderHook, act } from '@testing-library/react';
import { useDocuments } from '@/hooks/useDocuments';

test('deve deletar documento', async () => {
  const { result } = renderHook(() => useDocuments());

  await act(async () => {
    await result.current.deleteDocument(1, 'Test.pdf');
  });

  expect(result.current.documents).toHaveLength(0);
});
```

### Testar Service

```typescript
import { documentService } from '@/services/documentService';

test('deve criar documento', async () => {
  const doc = await documentService.createDocument({
    title: 'Test',
    year: '2024',
    visibilidade: 'public'
  });

  expect(doc.id).toBeDefined();
});
```

---

## 🚀 Pronto para Supabase?

Quando quiser migrar:

1. Criar tabelas no Supabase (SQL em SUPABASE_DATABASE_SCHEMA.md)
2. Trocar `src/services/documentService.ts`:
   - De: `localStorage.getItem()`
   - Para: `supabase.from('documents').select()`
3. Trocar `src/services/auditService.ts`:
   - De: `localStorage.getItem('auditLogs')`
   - Para: `supabase.from('audit_logs').select()`
4. Componentes continuam **exatamente** os mesmos! ✨

Ver `MIGRATION_PLAN.md` para instruções detalhadas.

---

## 🎓 Princípios de Design

### 1. Separation of Concerns

- **Types:** Definem estrutura
- **Services:** Acessam dados
- **Hooks:** Gerenciam estado
- **Components:** Renderizam UI

### 2. Abstraction

Services abstraem localStorage/Supabase. Componentes não sabem diferença.

### 3. Reusability

Hooks podem ser usados em múltiplos componentes.

### 4. Type Safety

TypeScript garante que tipos estejam corretos.

### 5. Error Handling

Estados de erro e loading em todo lugar.

---

## 📚 Referências

| Arquivo | Para |
|---------|------|
| `src/types/index.ts` | Ver todos os tipos |
| `src/services/documentService.ts` | Entender lógica de documents |
| `src/services/auditService.ts` | Entender lógica de auditoria |
| `src/hooks/useDocuments.ts` | Ver como usar o hook |
| `SUPABASE_DATABASE_SCHEMA.md` | SQL das tabelas |
| `MIGRATION_PLAN.md` | Plano de migração |

---

## ❓ FAQ

### P: Posso usar `useDocuments` em outro componente?

**R:** Sim! Qualquer componente pode importar e usar o hook. Todo estado é isolado por instância.

### P: E se eu precisar de um novo serviço?

**R:** Crie `src/services/novoService.ts` seguindo o mesmo padrão. Depois crie `src/hooks/useNovo.ts`.

### P: Como migro de localStorage para Supabase?

**R:** Ver `MIGRATION_PLAN.md`. Resumo: trocar os `await`s em `documentService.ts`.

### P: TypeScript é obrigatório?

**R:** Recomendado! Mas funcionará com JavaScript também (usando JSDoc).

---

## 🤝 Contribuindo

Se adicionar novo tipo ou serviço:

1. Adicionar a `src/types/index.ts`
2. Criar serviço correspondente em `src/services/`
3. Criar hook correspondente em `src/hooks/`
4. Adicionar documentação aqui

---

**Última Atualização:** 10 de abril de 2026  
**Status:** ✅ Ready for Development
