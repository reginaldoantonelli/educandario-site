# 🔥 Setup Firebase - Guia Completo

## 📋 Pré-requisitos

- Conta Google
- Projeto Educandário em Firebase Console
- Node.js 18+

---

## 🚀 Passo 1: Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em **"Adicionar projeto"**
3. Nome do projeto: `educandario-site`
4. Desative Google Analytics (não necessário agora)
5. Clique em **"Criar projeto"**

---

## 🛠️ Passo 2: Registrar App Web

1. Na dashboard, clique no ícone **`</>`** (Web)
2. App nickname: `educandario-web`
3. Clique em **"Registrar app"**
4. Copie as credenciais mostradas

---

## 📝 Passo 3: Configurar Variáveis de Ambiente

1. Crie arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

1. Preencha com as credenciais do Firebase:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyDxxx...
VITE_FIREBASE_AUTH_DOMAIN=educandario-site.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=educandario-site
VITE_FIREBASE_STORAGE_BUCKET=educandario-site.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123xyz
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXX

VITE_ENV=development
VITE_USE_FIREBASE_EMULATORS=false  # true para desenvolvimento local
```

> ⚠️ **IMPORTANTE**: Adicionar `.env` ao `.gitignore` para não vazar credenciais!

---

## 🔐 Passo 4: Configurar Firestore Database

1. Na console Firebase, vá para **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Selecione **"Modo de produção"**
4. Localização: **"southamerica-east1"** (São Paulo)
5. Clique em **"Ativar"**

---

## 🗄️ Passo 5: Configurar Firebase Storage (para PDFs)

1. Na console Firebase, vá para **"Storage"**
2. Clique em **"Começar"**
3. Clique **"Próximo"** (regras padrão)
4. Localização: **"southamerica-east1"** (São Paulo)
5. Clique em **"Concluído"**

---

## 🔓 Passo 6: Configurar Autenticação

1. Na console Firebase, vá para **"Authentication"**
2. Clique em **"Começar"**
3. Selecione **"Email/Senha"** como método de entrada
4. Ative a opção
5. Clique em **"Salvar"**

---

## 🛡️ Passo 7: Configurar Security Rules (CRÍTICO!)

### Firestore Rules

1. Vá para **Firestore Database** → **Regras**
2. Substitua pelo código abaixo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Apenas admins autenticados podem acessar
    match /documents/{docId} {
      allow read: if resource.data.public == true;
      allow read, write, delete: if request.auth != null && 
                                    request.auth.token.admin == true;
    }

    // Audit logs apenas para admins
    match /audit_logs/{logId} {
      allow read: if request.auth != null && 
                    request.auth.token.admin == true;
      allow write: if request.auth != null && 
                      request.auth.token.admin == true;
    }

    // Deny any other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Clique em **"Publicar"**

### Firebase Storage Rules

1. Vá para **Storage** → **Regras**
2. Substitua pelo código abaixo:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Qualquer um pode ler (público)
    match /documents/{allPaths=**} {
      allow read: if true;
      
      // Apenas admins podem escrever/deletar
      allow write, delete: if request.auth != null && 
                            request.auth.token.admin == true;
    }

    // Deny any other access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

3. Clique em **"Publicar"**

---

## 👤 Passo 8: Criar Usuário Administrador

1. Na Console, vá para **Authentication** → **Usuários**
2. Clique em **"Adicionar usuário"**
3. Email: `admin@educandario.com.br`
4. Senha: (gere uma senha segura temporária)
5. Clique em **"Adicionar usuário"**

---

## 🎯 Passo 9: Definir Claims de Admin (Custom Claims)

Este passo é **CRÍTICO** para que o usuário tenha permissão de admin.

### Opção A: Via Firebase CLI

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Definir claims do usuário
firebase auth:set-custom-claims admin@educandario.com.br --admin=true
```

### Opção B: Via Script Node.js

Crie arquivo `scripts/set-admin-claims.js`:

```javascript
const admin = require('firebase-admin');

// Importar serviceAccountKey.json
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const email = 'admin@educandario.com.br';

admin.auth().getUserByEmail(email)
  .then(user => {
    return admin.auth().setCustomUserClaims(user.uid, { admin: true });
  })
  .then(() => {
    console.log(`✓ Claims definidos para: ${email}`);
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Erro:', error);
    process.exit(1);
  });
```

**Para rodar:**

```bash
node scripts/set-admin-claims.js
```

---

## 🔑 Passo 10: Obter Service Account Key

1. Vá para **Configurações do Projeto** (ícone ⚙️ no topo)
2. Clique na aba **"Contas de Serviço"**
3. Clique em **"Gerar uma chave privada"**
4. Um arquivo JSON será baixado
5. Renomeie para `serviceAccountKey.json` e coloque **na raiz do projeto**

**⚠️ SEGURANÇA:** Adicione ao `.gitignore`:

```bash
echo "serviceAccountKey.json" >> .gitignore
```

---

## ✅ Verificação Final

Para confirmar que tudo está funcionando:

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Abra no navegador: `http://localhost:5175`

1. Vá para **Login**
2. Faça login com: `admin@educandario.com.br` / (sua senha)
3. Vá para **Admin Dashboard**
4. Clique em **Upload** e envie um PDF

Se funcionar, Firebase está configurado corretamente! ✅

---

## 📚 Próximas Leituras

- [Documentação Firebase](https://firebase.google.com/docs)
- [Guia de Segurança Firestore](./FIRESTORE_SECURITY.md)
- [Migração do Firebase](./FIREBASE_MIGRATION_GUIDE.md)
