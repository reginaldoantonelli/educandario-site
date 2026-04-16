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

## 📅 Cronograma Estimado

| Fase | Duração | Atividades |
|------|---------|-----------|
| **1. Preparação** | 1-2 dias | Criar projeto Supabase, criar tabelas, configurar segurança |
| **2. Exportação** | 1 dia | Exportar dados de localStorage, mapear estrutura |
| **3. Importação** | 1 dia | Importar dados, validar integridade |
| **4. Dev &amp; Testes** | 3-5 dias | Implementar hooks, testar CRUD, testes E2E |
| **5. Deploy** | 1 dia | Deploy em staging, validação final, deploy prod |
| **6. Suporte** | 1 semana | Monitorar, corrigir bugs, otimizar |
| **TOTAL** | **10-15 dias** | |

---

## 🎯 Fases Detalhadas

### Fase 1️⃣: Preparação (1-2 dias)

#### 1.1 Criar Conta Supabase
```bash
1. Vá para https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub/Google
4. Crie novo projeto
5. Selecione região "São Paulo" (sa-east1)
```

#### 1.2 Criar Tabelas
```bash
# Executar SQL no editor Supabase
# Ver arquivo: SUPABASE_DATABASE_SCHEMA.md

# 1. PROFILES
CREATE TABLE profiles (...)

# 2. DOCUMENTS
CREATE TABLE documents (...)

# 3. AUDIT_LOGS
CREATE TABLE audit_logs (...)

# 4. DOCUMENT_TAGS
CREATE TABLE document_tags (...)

# 5. SETTINGS
CREATE TABLE settings (...)
```

#### 1.3 Configurar Segurança (RLS)
```bash
# Habilitar Row Level Security em cada tabela
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

# Criar policies (ver SUPABASE_DATABASE_SCHEMA.md)
CREATE POLICY documentsPublicRead ON documents ...
```

---

### Fase 2️⃣: Exportação (1 dia)

#### 2.1 Exportar Dados de localStorage

```bash
# Script: scripts/export-localstorage.js
const localData = {
  documents: JSON.parse(localStorage.getItem('documents')) || [],
  auditLogs: JSON.parse(localStorage.getItem('auditLogs')) || [],
  adminProfile: JSON.parse(localStorage.getItem('adminProfile')),
  theme: localStorage.getItem('theme'),
};

// Salvar em arquivo JSON
```

#### 2.2 Validar Estrutura

```bash
# Verificar se os dados estão válidos
documents.forEach(doc => {
  console.assert(doc.id, 'Missing ID');
  console.assert(doc.name, 'Missing name');
  console.assert(doc.category, 'Missing category');
});
```

---

### Fase 3️⃣: Importação (1 dia)

#### 3.1 Criar Script de Importação

```bash
# Script: scripts/import-supabase.js
const supabase = require('@supabase/supabase-js');

const data = require('./export-localstorage.json');

// 1. Importar documents
for (const doc of data.documents) {
  await supabase
    .from('documents')
    .insert(doc);
}

// 2. Importar audit_logs
for (const log of data.auditLogs) {
  await supabase
    .from('audit_logs')
    .insert(log);
}
```

#### 3.2 Executar Importação

```bash
npm run import-supabase
# ✅ 42 documentos importados
# ✅ 156 logs importados
```

#### 3.3 Validar Dados

```sql
-- Verificar totais
SELECT COUNT(*) FROM documents;        -- deve ser 42
SELECT COUNT(*) FROM audit_logs;       -- deve ser 156

-- Verificar integridade
SELECT * FROM documents WHERE name IS NULL;  -- deve ser vazio
```

---

### Fase 4️⃣: Desenvolvimento (3-5 dias)

#### 4.1 Atualizar `useDocuments` Hook

**Antes (localStorage):**
```typescript
export const useDocuments = () => {
  const [documents, setDocuments] = useState(() => 
    JSON.parse(localStorage.getItem('documents')) || []
  );
  
  const upload = (file, metadata) => {
    const newDoc = { id: uuid(), ...metadata };
    setDocuments([...documents, newDoc]);
    localStorage.setItem('documents', JSON.stringify([...documents, newDoc]));
  };
  
  return { documents, upload };
};
```

**Depois (Supabase):**
```typescript
export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  
  const load = async () => {
    const { data } = await supabase.from('documents').select();
    setDocuments(data);
  };
  
  const upload = async (file, metadata) => {
    const { data } = await supabase
      .from('documents')
      .insert([metadata])
      .select()
      .single();
    
    setDocuments([...documents, data]);
    
    // Log de auditoria
    await auditService.log('upload', data.id);
  };
  
  useEffect(() => { load(); }, []);
  
  return { documents, upload, loading };
};
```

#### 4.2 Implementar Real-time Listeners

```typescript
// Escutar mudanças em tempo real
useEffect(() => {
  const subscription = supabase
    .from('documents')
    .on('*', payload => {
      // Quando alguém faz upload, atualizar lista
      setDocuments([...documents, payload.new]);
    })
    .subscribe();
  
  return () => subscription.unsubscribe();
}, [documents]);
```

#### 4.3 Testar CRUD

- [ ] **Create:** Upload novo documento ✅
- [ ] **Read:** Listar documentos ✅
- [ ] **Update:** Editar nome/categoria ✅
- [ ] **Delete:** Deletar documento ✅
- [ ] **Search:** Buscar por nome/tag ✅
- [ ] **Filter:** Filtrar por categoria/ano ✅

---

### Fase 5️⃣: Deploy (1 dia)

#### 5.1 Preparar Produção

```bash
# 1. Criar backup final de localStorage
npm run backup-localstorage

# 2. Criar .env.production com credenciais Supabase
cp .env .env.production
# Editar com URLs de produção

# 3. Build para produção
npm run build

# 4. Deploy em staging
npm run deploy:staging
```

#### 5.2 Testes em Staging

- [ ] Login funciona ✅
- [ ] Upload de documento ✅
- [ ] Edição de documento ✅
- [ ] Deleção de documento ✅
- [ ] Visualização de documentos públicos ✅
- [ ] Real-time updates ✅
- [ ] Performance ok (< 2s) ✅

#### 5.3 Deploy em Produção

```bash
# Se staging OK, fazer deploy
npm run deploy:production

# Comunicar aos usuários
# "Sistema migrado para nova plataforma"
```

---

### Fase 6️⃣: Suporte (1 semana)

- [ ] Monitorar logs de erro
- [ ] Corrigir bugs encontrados
- [ ] Otimizar queries lentas
- [ ] Apoiar usuários em dificuldades
- [ ] Documentar lições aprendidas

---

## 🛠️ Tarefas Específicas

### Backend Setup

```
Supabase Project
├── Database
│   ├── Tables (5 tabelas)
│   ├── Indexes (6 indexes)
│   ├── RLS Policies (8 policies)
│   └── Triggers (opcional)
├── Storage
│   ├── Bucket: documents
│   └── RLS Policies
└── Auth
    ├── Email/Password
    └── JWT Claims
```

### Frontend Implementation

```
Code Updates
├── constants/
│   └── supabase-config.ts (nova)
├── services/
│   ├── supabase-client.ts (atualizar)
│   └── documentService.ts (refactor)
├── hooks/
│   └── useDocuments.ts (migrar)
├── components/
│   └── (reaproveitam hooks)
└── utils/
    └── export-import.ts (helpers)
```

### Testing

```
Test Suite
├── Unit Tests
│   ├── documentService.test.ts
│   └── auditService.test.ts
├── Integration Tests
│   ├── useDocuments.test.tsx
│   └── useAuditLogs.test.tsx
└── E2E Tests
    ├── Upload flow
    ├── Edit flow
    └── Delete flow
```

---

## 🎓 Aprendizados do localStorage

✅ **O que funciona bem:**
- Simples para prototipar
- Sem dependências externas
- Rápido para leitura/escrita
- Bom para preferências do usuário

❌ **Limitações:**
- Sem segurança (plaintext)
- Não sincroniza entre dispositivos
- Limite de 5-10MB
- Sem histórico completo
- Difícil para multi-usuário

→ **Conclusão:** localStorage é ótimo para MVP, mas PostgreSQL é melhor para produção

---

## 💰 Custo

### Supabase Pricing

| Plano | Preço | Limite |
|------|-------|--------|
| **Free** | Free | 500MB DB + 1GB Storage |
| **Pro** | $25/mês | 8GB DB + 100GB Storage |
| **Business** | $100/mês+ | Ilimitado |

**Estimativa para Educandário:**
- Documentos: ~100 PDFs = ~500MB
- Audit logs: ~1000 entries = ~5MB
- Profile pictures: ~10MB
- **Total: ~515MB → Free tier suficiente agora, Pro no futuro**

---

## ✅ Checklist de Migração

- [ ] Conta Supabase criada
- [ ] Tabelas criadas
- [ ] RLS configurado
- [ ] Dados exportados
- [ ] Dados importados
- [ ] Validação de integridade OK
- [ ] Hooks refatorados
- [ ] Testes passando
- [ ] Deploy em staging
- [ ] Testes em staging OK
- [ ] Deploy em produção
- [ ] Monitoramento ativo
- [ ] localStorage removido (após 1 mês)

---

## 📚 Referências

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Database Schema](./SUPABASE_DATABASE_SCHEMA.md)
- [React Custom Hooks Patterns](https://react.dev/reference/react/hooks)

---

**Próximas ações:** Desenvolver com Firebase ou Supabase? Depende da escala e complexidade do projeto.
