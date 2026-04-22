# Arquitetura de Autenticação - Educandário N. S. Aparecida

## 📋 Visão Geral

O sistema de autenticação utiliza **Firebase Authentication** com uma arquitetura centralizada baseada em **AuthContext** para garantir sincronização de estado entre todas as rotas e abas do navegador.

---

## 🏗️ Arquitetura

### Componentes Principais

```
src/contexts/AuthContext.tsx
│
├── AuthProvider (Componente)
│   └── Cria UM ÚNICO listener global de Firebase
│       └── Persiste durante toda a vida da aplicação
│
├── useAuth() (Hook)
│   └── Retorna estado de autenticação centralizado
│       └── Usado por: componentes, rotas, etc
│
└── Listener onAuthStateChanged
    └── Sincroniza estado entre abas automaticamente
```

### Fluxo de Dados

```
Firebase Auth (IndexedDB)
         ↓
AuthProvider (Listener Global)
         ↓
Auth Context State
         ↓
useAuth() Hook
         ↓
Componentes / Rotas
```

---

## ✨ Recursos Implementados

### 1. **Autenticação com Custom Claims**

- ✅ Login com email/senha
- ✅ Custom claim `admin: true` para admins
- ✅ Role detecção automática (`role: 'admin' | 'user'`)
- ✅ Logout automático após alteração de senha (3 segundos)

### 2. **Persistência de Sessão**

- ✅ `browserLocalPersistence` (IndexedDB/localStorage)
- ✅ Sessão mantida ao recarregar página (F5)
- ✅ Sincronização entre abas do navegador
- ✅ Sem logout ao navegar entre rotas

### 3. **Proteção de Rotas**

```typescript
<ProtectedRoute>
  <DashboardLayout />  // Só admins podem acessar
</ProtectedRoute>
```

### 4. **Tratamento de Erros**

- ✅ Error handlers para Firestore (índices faltantes)
- ✅ Timeout cleanup para logout automático
- ✅ Try/catch em listeners

---

## 🔑 Como Definir um Admin

### Método 1: Firebase Console (Recomendado) ⭐

1. Abra <https://console.firebase.google.com>
2. Selecione **educandario-site**
3. Vá para **Authentication** → **Users**
4. Encontre o usuário desejado
5. Clique nos 3 pontinhos (⋮) → **Edit user**
6. Role até **Custom claims** (JSON)
7. Cole:

```json
{
  "admin": true
}
```

8. Clique **Save**
9. ✅ Pronto! O usuário agora é admin

### Método 2: Script Node.js (Para múltiplos usuários)

#### Passo 1: Obter Chave de Serviço

1. <https://console.firebase.google.com> → **educandario-site** → ⚙️ **Settings**
2. Aba **Service Accounts** → **Generate New Private Key**
3. Renomeie para `firebase-key.json`
4. Coloque na **raiz do projeto** (pasta raiz, onde está `package.json`)

#### Passo 2: Executar Script

```bash
node scripts/set-admin-simple.js
```

**Saída esperada:**

```
🔑 Iniciando definição de custom claims...
📧 Processando: admin@educandarionsa.com.br
   ✓ UID: b5ROBsKxfXSdjIVuS88GWYXA8on2
   ✓ Admin claim definido
   ✅ Sucesso!
```

#### Adicionar Múltiplos Admins

Edite `scripts/set-admin-simple.js`:

```javascript
const ADMIN_EMAILS = [
  'admin@educandarionsa.com.br',
  'outro@email.com',
  'mais-um@email.com'
];
```

---

## ✅ Verificar se Funcionou

1. **Logout** (se estiver logado)
2. **Faça login** com o email do novo admin
3. Abra **Console do Navegador** (F12 → Console)
4. Procure por: `🔐 [DEBUG] isAdmin: true`

Se aparecer `isAdmin: true` → ✅ Funcionou!

---

## 🔧 Estrutura de Arquivos

```
src/
├── contexts/
│   └── AuthContext.tsx          ← Centraliza autenticação
│
├── hooks/
│   └── useAuth.ts               ← Re-exporta do context
│
├── services/firebase/
│   ├── config.ts                ← Inicializa Firebase
│   ├── auth.ts                  ← Lógica de auth
│   └── notifications.ts         ← Listeners com error handling
│
├── components/
│   └── ProtectedRoute.tsx        ← Protege rotas de admin
│
└── main.tsx                      ← AuthProvider na raiz
```

---

## 🐛 Troubleshooting

### ❌ Erro: "useAuth deve ser usado dentro de AuthProvider"

**Causa:** Um componente está tentando usar `useAuth()` fora de `<AuthProvider>`

**Solução:** Verifique `src/main.tsx` - `AuthProvider` deve envolver `<RouterProvider />`

### ❌ Erro: "Não consigo acessar /dashboard"

**Causa:** Usuário não tem custom claim `admin: true`

**Solução:** Siga os passos de "Como Definir um Admin" acima

### ❌ F5 faz logout

**Causa:** Múltiplos listeners conflitando (problema resolvido no AuthContext)

**Solução:** Verifique se está usando a versão mais recente do contexto

### ❌ "isAdmin: false" mesmo após definir claim

**Causa:** Token em cache não foi renovado

**Solução:** 
1. Logout completo
2. Limpar cache do navegador (Ctrl+Shift+Delete)
3. Fechar e reabrir abas
4. Fazer login novamente

---

## 🎯 Fluxo de Login

```
1. Usuário insere email/senha
   ↓
2. Firebase valida credenciais
   ↓
3. Firebase carrega custom claims do token
   ↓
4. AuthContext recebe onAuthStateChanged
   ↓
5. Estado atualizado com role ('admin' ou 'user')
   ↓
6. ProtectedRoute verifica role
   ↓
7. Se admin → renderiza Dashboard
   Se user → redireciona para home
```

---

## 🔐 Custom Claims

### O que são?

Custom claims são dados adicionais que Firebase armazena no token JWT do usuário.

### Exemplo de Token com Admin Claim

```json
{
  "admin": true,
  "email": "admin@educandarionsa.com.br",
  "email_verified": false,
  "auth_time": 1776414487,
  "user_id": "b5ROBsKxfXSdjIVuS88GWYXA8on2",
  ...
}
```

### Acessar no Código

```typescript
const { user } = useAuth();
console.log(user.role); // 'admin' ou 'user'
```

---

## 📚 Recursos Relacionados

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Custom Claims Documentation](https://firebase.google.com/docs/auth/admin-sdk-docs)
- [React Context API](https://react.dev/reference/react/useContext)

---

## 💡 Melhores Práticas

1. **Sempre use AuthContext centralizado** - Não crie múltiplos listeners
2. **Logout do admin = Reset completo** - Limpe todo o estado
3. **Custom claims em token** - Não em Firestore (mais seguro)
4. **Teste cross-tab** - F5 em abas diferentes para validar
5. **Log dos eventos** - Use debug logs para troubleshooting

---

## ✅ Checklist de Validação

- [ ] AuthContext importado em `main.tsx`
- [ ] `useAuth()` funcionando em componentes
- [ ] Custom claim `admin: true` definido para admins
- [ ] F5 mantém sessão
- [ ] Logout funciona corretamente
- [ ] Admin consegue acessar `/dashboard`
- [ ] User é redirecionado para home
- [ ] Sincronização entre abas funciona

---

**Última atualização:** 17 de Abril de 2026  
**Versão:** 2.0 (AuthContext Centralizado)
