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

**Campos:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | ID do usuário (referencia auth.users) |
| `display_name` | VARCHAR(255) | Nome de exibição (ex: "Admin Iago") |
| `email` | VARCHAR(255) | E-mail do usuário |
| `avatar_url` | TEXT | URL da foto no Supabase Storage |
| `created_at` | TIMESTAMP | Data de criação (automático) |
| `updated_at` | TIMESTAMP | Data da última atualização (automático) |

**Exemplo de Dados:**

```
┌──────────────────────────────────────────────────────────────┐
│ profiles                                                     │
├───────────────┬────────────────────┬──────────────┬────────┤
│ id            │ display_name       │ email        │ avatar │
├───────────────┼────────────────────┼──────────────┼────────┤
│ abc-123-def   │ Admin Iago         │ iago@edu...  │ https/ │
└───────────────┴────────────────────┴──────────────┴────────┘
```

**Migrando de:**

```javascript
// localStorage atual
{
  adminProfile: {
    displayName: "Admin Iago",
    email: "iago@educandario.com.br"
  },
  adminAvatar: "data:image/png;base64,iVBORw0KGgo..."
}
```

---

### 2️⃣ **AUDIT_LOGS** - Histórico de Ações

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Campos:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | ID único do log |
| `user_id` | UUID | ID do usuário (quem fez a ação) |
| `action` | TEXT | Descrição da ação realizada |
| `timestamp` | TIMESTAMP | Quando a ação ocorreu |
| `created_at` | TIMESTAMP | Quando foi registrado no BD |

**Tipos de Ações Registradas:**

- ✏️ "Perfil atualizado: Admin Iago"
- 📤 "Arquivo enviado: Balancete_2025_Q4.pdf (Financeiro)"
- 🗑️ "Arquivo removido: Plano_Anual_2025.pdf"
- ✏️ "Arquivo editado: Estatuto_Social.pdf"
- 🔐 "2FA ativado"
- 🔐 "2FA desativado"
- 📷 "Foto de perfil atualizada"
- 📷 "Foto de perfil removida"
- 🔌 "Portal configurações salvas"
- 🔑 "Senha alterada"

**Exemplo de Dados:**

```
┌────────────┬──────────────┬────────────────────────────────┬─────────────────┐
│ id         │ user_id      │ action                         │ timestamp       │
├────────────┼──────────────┼────────────────────────────────┼─────────────────┤
│ uuid-1     │ abc-123-def  │ 📤 Arquivo enviado: Balancete  │ 10/04/26 14:30  │
│ uuid-2     │ abc-123-def  │ 🗑️ Arquivo removido: Plano     │ 10/04/26 13:45  │
│ uuid-3     │ abc-123-def  │ ✏️ Perfil atualizado           │ 10/04/26 12:15  │
│ uuid-4     │ abc-123-def  │ 📷 Foto de perfil atualizada   │ 10/04/26 11:00  │
└────────────┴──────────────┴────────────────────────────────┴─────────────────┘
```

**Migrando de:**

```javascript
// localStorage atual (máx 10 entradas)
{
  auditLogs: [
    {
      id: "1712761800000",
      action: "📤 Arquivo enviado: Balancete_2025_Q4.pdf (Financeiro)",
      timestamp: "10/04/2026 às 14:30"
    },
    // ... mais 9 entradas
  ]
}
```

**Diferença Principal:**

- localStorage: máx 10 entradas (limite manual)
- PostgreSQL: **histórico ilimitado** ✨

---

### 3️⃣ **CATEGORIES** - Categorias de Documentos

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  category_key VARCHAR(50) UNIQUE,
  title VARCHAR(255),
  short_title VARCHAR(100),
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Campos:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | ID único da categoria |
| `user_id` | UUID | ID do admin |
| `category_key` | VARCHAR(50) | Chave única (ex: "ensa", "promotional") |
| `title` | VARCHAR(255) | Título completo (ex: "Documentos – ENSA") |
| `short_title` | VARCHAR(100) | Título curto para sidebar (ex: "Institucional") |
| `description` | TEXT | Descrição da categoria |
| `display_order` | INTEGER | Ordem de exibição na página |
| `created_at` | TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | Data da última atualização |

**Exemplo de Dados:**

```
┌────────┬──────────────┬───────────┬──────────────────────┬─────────────────┐
│ id     │ category_key │ title     │ short_title          │ display_order   │
├────────┼──────────────┼───────────┼──────────────────────┼─────────────────┤
│ uuid-1 │ ensa         │ Documentos│ Institucional        │ 1               │
│        │              │ – ENSA    │                      │                 │
├────────┼──────────────┼───────────┼──────────────────────┼─────────────────┤
│ uuid-2 │ promotional  │ Documentos│ Promoção Social      │ 2               │
│        │              │ de Promo… │                      │                 │
├────────┼──────────────┼───────────┼──────────────────────┼─────────────────┤
│ uuid-3 │ cpfl         │ Convênio  │ Convênio CPFL        │ 3               │
│        │              │ CPFL      │                      │                 │
├────────┼──────────────┼───────────┼──────────────────────┼─────────────────┤
│ uuid-4 │ education    │ Documentos│ Educação             │ 4               │
│        │              │ – Educação│                      │                 │
└────────┴──────────────┴───────────┴──────────────────────┴─────────────────┘
```

---

### 4️⃣ **DOCUMENTS** - Arquivos da Transparência

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  category_id UUID REFERENCES categories(id),
  title VARCHAR(255),
  year VARCHAR(20),
  visibilidade VARCHAR(50) DEFAULT 'public',
  file_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Campos:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | ID único do documento |
| `user_id` | UUID | ID do admin que carregou |
| `category_id` | UUID | ID da categoria (FK) |
| `title` | VARCHAR(255) | Nome do arquivo (ex: "Estatuto Social Atualizado") |
| `year` | VARCHAR(20) | Ano/período (ex: "2024", "2022-2025") |
| `visibilidade` | VARCHAR(50) | 'public', 'private', 'restricted' |
| `file_url` | TEXT | URL do arquivo no Supabase Storage |
| `created_at` | TIMESTAMP | Data de upload |
| `updated_at` | TIMESTAMP | Data da última modificação |

**Exemplo de Dados:**

```
┌────────┬──────────┬──────────────────────────────────┬──────────┬──────────────┐
│ id     │ cat_id   │ title                            │ year     │ visibility   │
├────────┼──────────┼──────────────────────────────────┼──────────┼──────────────┤
│ uuid-1 │ uuid-cat1│ Estatuto Social Atualizado       │ 2024     │ public       │
├────────┼──────────┼──────────────────────────────────┼──────────┼──────────────┤
│ uuid-2 │ uuid-cat1│ Ata de Eleição de Diretoria      │ 2022-202 │ public       │
├────────┼──────────┤                                  ├──────────┤              │
│ uuid-3 │ uuid-cat1│ Cartão CNPJ                      │ 2024     │ public       │
├────────┼──────────┼──────────────────────────────────┼──────────┼──────────────┤
│ uuid-4 │ uuid-cat2│ Projeto Reforço Escolar 2025     │ 2025     │ public       │
├────────┼──────────┼──────────────────────────────────┼──────────┼──────────────┤
│ uuid-5 │ uuid-cat3│ Acordo CPFL – Bolsas             │ 2024     │ restricted   │
└────────┴──────────┴──────────────────────────────────┴──────────┴──────────────┘
```

**Relacionamento com Categories:**

- Um documento pertence a UMA categoria
- Uma categoria contém MÚLTIPLOS documentos
- Categoria governa a página onde aparece (sidebar)

---

### 5️⃣ **PORTAL_SETTINGS** - Configurações do Portal

```sql
CREATE TABLE portal_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  description TEXT,
  website VARCHAR(255),
  phone VARCHAR(20),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Campos:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | ID único |
| `user_id` | UUID | ID do admin |
| `description` | TEXT | Descrição da instituição |
| `website` | VARCHAR(255) | URL do site |
| `phone` | VARCHAR(20) | Telefone de contato |
| `updated_at` | TIMESTAMP | Última atualização |

**Exemplo de Dados:**

```
┌────────┬──────────────┬─────────────────────────────┬──────────────────┐
│ id     │ user_id      │ description                 │ website          │
├────────┼──────────────┼─────────────────────────────┼──────────────────┤
│ uuid-1 │ abc-123-def  │ Instituição dedicada à...   │ https://educa...  │
└────────┴──────────────┴─────────────────────────────┴──────────────────┘
```

**Migrando de:**

```javascript
// localStorage atual
{
  adminPortal: {
    description: "Instituição dedicada à promoção de educação...",
    website: "https://www.educandario.com.br",
    phone: "(11) 3456-7890"
  }
}
```

---

### 6️⃣ **USER_PREFERENCES** - Preferências do Usuário

```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  theme VARCHAR(20) DEFAULT 'light',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Campos:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | ID único |
| `user_id` | UUID | ID do admin |
| `theme` | VARCHAR(20) | 'light' ou 'dark' |
| `updated_at` | TIMESTAMP | Última atualização |

**Exemplo de Dados:**

```
┌────────┬──────────────┬───────┐
│ id     │ user_id      │ theme │
├────────┼──────────────┼───────┤
│ uuid-1 │ abc-123-def  │ dark  │
└────────┴──────────────┴───────┘
```

**Migrando de:**

```javascript
// localStorage atual
{
  theme: 'dark'  // ou 'light'
}
```

---

## 🔗 Relacionamentos

### Diagrama de Relacionamentos

```
┌─────────────────────────────────────────────────────┐
│           auth.users (Supabase Auth)                │
│  (ID, Email, Password - gerenciado por Supabase)   │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┼──────────┬──────────────┬────────────┬──────────────┐
        │          │          │              │            │              │
        ▼          ▼          ▼              ▼            ▼              ▼
   ┌────────┐ ┌────────────┐ ┌───────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
   │profiles│ │audit_logs  │ │categories │ │documents │ │portal_   │ │user_        │
   │        │ │            │ │           │ │          │ │settings  │ │preferences  │
   │(1:1)   │ │ (1:N)      │ │ (1:N)     │ │ (N:1)    │ │ (1:1)    │ │ (1:1)       │
   └────────┘ └────────────┘ └─────┬─────┘ └────┬─────┘ └──────────┘ └──────────────┘
                                   │            │
                                   └────────────┘
                                      (FK)
```

**Legenda:**

- `1:1` = Um usuário para um registro
- `1:N` = Um usuário para vários registros
- `N:1` = Vários documentos para uma categoria
- `FK` = Foreign Key (chave estrangeira)

**Explicação:**

- Um usuário → UM perfil
- Um usuário → VÁRIOS logs de auditoria
- Um usuário → VÁRIOS categorias (admin pode criar/editar categorias)
- Uma categoria → VÁRIOS documentos
- Um usuário → UMA configuração de portal
- Um usuário → UMA preferência de tema

**Fluxo Visível na Página Pública:**

```
CATEGORIES (na página pública)
    ├─ Institucional (shortTitle)
    │  └─ [documents do tipo uuid-cat1]
    ├─ Promoção Social
    │  └─ [documents do tipo uuid-cat2]
    ├─ Convênio CPFL
    │  └─ [documents do tipo uuid-cat3]
    └─ Educação
       └─ [documents do tipo uuid-cat4]
```

---

## 📊 Comparação: localStorage vs PostgreSQL

| Feature | localStorage | PostgreSQL (Supabase) |
|---------|-------------|----------------------|
| **Limite de armazenamento** | ~5-10MB | Ilimitado ♾️ |
| **Acesso offline** | ✅ Sim | ❌ Não (cache possível) |
| **Compartilhar dados** | ❌ Por navegador | ✅ Múltiplos admins/devices |
| **Segurança** | ❌ Fraca (Base64 visível) | ✅ Forte (RLS, JWT, Criptografia) |
| **Backups automáticos** | ❌ Não | ✅ Diário (Supabase) |
| **Consultas complexas** | ❌ Impossível | ✅ SQL completo |
| **Real-time** | ❌ Não | ✅ WebSockets |
| **Histórico ilimitado** | ❌ Máx 10 (audit) | ✅ Completo |
| **Filtros avançados** | ❌ By-hand | ✅ SQL WHERE, JOIN, etc. |
| **Relacionamentos** | ❌ Não | ✅ Foreign Keys |
| **Transações** | ❌ Não | ✅ ACID completo |
| **Permissões por linha** | ❌ Não | ✅ RLS (Row Level Security) |
| **Página pública + admin sincronizadas** | ❌ Dados hardcoded | ✅ Dados em tempo real |
| **Múltiplas categorias** | ❌ Fixas no código | ✅ Gerenciáveis pelo admin |

---

## 🔄 Fluxo de Dados

### Cenário 1: Upload de Arquivo

```
┌──────────────────────────────────────────┐
│ User clica "Novo PDF" em Transparência  │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│  UploadModal abre + lista CATEGORIAS    │
│  (SELECT * FROM categories)              │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ User seleciona:                         │
│ ├─ Categoria: "Institucional"           │
│ ├─ PDF: "Estatuto Social Atualizado"    │
│ └─ Ano: "2024"                          │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ handleUpload(uploadData)                 │
│ ├─ Validar arquivo (5MB max)            │
│ ├─ Upload para Storage                 │
│ └─ Obter file_url                      │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ INSERT INTO documents                    │
│ {                                       │
│   title: "Estatuto Social Atualizado",  │
│   category_id: "uuid-from-categoria",   │
│   year: "2024",                         │
│   visibilidade: "public",               │
│   file_url: "https://..."               │
│ }                                       │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ INSERT INTO audit_logs                  │
│ {                                       │
│   action: "📤 Arquivo enviado",         │
│   timestamp: CURRENT_TIMESTAMP          │
│ }                                       │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ ✅ Sucesso! Arquivo listado na página  │
│    em Transparência (Institucional)     │
│                                         │
│ ✅ Aparece na página PÚBLICA            │
│    (SELECT * FROM documents WHERE      │
│     category_id = ... AND               │
│     visibilidade = 'public')            │
└──────────────────────────────────────────┘
```

### Cenário 2: Atualizar Perfil

```
┌──────────────────────────────────────┐
│  User edita nome em Configurações   │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  handleSaveProfile()                  │
│  ├─ Validar dados                   │
│  └─ UPDATE profiles table            │
│     {                                │
│       display_name: "Novo Nome",     │
│       email: "novo@email.com"        │
│     }                                │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  INSERT audit_logs                  │
│  {                                  │
│    action: "✏️ Perfil atualizado",  │
│    timestamp: CURRENT_TIMESTAMP     │
│  }                                  │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  Emitir CustomEvent 'profileUpdated' │
│  (para sincronizar header do layout) │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  ✅ Perfil salvo + Auditado          │
│  DashboardLayout atualiza nome       │
└──────────────────────────────────────┘
```

---

## 🚀 Passo a Passo de Implementação

### Phase 1: Setup Supabase ⚙️

```bash
# 1. Criar projeto em supabase.com
# 2. Copiar URL e ANON KEY

# 3. Instalar SDK
npm install @supabase/supabase-js

# 4. Criar arquivo de configuração
# src/services/supabaseClient.ts
```

### Phase 2: Criar Tabelas 🗄️

Cole os comandos SQL no SQL Editor do Supabase:

```sql
-- 1. PROFILES
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name VARCHAR(255),
  email VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. AUDIT_LOGS
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. CATEGORIES
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  category_key VARCHAR(50) UNIQUE,
  title VARCHAR(255),
  short_title VARCHAR(100),
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. DOCUMENTS
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  category_id UUID REFERENCES categories(id),
  title VARCHAR(255),
  year VARCHAR(20),
  visibilidade VARCHAR(50) DEFAULT 'public',
  file_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. PORTAL_SETTINGS
CREATE TABLE portal_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  description TEXT,
  website VARCHAR(255),
  phone VARCHAR(20),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. USER_PREFERENCES
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  theme VARCHAR(20) DEFAULT 'light',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Phase 3: Habilitar Segurança 🔐

```sql
-- Habilitar Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Políticas (exemplos)
CREATE POLICY "Users can see their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Categories visíveis para página pública
CREATE POLICY "Anyone can view public categories"
ON categories FOR SELECT
USING (true);

-- Apenas admin pode modificar categorias
CREATE POLICY "Only admin can manage categories"
ON categories FOR INSERT, UPDATE, DELETE
USING (auth.uid() = user_id);

-- Documents visíveis se public
CREATE POLICY "Anyone can view public documents"
ON documents FOR SELECT
USING (visibilidade = 'public');

-- Apenas admin pode modificar docs
CREATE POLICY "Only admin can manage documents"
ON documents FOR INSERT, UPDATE, DELETE
USING (auth.uid() = user_id);
```

### Phase 4: Refatorar Código React 💻

```typescript
// src/services/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Usar em componentes
import { supabase } from '@/services/supabaseClient';

// Exemplo: Carregar perfil
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();
```

---

## 📚 Recursos Úteis

- 🔗 [Supabase Documentation](https://supabase.com/docs)
- 📖 [PostgreSQL Guide](https://www.postgresql.org/docs/)
- 🔐 [Supabase Auth Flow](https://supabase.com/docs/guides/auth)
- 📁 [Supabase Storage](https://supabase.com/docs/guides/storage)
- ⚡ [Realtime with Supabase](https://supabase.com/docs/guides/realtime)

---

## 🎯 Resumo

| Tabela | Registros | Função |
|--------|-----------|--------|
| **profiles** | 1 | Dados do admin |
| **audit_logs** | ♾️ (ilimitado) | Histórico de ações |
| **categories** | 4+ | Categorias da página pública |
| **documents** | ♾️ Múltiplos | Arquivos (vinculados a categorias) |
| **portal_settings** | 1 | Config do portal |
| **user_preferences** | 1 | Preferências (tema) |

**Total de 6 tabelas · Relacionadas à auth.users**

**Principais Benefícios com Categorias:**

- ✅ Página pública dinâmica (não hardcoded)
- ✅ Admin controla categorias
- ✅ Documentos aparecem automaticamente na página pública
- ✅ Dados sincronizados em tempo real
- ✅ Relação clara entre documents → categories

---

**Última Atualização:** 10 de abril de 2026 (v2 - Com Categories)  
**Status:** Pronto para Implementação  
**Próximo Passo:** Criar conta Supabase e executar SQLs
