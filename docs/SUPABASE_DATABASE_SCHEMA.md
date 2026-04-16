# 🗄️ Supabase PostgreSQL - Estrutura de Banco de Dados

**Data de Criação:** 10 de abril de 2026  
**Status:** Planejamento para Integração Futura  
**Referência:** Educandário Admin Portal

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Tabelas Principais](#tabelas-principais)
3. [Relacionamentos](#relacionamentos)
4. [Comparação localStorage vs PostgreSQL](#comparação-localstorage-vs-postgresql)
5. [Fluxo de Dados](#fluxo-de-dados)
6. [Passo a Passo de Implementação](#passo-a-passo-de-implementação)

---

## 🎯 Visão Geral

Este documento descreve a estrutura de banco de dados PostgreSQL necessária para migrar o aplicativo Educandário de localStorage para Supabase.

**Dados Atuais em localStorage:**

- ✅ `adminProfile` - Perfil do usuário
- ✅ `adminPortal` - Configurações do portal
- ✅ `adminAvatar` - Foto de perfil (Base64)
- ✅ `auditLogs` - Histórico de ações
- ✅ `lastTransparencyUpload` - Timestamp de upload
- ✅ `theme` - Preferência de tema
- ✅ `documents` - Metadados de documentos

---

## 🗄️ Tabelas Principais

### 1️⃣ **PROFILES** - Perfil do Usuário

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name VARCHAR(255),
  email VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Relacionamento:**
- 1:1 com `auth.users` (usuário autenticado)
- 1:N com `documents` (documentos do usuario)
- 1:N com `audit_logs` (ações do usuário)

---

### 2️⃣ **DOCUMENTS** - Metadados de Documentos

```sql
CREATE TABLE documents (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  year INT,
  storage_url TEXT,
  file_size INT,
  public BOOLEAN DEFAULT FALSE,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP -- soft delete
);

CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_documents_year ON documents(year);
CREATE INDEX idx_documents_public ON documents(public);
```

**Dados de Exemplo:**

```sql
INSERT INTO documents (name, category, year, storage_url, public, uploaded_by)
VALUES (
  'Regimento_2024.pdf',
  'regimentos',
  2024,
  'https://storage.supabase.co/documents/regimento-2024.pdf',
  true,
  'user-uuid-123'
);
```

---

### 3️⃣ **AUDIT_LOGS** - Histórico de Ações

```sql
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  action VARCHAR(50), -- 'upload', 'update', 'delete', 'download'
  document_id BIGINT REFERENCES documents(id),
  details JSONB, -- dados adicionais
  ip_address INET,
  user_agent VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

---

### 4️⃣ **SETTINGS** - Preferências do Usuário

```sql
CREATE TABLE settings (
  user_id UUID PRIMARY KEY REFERENCES profiles(id),
  theme VARCHAR(20) DEFAULT 'light', -- 'light', 'dark'
  language VARCHAR(10) DEFAULT 'pt-BR',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 5️⃣ **DOCUMENT_TAGS** - Tags para Documentos

```sql
CREATE TABLE document_tags (
  id BIGSERIAL PRIMARY KEY,
  document_id BIGINT REFERENCES documents(id) ON DELETE CASCADE,
  tag VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(document_id, tag)
);

CREATE INDEX idx_document_tags_tag ON document_tags(tag);
```

---

## 🔗 Relacionamentos

```
┌──────────────────┐
│  auth.users      │
│  (Supabase Auth) │
└────────┬─────────┘
         │ 1:1
         │
    ┌────▼──────────────┐
    │     profiles      │
    │   (User Profiles) │
    └────┬──────────────┘
         │ 1:N
    ┌────┴───────────────┐
    │                    │
    │            ┌───────▼────────┐
    │ 1:N        │   documents    │
    ├────────────│ (Documentos)   │
    │            └────┬───────────┘
    │                 │ 1:N
    │                 │
    │            ┌────▼─────────────┐
    │     ┌──────┤  document_tags   │
    │     │      │   (Tags)         │
    │     │      └──────────────────┘
    │     │
    │ 1:N │
    │     │
┌───┴────▼────────────────┐
│    audit_logs           │
│ (Histórico de Ações)    │
└─────────────────────────┘
```

---

## 🔄 Comparação localStorage vs PostgreSQL

| Aspecto | localStorage | PostgreSQL (Supabase) |
|---------|-------------|----------------------|
| **Capacidade** | ~5-10MB | Ilimitado |
| **Segurança** | Nenhuma (plaintext) | RLS + Criptografia |
| **Acesso** | Local apenas | Multi-usuário |
| **Performance** | Rápida (local) | Rápida + indexada |
| **Persistência** | Por dispositivo | Central, backups automáticos |
| **Real-time** | Não | Sim (com Realtime) |
| **Histórico** | Limitado (10) | Completo (audit logs) |
| **Compartilhamento** | Impossível | Entre admins |
| **Sincronização** | Manual | Automática |

---

## 📊 Fluxo de Dados

### Upload de Documento

```
Frontend
  ├─> useDocuments.upload(file, metadata)
  │     └─> documentService.uploadDocument(file, metadata)
  │         ├─> Storage: Upload PDF
  │         │   └─> Result: storage_url
  │         ├─> Database: INSERT documents
  │         │   └─> Resultado: document_id
  │         └─> Audit: INSERT audit_logs
  │             └─> Result: log_id
  └─> Component atualiza lista
```

### Buscar Documentos

```
Frontend
  ├─> useDocuments.list(filters)
  │     └─> documentService.listDocuments(filters)
  │         └─> Database: SELECT documents WHERE public=true OR user=current
  │             └─> Result: Array<Document>
  └─> Component renderiza lista
```

---

## 🏗️ Passo a Passo de Implementação

### Fase 1: Preparação (Semana 1)

- [ ] Criar conta Supabase
- [ ] Criar projeto Supabase
- [ ] Executar SQL scripts (criar tabelas)
- [ ] Configurar Row Level Security (RLS)

### Fase 2: Migração (Semana 2)

- [ ] Exportar dados de localStorage
- [ ] Mapear dados para nova estrutura
- [ ] Importar dados para PostgreSQL
- [ ] Validar integridade dos dados

### Fase 3: Implementação (Semana 3-4)

- [ ] Atualizar `useDocuments` hook
- [ ] Atualizar `useAuth` hook
- [ ] Implementar Real-time listeners
- [ ] Testar todas as funcionalidades

### Fase 4: Deploy (Semana 5)

- [ ] Backup final de localStorage
- [ ] Deploy em produção
- [ ] Monitorar performance
- [ ] Suporte aos usuários

---

## 🔐 Row Level Security (RLS)

```sql
-- Documentos públicos: qualquer um pode ler
CREATE POLICY documents_public_read ON documents
  FOR SELECT USING (public = TRUE);

-- Apenas o autor pode editar/deletar seus documentos
CREATE POLICY documents_owner_write ON documents
  FOR UPDATE USING (uploaded_by = auth.uid());

-- Apenas admins podem ver documentos privados
CREATE POLICY documents_admin_read ON documents
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
```

---

## 📚 Próximas Leituras

- [Firebase Setup](./FIREBASE_SETUP.md)
- [Migration Plan](./MIGRATION_PLAN.md)
- [Documentação Supabase](https://supabase.com/docs)
