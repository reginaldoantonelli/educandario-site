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
    match /documents/{documentId} {
      allow read: if request.auth != null && 
                     request.auth.token.admin == true;
      allow write: if request.auth != null && 
                      request.auth.token.admin == true;
    }
    
    match /audit_logs/{logId} {
      allow read: if request.auth != null && 
                     request.auth.token.admin == true;
      allow write: if request.auth != null && 
                      request.auth.token.admin == true;
    }

    match /{document=**} {
      allow read, write: if false; // Deny by default
    }
  }
}
```

1. Clique em **"Publicar"**

### Storage Rules

1. Vá para **Storage** → **Regras**
2. Substitua pelo código abaixo:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // PDFs - apenas leitura para URLs assinadas
    match /pdfs/{documentId} {
      allow read: if request.auth != null && 
                     request.auth.token.admin == true;
      allow write: if request.auth != null && 
                      request.auth.token.admin == true;
    }
    
    // Deny everything else
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

1. Clique em **"Publicar"**

---

## ✅ Passo 8: Testar Conexão

1. Inicie o servidor:

```bash
npm run dev
```

1. Abra o navegador e verifique o console (F12)
2. Deve aparecer: `✅ Firebase inicializado: educandario-site`

3. Se houver erro, verifique:
   - `.env` foi preenchido corretamente
   - Credenciais do Firebase estão certas
   - Firestore e Storage foram criados

---

## 🚀 Próximos Passos

- Implementar autenticação (Auth Service)
- Criar hooks para documentos
- Testar upload/download com segurança

---

## 🐛 Troubleshooting

| Erro | Solução |
|------|---------|
| `MISSING_OR_INSUFFICIENT_PERMISSIONS` | Verificar Security Rules no Firebase Console |
| `undefined is not an object VITE_FIREBASE_...` | Recarregar app (`npm run dev`) após editar `.env` |
| `Blocked by CORS` | Adicionar domínio ao Firebase Console → Configurações |

---

## 📚 Documentação Oficial

- [Firebase Setup](https://firebase.google.com/docs/web/setup)
- [Firestore Security](https://firebase.google.com/docs/firestore/security)
- [Storage Security](https://firebase.google.com/docs/storage/security)
