# 🚀 Guia Completo: Migração do Firebase para Outra Conta

**Versão:** 1.0  
**Data:** 16 de abril de 2026  
**Tempo Estimado:** 60-90 minutos  
**Dificuldade:** Média

---

## 📋 Sumário

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Fase 1: Criar Novo Projeto Firebase](#fase-1-criar-novo-projeto-firebase)
4. [Fase 2: Exportar Dados da Conta Atual](#fase-2-exportar-dados-da-conta-atual)
5. [Fase 3: Configurar o Novo Projeto](#fase-3-configurar-o-novo-projeto)
6. [Fase 4: Importar Dados](#fase-4-importar-dados)
7. [Fase 5: Atualizar Código da Aplicação](#fase-5-atualizar-código-da-aplicação)
8. [Fase 6: Testar Funcionalidades](#fase-6-testar-funcionalidades)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O Firebase **não permite transferência direta** de projetos entre contas. A solução é:

1. ✅ Criar novo projeto na conta destino
2. ✅ Exportar dados (Firestore metadata + Storage files)
3. ✅ Importar dados no novo projeto
4. ✅ Atualizar credenciais no código
5. ✅ Testar tudo funciona

**O que será transferido:**
- ✅ Firestore collections (`documents`, `audit_logs`)
- ✅ Arquivos PDF do Storage
- ✅ Usuários da Authentication
- ✅ Regras de segurança (Firestore + Storage)

**O que NÃO será transferido:**
- ❌ Analytics histórico
- ❌ Logs do Console
- ❌ Configurações de billing

---

## 📦 Pré-requisitos

Antes de começar, você precisa de:

- [ ] **Acesso a conta atual** - Onde o projeto está configurado
- [ ] **Acesso a nova conta** - Onde o projeto será criado
- [ ] **Node.js 18+** - Para rodar scripts
- [ ] **Firebase CLI** - `npm install -g firebase-tools`
- [ ] **Git** - Para controle de versão
- [ ] **Google Cloud SDK** (opcional) - Para backup via CLI

**Instalar dependências:**

```bash
# Instalar Firebase CLI globalmente
npm install -g firebase-tools

# Verificar versão
firebase --version
```

---

## 🔥 Fase 1: Criar Novo Projeto Firebase

### Passo 1.1: Acessar Firebase Console com Nova Conta

1. Vá para [Firebase Console](https://console.firebase.google.com/)
2. Faça login com **a conta destino** (a pessoa que receberá o projeto)
3. Nos EUA, a pessoa receberá um link de convite e aceitará

### Passo 1.2: Criar Novo Projeto

1. Clique em **"Adicionar projeto"**
2. **Nome do projeto:** `educandario-site-novo` (ou `educandario-site` se remover o antigo)
3. **Localização:** Brazil (Google Cloud) - Região: `southamerica-east1`
4. **Analytics:** Desabilitar por enquanto
5. Clique em **"Criar projeto"**

> ⏳ Aguarde 2-3 minutos até o projeto ser criado...

### Passo 1.3: Registrar Aplicação Web

1. Na dashboard, clique no ícone **`</>`** (Web)
2. **App nickname:** `educandario-web`
3. Clique em **"Registrar app"**
4. **Copie as credenciais mostradas:**

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDxxx...",
  authDomain: "educandario-site-novo.firebaseapp.com",
  projectId: "educandario-site-novo",
  storageBucket: "educandario-site-novo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456",
  measurementId: "G-ABCDEF1234"
};
```

5. Salve estas credenciais em um bloco de notas (vamos usar depois)

---

## 💾 Fase 2: Exportar Dados da Conta Atual

### Passo 2.1: Exportar Firestore (via Console)

**Método 1: Via Firebase Console (Recomendado)**

1. Acesse [Firebase Console](https://console.firebase.google.com/) com **conta atual**
2. Vá para **Firestore Database** → **Dados**
3. No menu ⋮ (3 pontos), clique em **"Exportar coleção"**
4. Para cada coleção, exporte:
   - `documents` → Salve como `documents-export.json`
   - `audit_logs` → Salve como `audit_logs-export.json`

> 💡 **Alternativa 2:** Se o Console não permitir, use Firebase CLI (ver seção Troubleshooting)

### Passo 2.2: Exportar Arquivo de Credenciais Admin (serviceAccountKey.json)

1. Na Firebase Console (conta atual), vá para **Configurações do Projeto** (ícone ⚙️)
2. Clique na aba **"Contas de Serviço"**
3. Clique em **"Gerar uma chave privada"**
4. Um arquivo JSON será baixado
5. Renomeie para `current-serviceAccountKey.json` e guarde

**⚠️ SEGURANÇA:** Este arquivo contém credenciais sensíveis. Não compartilhe!

### Passo 2.3: Verificar Estrutura das Coleções

Antes de exportar, verifique a estrutura esperada:

```
Firestore Collections:
├── documents (collection)
│   ├── doc-001
│   │   ├── name (string)
│   │   ├── category (string)
│   │   ├── year (number)
│   │   ├── tags (array)
│   │   ├── public (boolean)
│   │   ├── uploadedAt (timestamp)
│   │   ├── createdBy (string)
│   │   └── fileUrl (string)
│   └── ...
└── audit_logs (collection)
    ├── log-001
    │   ├── action (string): "upload", "update", "delete"
    │   ├── documentId (string)
    │   ├── userId (string)
    │   ├── timestamp (timestamp)
    │   └── details (map)
    └── ...
```

### Passo 2.4: Exportar Storage (Files)

**Opção A: Via Firebase Console**

1. Vá para **Storage** no Firebase Console
2. Selecione todos os arquivos em `/documents`
3. Clique em Download
4. Salve com estrutura preservada

**Opção B: Via Firebase CLI (Recomendado)**

```bash
# Login (se necessário)
firebase login

# Listar arquivos
firebase storage:list gs://educandario-site.appspot.com/documents/

# Fazer download em lote (via script Node.js - ver Fase 2.5)
```

### Passo 2.5: Script para Exportar Storage (Node.js)

Crie um arquivo `scripts/export-storage.js`:

```javascript
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// ⚠️ Usar o serviceAccountKey.json da conta ATUAL
const serviceAccount = require('../current-serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'educandario-site.appspot.com', // Projeto ATUAL
});

const bucket = admin.storage().bucket();
const downloadDir = './storage-export/documents';

if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

async function exportStorage() {
  console.log('📥 Iniciando exportação do Storage...\n');
  
  const [files] = await bucket.getFiles({ prefix: 'documents/' });
  console.log(`✓ Total de ${files.length} arquivo(s) encontrado(s)\n`);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filename = path.basename(file.name);
    const filepath = path.join(downloadDir, filename);

    console.log(`[${i + 1}/${files.length}] ⬇️  Baixando: ${filename}`);
    
    await file.download({ destination: filepath });
    console.log(`✓ Salvo em: ${filepath}\n`);
  }

  console.log('✨ Exportação concluída!');
  console.log(`📁 Arquivo(s) salvos em: ${downloadDir}`);
}

exportStorage().catch((error) => {
  console.error('❌ Erro na exportação:', error);
  process.exit(1);
});
```

**Para rodar:**

```bash
node scripts/export-storage.js
```

---

## 🔧 Fase 3: Configurar o Novo Projeto

### Passo 3.1: Habilitar Firestore Database

1. Faça login no [Firebase Console](https://console.firebase.google.com/)
2. Selecione o **novo projeto**
3. Vá para **Firestore Database**
4. Clique em **"Criar banco de dados"**
5. **Modo:** "Iniciar no modo de segurança"
6. **Localização:** `southamerica-east1` (São Paulo)
7. Clique em **"Criar"**

### Passo 3.2: Habilitar Firebase Storage

1. Vá para **Storage**
2. Clique em **"Começar"**
3. Clique **"Próximo"** (são Paulo ja setado)
4. Clique em **"Concluído"**

### Passo 3.3: Configurar Authentication

1. Vá para **Authentication**
2. Clique em **"Começar"**
3. Selecione **"Email/Senha"**
4. Habilite e clique em **"Salvar"**

### Passo 3.4: Obter Service Account Key (Novo Projeto)

1. Vá para **Configurações do Projeto** (⚙️)
2. Clique em **"Contas de Serviço"**
3. Clique em **"Gerar uma chave privada"**
4. Renomeie para `new-serviceAccountKey.json`

---

## 📤 Fase 4: Importar Dados

### Passo 4.1: Importar Firestore Collections

**Via Firebase Console (Manual):**

1. No novo projeto, vá para **Firestore Database** → **Dados**
2. Clique em **"Começar coleção"**
3. Crie uma coleção chamada `documents`
4. Importe os documentos do arquivo `documents-export.json`
5. Repita para `audit_logs`

**Via Firebase CLI (Automático):**

```bash
# Instalar extensão de importação
firebase extensions:install firebase/firestore-bulk-delete

# Ou usar script de importação
node scripts/import-firestore.js
```

### Passo 4.2: Script para Importar Firestore (Node.js)

Crie `scripts/import-firestore.js`:

```javascript
const admin = require('firebase-admin');
const fs = require('fs');

// ⚠️ Usar o NEW serviceAccountKey.json
const serviceAccount = require('../new-serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'educandario-site-novo', // Projeto NOVO
});

const db = admin.firestore();

async function importFirestore() {
  console.log('📤 Iniciando importação do Firestore...\n');

  // Importar coleção 'documents'
  console.log('▶ Importando coleção: documents');
  const documentsData = JSON.parse(fs.readFileSync('./documents-export.json', 'utf8'));
  
  for (const docId in documentsData) {
    await db.collection('documents').doc(docId).set(documentsData[docId]);
    console.log(`  ✓ Documento importado: ${docId}`);
  }
  
  console.log('\n▶ Importando coleção: audit_logs');
  const auditData = JSON.parse(fs.readFileSync('./audit_logs-export.json', 'utf8'));
  
  for (const docId in auditData) {
    await db.collection('audit_logs').doc(docId).set(auditData[docId]);
    console.log(`  ✓ Log importado: ${docId}`);
  }

  console.log('\n✨ Importação concluída!');
}

importFirestore().catch((error) => {
  console.error('❌ Erro na importação:', error);
  process.exit(1);
});
```

**Para rodar:**

```bash
node scripts/import-firestore.js
```

### Passo 4.3: Importar Arquivos do Storage

```bash
# Criar script de upload
node scripts/upload-storage.js
```

Crie `scripts/upload-storage.js`:

```javascript
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// ⚠️ Usar o NEW serviceAccountKey.json
const serviceAccount = require('../new-serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'educandario-site-novo.appspot.com', // Novo bucket
});

const bucket = admin.storage().bucket();
const uploadDir = './storage-export/documents';

async function uploadStorage() {
  console.log('📤 Iniciando upload para Storage...\n');

  const files = fs.readdirSync(uploadDir);
  console.log(`✓ Total de ${files.length} arquivo(s)\n`);

  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    const filepath = path.join(uploadDir, filename);

    console.log(`[${i + 1}/${files.length}] ⬆️  Enviando: ${filename}`);
    
    await bucket.upload(filepath, {
      destination: `documents/${filename}`,
      public: false,
    });
    
    console.log(`✓ Arquivo enviado\n`);
  }

  console.log('✨ Upload concluído!');
}

uploadStorage().catch((error) => {
  console.error('❌ Erro no upload:', error);
  process.exit(1);
});
```

### Passo 4.4: Importar Usuários da Authentication (Manual)

Infelizmente, o Firebase **não permite exportar/importar senhas de usuários**. Duas opções:

**Opção A: Recriar usuários manualmente**
- Crie cada usuário administrativo novamente
- (Mais seguro, pois força reset de senha)

**Opção B: Enviar link de reset de senha**
```bash
# No novo projeto
firebase auth:create-user --email admin@educandario.com.br --password temp123
# Depois pedir para resetar senha via email
```

---

## 💻 Fase 5: Atualizar Código da Aplicação

### Passo 5.1: Atualizar Arquivo `.env`

**Antes (conta atual):**
```env
VITE_FIREBASE_API_KEY=AIzaSyDxxx... (ANTIGO)
VITE_FIREBASE_AUTH_DOMAIN=educandario-site.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=educandario-site
VITE_FIREBASE_STORAGE_BUCKET=educandario-site.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123xyz
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXX
```

**Depois (novo projeto):**
```env
VITE_FIREBASE_API_KEY=AIzaSyDyyy... (NOVO)
VITE_FIREBASE_AUTH_DOMAIN=educandario-site-novo.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=educandario-site-novo
VITE_FIREBASE_STORAGE_BUCKET=educandario-site-novo.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=987654321
VITE_FIREBASE_APP_ID=1:987654321:web:def456xyz789
VITE_FIREBASE_MEASUREMENT_ID=G-YYYYY
```

**Passo a passo:**

1. Abra o arquivo `.env` na raiz do projeto
2. Substitua TODOS os valores com os credenciais do NOVO projeto (copiados na Fase 1.3)
3. Salve o arquivo

### Passo 5.2: Atualizar `.env.example` (para referência)

```env
# Firebase Configuration (NOVO PROJETO)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=educandario-site-novo.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=educandario-site-novo
VITE_FIREBASE_STORAGE_BUCKET=educandario-site-novo.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=987654321
VITE_FIREBASE_APP_ID=1:987654321:web:def456789xyz123
VITE_FIREBASE_MEASUREMENT_ID=G-YYYYY

VITE_ENV=development
VITE_USE_FIREBASE_EMULATORS=false
```

### Passo 5.3: Atualizar Regras de Segurança

**Firestore Rules:**

1. No novo projeto, vá para **Firestore Database** → **Regras**
2. Copie as regras do projeto antigo (vá lá e copie)
3. Você pode encontrar em: [Referência de Regras](./FIREBASE_SECURITY_RULES.md)

**Exemplo de regras recomendadas:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Permitir leitura de documentos públicos
    match /documents/{document=**} {
      allow read: if resource.data.public == true;
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }

    // Logs apenas para admins
    match /audit_logs/{document=**} {
      allow read: if request.auth != null && request.auth.token.admin == true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

**Storage Rules:**

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Permitir leitura de PDFs públicos
    match /documents/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

---

## ✅ Fase 6: Testar Funcionalidades

### Passo 6.1: Limpar Cache e Reiniciar Dev Server

```bash
# Limpar node_modules e cache
rm -rf node_modules package-lock.json
npm install

# Limpar cache do navegador
# Chrome: DevTools → Network → Disable cache (ou limpar manualmente)

# Reiniciar server
npm run dev
```

### Passo 6.2: Verificar Conectividade

**No navegador, abra DevTools (F12) e teste:**

```javascript
// No console do navegador
console.log(window.firebase.app().options)
// Deve mostrar os credenciais do NOVO projeto
```

### Passo 6.3: Testar Funcionalidades CRUD

**Testes manuais:**

1. **Upload de documento:**
   - [ ] Vá para Admin → Transparency
   - [ ] Clique em "Upload"
   - [ ] Selecione um PDF local
   - [ ] Verifique se aparece na lista
   - [ ] Verifique se aparece no Firebase Storage

2. **Editar documento:**
   - [ ] Clique no botão "Edit" de um documento
   - [ ] Mude o nome e outros campos
   - [ ] Salve e verifique se foi atualizado

3. **Deletar documento:**
   - [ ] Clique no botão "Delete"
   - [ ] Confirme a deleção
   - [ ] Verifique se foi removido da lista
   - [ ] Verifique se o metadata foi removido do Firestore

4. **Visualizar documentos públicos:**
   - [ ] Vá para página de Transparency (público)
   - [ ] Verifique se documentos com `public: true` aparecem

5. **Logs de auditoria:**
   - [ ] Faça algumaoperação (upload/edit/delete)
   - [ ] Vá para Admin → Audit Logs (se existir)
   - [ ] Verifique se a ação foi registrada

### Passo 6.4: Rodar Testes Automatizados (se houver)

```bash
npm run test
```

---

## 🐛 Troubleshooting

### Erro: "Permission denied" ao salvar no Firestore

**Causa:** Regras de segurança muito restritivas

**Solução:**

1. Vá para **Firestore Database** → **Regras**
2. Verifique se você está logado como admin
3. Temporariamente, use regras permissivas para teste:

```javascript
match /{document=**} {
  allow read, write: if true; // ⚠️ Apenas para teste!
}
```

depois volte para regras seguras.

### Erro: "Storage bucket not found"

**Causa:** Storage ainda não foi inicializado

**Solução:**

1. Vá para **Storage** no Firebase Console
2. Clique em **"Começar"** se não tiver inicializado
3. Aguarde 2-3 minutos

### Erro: "Cannot find documents in Firestore"

**Causa:** Importação não funcionou corretamente

**Solução:**

1. Verifique se as collections foram criadas:
   - Firebase Console → Firestore → Dados
   - Procure por `documents` e `audit_logs`

2. Se não estão lá, importe manualmente via CLI:

```bash
# Login com nova conta
firebase login

# Copiar collections (usando importação manual)
firebase firestore:import backup/documents-export.json
```

### Erro: "User not authenticated"

**Causa:** Usuário foi criado na conta antiga, não existe no novo projeto

**Solução:**

1. Vá para **Authentication** no novo projeto
2. Crie o usuário manualmente:
   - Email: admin@educandario.com.br
   - Senha: (temporária)
3. Envie link de reset de senha para o usuário

### Erro: "CORS error on Storage"

**Causa:** Storage ainda não foi configurado com CORS

**Solução:** Se quiser permitir acesso direto do navegador (não recomendado):

```bash
# Criar arquivo cors.json
cat > cors.json << EOF
[
  {
    "origin": ["http://localhost:5175", "https://educandario.com.br"],
    "method": ["GET", "PUT", "POST"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
EOF

# Aplicar CORS ao bucket
gsutil cors set cors.json gs://educandario-site-novo.appspot.com
```

---

## 📋 Checklist Final

Antes de considerar a migração completa:

- [ ] Novo projeto criado no Firebase
- [ ] Firestore Database inicializado
- [ ] Storage inicializado
- [ ] Authentication configurado
- [ ] Dados exportados da conta atual
- [ ] Dados importados no novo projeto
- [ ] Arquivo `.env` atualizado
- [ ] Regras de segurança configuradas
- [ ] Dev server reiniciado
- [ ] Upload de documento ✅
- [ ] Edição de documento ✅
- [ ] Deleção de documento ✅
- [ ] Visualização de documentos públicos ✅
- [ ] Logs aparecem no Firestore ✅
- [ ] Nenhum erro no console do navegador ✅

---

## 🎉 Conclusão

Se todos os testes passaram, migração concluída com sucesso! 

**Próximos passos:**

1. **Deploy:** Faça deploy da aplicação com novas credenciais
2. **Comunicar:** Avise aos usuários sobre a mudança
3. **Monitorar:** Fique atento aos primeiros dias de produção
4. **Remover projeto antigo:** Depois de confirmar que tudo funciona, remova o projeto antigo

---

## 📞 Suporte

Se encontrar problemas:

1. Veja a seção [Troubleshooting](#troubleshooting)
2. Verifique [Documentação Firebase](https://firebase.google.com/docs)
3. Cheque os logs em **Firebase Console** → **Regras do Firestore** → **Logs**

**Boa sorte com a migração! 🚀**
