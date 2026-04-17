# Como Definir Custom Claims (Admin) no Firebase

Existem 3 formas de fazer isso. Escolha uma:

---

## **Forma 1: Firebase Console (Mais Fácil) ⭐**

1. Abra <https://console.firebase.google.com>
2. Selecione o projeto **educandario-site**
3. Vá para **Authentication** → **Users**
4. Encontre o usuário **<admin@educandarionsa.com.br>**
5. Clique nos 3 pontinhos (⋮) → **Edit user**
6. Scroll até **Custom claims** (JSON)
7. Cole isto:

```json
{
  "admin": true
}
```

1. Clique **Save**
2. ✅ Pronto! O usuário agora é admin

---

## **Forma 2: Script Node.js (Recomendado para Automatização)**

### Passo 1: Obter a Chave de Serviço do Firebase

1. Vá a <https://console.firebase.google.com>
2. Selecione **educandario-site**
3. Clique ⚙️ **Project Settings** (canto inferior esquerdo)
4. Vá para aba **Service Accounts**
5. Clique **Generate New Private Key**
6. Um arquivo JSON será baixado
7. Renomeie para `firebase-key.json`
8. Coloque na **raiz do projeto** (mesma pasta que `package.json`)

### Passo 2: Instalar Dependência

```bash
npm install firebase-admin
```

### Passo 3: Executar o Script

```bash
node scripts/set-admin-simple.js
```

#### Saída esperada

```
🔑 Iniciando definição de custom claims...

📧 Processando: admin@educandarionsa.com.br
   ✓ UID: b5ROBsKxfXSdjIVuS88GWYXA8on2
   ✓ Admin claim definido
   ✅ Sucesso!

✅ Processo concluído!
⏱️  O usuário precisará fazer login novamente para refletir as mudanças
```

---

## **Forma 3: Firebase CLI (Para DevOps)**

```bash
# Fazer login
firebase login

# Definir claim via CLI
firebase auth:set-custom-claims admin@educandarionsa.com.br --admin=true
```

---

## **Verificar se Funcionou**

Após definir o claim:

1. **Logout** do usuário
2. **Faça login novamente**
3. Abra o **Console do Navegador** (F12)
4. Procure por: `🔐 [DEBUG] isAdmin: true`

Se aparecer `isAdmin: true`, é porque funcionou! ✅

---

## **Adicionar Múltiplos Admins**

Edite o arquivo `scripts/set-admin-simple.js`:

```javascript
const ADMIN_EMAILS = [
  'admin@educandarionsa.com.br',
  'outro@email.com',  // ← Adicione aqui
  'mais-um@email.com'  // ← E aqui
];
```

Depois execute:

```bash
node scripts/set-admin-simple.js
```

---

## **Troubleshooting**

### ❌ Erro: "firebase-key.json not found"

- Certifique-se que o arquivo foi baixado
- Coloque na **raiz do projeto** (onde está package.json)
- Nome exato: `firebase-key.json`

### ❌ Erro: "auth/user-not-found"

- Verifique se o email está correto
- O usuário precisa ter feito login pelo menos uma vez

### ❌ Ainda retorna "isAdmin: false"

- Faça **logout** e **login novamente**
- Limpe o cache do navegador (Ctrl+Shift+Delete)
- Feche abas do navegador e reabra

---

## **Resumo Rápido**

| Método | Dificuldade | Tempo | Melhor Para |
|--------|-------------|-------|-----------|
| Console | ⭐ Fácil | 2 min | Usuários únicos |
| Script Node | ⭐⭐ Médio | 5 min | Vários usuários |
| Firebase CLI | ⭐⭐⭐ Difícil | 3 min | DevOps/CI-CD |

**Recomendação: Use o Console (Forma 1) pela primeira vez, depois use o Script (Forma 2) para adicionar mais.**
