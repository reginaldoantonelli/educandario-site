# 🚀 Plano de Migração para Supabase

**Status:** Em Preparação  
**Data de Criação:** 10 de abril de 2026  
**Objetivo:** Migrar dados de localStorage para Supabase PostgreSQL

---

## 📋 Visão Geral

Este documento descreve o plano de migração do aplicativo Educandário de **localStorage** para **Supabase**.

### Por Que Migrar?

| Aspecto | localStorage | Supabase |
|--------|-------------|----------|
| **Persistência** | ~5-10MB | Ilimitado |
| **Segurança** | Nenhuma | RLS + Criptografia |
| **Compartilhamento** | Por dispositivo | Múltiplos admins |
| **Histórico** | Limitado (10) | Completo |
| **Real-time** | Não | Sim |
| **Backups** | Não | Automático |

---

## 🏗️ Arquitetura Preparada

### Estrutura Criada (Pronto para Migração)

```
src/
├── types/
│   └── index.ts                 ✅ Tipos centralizados
├── services/
│   ├── supabaseClient.ts        ✅ Cliente (vazio, pronto)
│   ├── documentService.ts       ✅ Abstrato (localStorage)
│   └── auditService.ts          ✅ Abstrato (localStorage)
└── hooks/
    ├── useDocuments.ts          ✅ Hook de documentos
    └── useAuditLogs.ts          ✅ Hook de logs
```

### Por Que Esta Estrutura?

✅ **Separation of Concerns** - Dados separados de UI  
✅ **Easy to Test** - Hooks e services são testáveis  
✅ **Easy to Migrate** - Trocar implementação sem afetar UI  
✅ **Type-Safe** - TypeScript garante consistência  
✅ **Reusable** - Hooks podem ser usados em múltiplos componentes  

---

## 📝 Como Usar Agora (localStorage)

### Exemplo 1: Listar Documentos

**Antes:**
```typescript
const [documents, setDocuments] = useState([
  { id: 1, nome: 'Estatuto.pdf', categoria: 'Juridico', ... },
]);
```

**Depois:**
```typescript
import { useDocuments } from '@/hooks/useDocuments';

export function TransparencyAdmin() {
  const { documents, loading, error } = useDocuments();
  
  return (
    <>
      {loading && <p>Carregando...</p>}
      {error && <p>Erro: {error}</p>}
      <div>
        {documents.map(doc => (
          <div key={doc.id}>{doc.title}</div>
        ))}
      </div>
    </>
  );
}
```

### Exemplo 2: Deletar Documento

**Antes:**
```typescript
const handleConfirmDelete = () => {
  setDocuments(docs.filter(d => d.id !== id));
  addAuditLog(`🗑️ Arquivo removido: ${name}`);
};
```

**Depois:**
```typescript
const { deleteDocument } = useDocuments();

const handleConfirmDelete = async () => {
  const success = await deleteDocument(docId, 'Estatuto.pdf');
  if (success) {
    setDeleteModalOpen(false);
    // Auditoria e estado atualizados automaticamente
  }
};
```

---

## 🔄 Plano de Migração (Fases)

### Fase 0: PREPARAÇÃO ✅ (CONCLUÍDA)

- ✅ Criar tipos TypeScript centralizados
- ✅ Criar serviços abstratos (localStorage)
- ✅ Criar custom hooks
- ✅ Documentar estrutura

**Quanto?** Agora  
**Esforço:** Nenhum (já feito)

---

### Fase 1: SETUP SUPABASE (1-2h)

**O que fazer:**
1. Criar conta em supabase.com
2. Criar projeto
3. Copiar URL e ANON_KEY
4. Adicionar ao arquivo `.env`:
   ```
   REACT_APP_SUPABASE_URL=https://your-project.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key
   ```

**Arquivo afetado:**
- `src/services/supabaseClient.ts` (já existe, pronto)

---

### Fase 2: CRIAR TABELAS SUPABASE (30min)

**Copiar SQL no dashboard Supabase:**

```sql
-- Tabelas do Educandário
-- Ver: SUPABASE_DATABASE_SCHEMA.md para SQL completo

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  category_key VARCHAR(50),
  title VARCHAR(255),
  short_title VARCHAR(100),
  description TEXT,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  category_id UUID REFERENCES categories(id),
  title VARCHAR(255),
  year VARCHAR(20),
  visibilidade VARCHAR(50),
  file_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- (3 mais tabelas: profiles, portal_settings, user_preferences)
-- Ver SUPABASE_DATABASE_SCHEMA.md
```

**Tempo estimado:** 30 minutos

---

### Fase 3: IMPLEMENTAR ROW LEVEL SECURITY (30min)

```sql
-- Apenas admin consegue deletar seus próprios docs
CREATE POLICY "Only admin can delete own documents"
ON documents FOR DELETE
USING (auth.uid() = user_id);

-- (Mais 5-7 policies)
-- Ver SUPABASE_DATABASE_SCHEMA.md
```

**Tempo estimado:** 30 minutos

---

### Fase 4: REFATORAR SERVICES (1-2h)

**arquivo:** `src/services/documentService.ts`

De:
```typescript
async getDocuments(): Promise<Document[]> {
  const saved = localStorage.getItem(DOCUMENTS_KEY);
  return saved ? JSON.parse(saved) : [];
}
```

Para:
```typescript
async getDocuments(): Promise<Document[]> {
  const { data, error } = await supabase
    .from('documents')
    .select('*');
  
  if (error) throw error;
  return data || [];
}
```

**Mudanças Similares:**
- `createDocument()` → INSERT
- `updateDocument()` → UPDATE
- `deleteDocument()` → DELETE

**Tempo estimado:** 1-2 horas

---

### Fase 5: REFATORAR AUDIT SERVICE (30min)

Mesma lógica que documentService.

**Tempo estimado:** 30 minutos

---

### Fase 6: TESTAR (1-2h)

- Type check: `npm run build`
- Testes manuais de CRUD
- Verificar auditoria
- Verificar RLS

**Tempo estimado:** 1-2 horas

---

### Fase 7: DATA MIGRATION (30min-1h)

Transferir dados de localStorage para Supabase:

```typescript
async function migrateData() {
  // 1. Ler documentos do localStorage
  const docs = await documentService.getDocuments();
  
  // 2. Inserir no Supabase
  for (const doc of docs) {
    await supabase.from('documents').insert([doc]);
  }
  
  // 3. Limpar localStorage
  localStorage.removeItem('documents');
}
```

**Tempo estimado:** 30min-1h

---

## 📊 Cronograma Total

| Fase | Descrição | Tempo | Status |
|------|-----------|-------|--------|
| 0 | Preparação (types, services, hooks) | 0h | ✅ Concluído |
| 1 | Setup Supabase | 1-2h | ⏳ Próximo |
| 2 | Criar tabelas | 30min | ⏳ |
| 3 | RLS policies | 30min | ⏳ |
| 4 | Refatorar services | 1-2h | ⏳ |
| 5 | Refatorar audit | 30min | ⏳ |
| 6 | Testar | 1-2h | ⏳ |
| 7 | Migrar dados | 30min-1h | ⏳ |
| **TOTAL** | | **5-8h** | |

---

## 🔧 Checklist de Migração

### Antes de Começar
- [ ] Fazer backup dos dados atuais (localStorage)
- [ ] Ler SUPABASE_DATABASE_SCHEMA.md
- [ ] Criar conta Supabase
- [ ] Copiar credenciais para .env.local

### Durante Migração
- [ ] Criar tabelas no Supabase
- [ ] Testes de inserção manualmente
- [ ] Configurar RLS
- [ ] Refatorar documentService.ts
- [ ] Refatorar auditService.ts
- [ ] Atualizar tipos se necessário
- [ ] Testar CRUD completo
- [ ] Verificar auditoria

### Após Migração
- [ ] Deploy em produção
- [ ] Monitorar logs
- [ ] Manter backup de localStorage por 1 semana
- [ ] Documentar lições aprendidas

---

## 📚 Arquivos de Referência

| Arquivo | Descrição |
|---------|-----------|
| `SUPABASE_DATABASE_SCHEMA.md` | Schema completo com SQL |
| `src/types/index.ts` | Tipos TypeScript |
| `src/services/documentService.ts` | Serviço de documentos |
| `src/services/auditService.ts` | Serviço de auditoria |
| `src/hooks/useDocuments.ts` | Hook de documentos |
| `src/hooks/useAuditLogs.ts` | Hook de logs |

---

## 🛠️ Troubleshooting

### "Cannot find module '@supabase/supabase-js'"

```bash
npm install @supabase/supabase-js
```

### ".env não está sendo lido"

```bash
# Certifique-se de:
# 1. Usar REACT_APP_ como prefixo
# 2. Reiniciar servidor npm
# 3. Usar process.env.REACT_APP_SUPABASE_URL
```

### RLS retorna "Permission denied"

```sql
-- Verificar se policy está permitindo a ação
SELECT * FROM auth.users;  -- User existe?
SELECT * FROM documents WHERE user_id = 'seu-uuid';
```

---

## 🎯 Próximos Passos

1. ✅ **Agora** - Estrutura de tipos e services pronta
2. 🟡 **Quando pronto** - Seguir Fase 1-7 deste plano
3. 🔄 **Depois** - Integração com Supabase Auth (login)
4. 🎉 **Final** - Real-time updates com WebSockets

---

**Última Atualização:** 10 de abril de 2026  
**Responsável:** Você 😊  
**Dúvidas?** Ver SUPABASE_DATABASE_SCHEMA.md ou consultar docs Supabase
