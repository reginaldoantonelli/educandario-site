# 📚 Documentação - Educandário

Bem-vindo à documentação centralizada do projeto Educandário! 📖

---

## 🎯 Comece Aqui

- **Novo no projeto?** → Leia [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Quer configurar Firebase?** → Veja [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
- **Precisa migrar a conta Firebase?** → Consulte [FIREBASE_MIGRATION_GUIDE.md](./FIREBASE_MIGRATION_GUIDE.md)
- **Quer limpar arquivos órfãos?** → Use [CLEANUP_INSTRUCTIONS.md](./CLEANUP_INSTRUCTIONS.md)

---

## 📋 Índice de Documentos

### 🏗️ Arquitetura & Estrutura

| Documento | Propósito | Para Quem |
|-----------|----------|----------|
| [**ARCHITECTURE.md**](./ARCHITECTURE.md) | Visão geral da arquitetura, camadas, padrões de design | Developers, Tech Leads |
| [**MIGRATION_PLAN.md**](./MIGRATION_PLAN.md) | Plano de migração localStorage → Supabase | Product Managers, Developers |

### 🔥 Firebase

| Documento | Propósito | Para Quem |
|-----------|----------|----------|
| [**FIREBASE_SETUP.md**](./FIREBASE_SETUP.md) | Configuração inicial do Firebase | Developers, DevOps |
| [**FIREBASE_MIGRATION_GUIDE.md**](./FIREBASE_MIGRATION_GUIDE.md) | **Guia passo a passo para migrar Firebase de conta** | Product Owners, Developers |

### 🗄️ Banco de Dados

| Documento | Propósito | Para Quem |
|-----------|----------|----------|
| [**SUPABASE_DATABASE_SCHEMA.md**](./SUPABASE_DATABASE_SCHEMA.md) | Estrutura de tabelas PostgreSQL | Database Architects, Developers |

### 🔧 Scripts & Ferramentas

| Documento | Propósito | Para Quem |
|-----------|----------|----------|
| [**CLEANUP_INSTRUCTIONS.md**](./CLEANUP_INSTRUCTIONS.md) | Limpeza de arquivos órfãos do Storage | DevOps, Admins |

---

## 🚀 Guias Rápidos

### Como Configurar o Projeto Pela Primeira Vez?

1. Crie um projeto Firebase: [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
2. Entenda a arquitetura: [ARCHITECTURE.md](./ARCHITECTURE.md)
3. Configure variáveis de ambiente: `.env` (ver exemplo em FIREBASE_SETUP.md)
4. Rode `npm install && npm run dev`

### Como Migrar Firebase para Outra Conta?

➡️ **[FIREBASE_MIGRATION_GUIDE.md](./FIREBASE_MIGRATION_GUIDE.md)** - Guia completo com 6 fases

**Resumo:**
- Fase 1: Criar novo projeto Firebase ⏱️ 5 min
- Fase 2: Exportar dados atuais ⏱️ 10 min
- Fase 3: Configurar novo projeto ⏱️ 10 min
- Fase 4: Importar dados ⏱️ 10 min
- Fase 5: Atualizar código ⏱️ 5 min
- Fase 6: Testar funcionalidades ⏱️ 20 min
- **Total: ~60-90 minutos**

### Como Limpar Arquivos Órfãos do Storage?

➡️ **[CLEANUP_INSTRUCTIONS.md](./CLEANUP_INSTRUCTIONS.md)**

```bash
npm run cleanup-orphaned
```

> ⚠️ Requer Firebase Blaze Plan

---

## 🏆 Estrutura da Pasta docs/

```
docs/
├── INDEX.md                       ← Você está aqui! 👋
├── ARCHITECTURE.md                ← Visão geral da arquitetura
├── FIREBASE_SETUP.md              ← Setup inicial
├── FIREBASE_MIGRATION_GUIDE.md    ← **Migração de conta** 🆕
├── MIGRATION_PLAN.md              ← Migração para Supabase
├── SUPABASE_DATABASE_SCHEMA.md    ← Estrutura do banco
└── CLEANUP_INSTRUCTIONS.md        ← Limpeza de Storage
```

---

## 💡 Casos de Uso Comuns

### "Quero entender como a app funciona"
→ [ARCHITECTURE.md](./ARCHITECTURE.md) - Seção "Fluxo de Dados"

### "Como faço para fazer upload de um documento?"
→ [ARCHITECTURE.md](./ARCHITECTURE.md) - Seção "Análise de Caso: Upload"

### "Preciso configurar Firebase do zero"
→ [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

### "Vou transferir o Firebase para meu colega"
→ [FIREBASE_MIGRATION_GUIDE.md](./FIREBASE_MIGRATION_GUIDE.md) **← Start here! 🚀**

### "Como faço para remover a conta do localStorage?"
→ [MIGRATION_PLAN.md](./MIGRATION_PLAN.md)

### "Meu Storage tem muitos arquivos órfãos"
→ [CLEANUP_INSTRUCTIONS.md](./CLEANUP_INSTRUCTIONS.md)

---

## 📊 Fluxo de Dados Simplificado

```
Admin Panel
    ↓
useDocuments Hook
    ↓
documentService
    ↓
Firebase (Firestore + Storage)
```

Detalhes em: [ARCHITECTURE.md](./ARCHITECTURE.md#-fluxo-de-dados)

---

## 🔐 Segurança

- **Firestore Rules:** Apenas admins podem deletar, públicos podem ler
- **Storage:** Público para leitura, admin para escrita
- **Authentication:** Email/senha com custom claims (admin role)

Ver: [FIREBASE_SETUP.md](./FIREBASE_SETUP.md#-passo-7-configurar-security-rules-crítico)

---

## 🎯 Próximos Passos

- [ ] Ler [ARCHITECTURE.md](./ARCHITECTURE.md)
- [ ] Configurar Firebase com [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
- [ ] (Se necessário) Migrar conta com [FIREBASE_MIGRATION_GUIDE.md](./FIREBASE_MIGRATION_GUIDE.md)
- [ ] Testar upload/edit/delete no admin panel
- [ ] (Opcional) Planejar migração para Supabase com [MIGRATION_PLAN.md](./MIGRATION_PLAN.md)

---

## 🆘 Precisa de Ajuda?

1. **Erro de compilação?** → Veja `tsconfig.json` e `.env`
2. **Erro de autenticação?** → Veja [FIREBASE_SETUP.md](./FIREBASE_SETUP.md#-passo-8-criar-usuário-administrador)
3. **Erro de CORS?** → Normal para Storage DELETE, veja [CLEANUP_INSTRUCTIONS.md](./CLEANUP_INSTRUCTIONS.md)
4. **Performance lenta?** → Adicione indexes no Firestore

---

## 📞 Contato

Para dúvidas sobre a documentação, veja o README principal: [../README.md](../README.md)

---

**Última atualização:** 16 de abril de 2026  
**Mantido por:** Equipe Educandário
