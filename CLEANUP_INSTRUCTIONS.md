# 🧹 Limpeza de Arquivos Órfãos - Firebase Storage

## 📖 Instruções de Uso

Este script remove arquivos órfãos do Firebase Storage (arquivos sem registro correspondente no Firestore).

### ⚠️ Problema que Resolve

Quando deletamos documentos via navegador, pode haver um erro de CORS que impede a deleção dos arquivos físicos no Storage. Isso deixa arquivos órfãos (sem registro no Firestore), consumindo espaço desnecessário.

**Este script roda com credenciais de admin no servidor**, ignorando completamente o CORS.

---

## 🚀 Como Usar

### Passo 1: Obter Credenciais do Firebase Admin SDK

1. Acesse o [Firebase Console](https://console.firebase.google.com/project/educandario-site/settings/serviceaccounts/adminsdk)
2. Na aba **"Contas de Serviço"**, clique em **"Gerar nova chave privada"**
3. Um arquivo JSON será baixado automaticamente
4. Renomeie-o para `serviceAccountKey.json` e coloque **na raiz do projeto**

**Estrutura esperada:**
```
educandario-site/
├── serviceAccountKey.json  ← Arquivo baixado do Firebase
├── package.json
├── scripts/
│   └── cleanup-orphaned-files.js
└── ...
```

### Passo 2: Executar o Script

```bash
npm run cleanup-orphaned
```

---

## 📊 O que o Script Faz

1. **Conecta** ao Firebase Storage com credenciais de admin
2. **Lista** todos os arquivos no Storage
3. **Verifica** se cada arquivo tem um documento correspondente no Firestore
4. **Deleta** apenas os arquivos órfãos
5. **Mostra** relatório com estatísticas

---

## 📋 Exemplo de Saída

```
🧹 Iniciando limpeza de arquivos órfãos...

📂 Listando arquivos no Storage...
✓ Total de 10 arquivo(s) encontrado(s)

✓ [1] Arquivo válido: documents/1234567890-Tutorial.pdf
✓ [2] Arquivo válido: documents/9876543210-Guia.pdf
🗑️  [1] Deletando arquivo órfão: documents/1111111111-Orfao.pdf
    ✓ Deletado com sucesso

⚠️  Arquivo com estrutura inesperada: other-file.pdf

==================================================
📊 RESUMO DA LIMPEZA
==================================================
📁 Total de arquivos: 10
✓ Arquivos válidos: 9
🗑️  Arquivos órfãos deletados: 1
==================================================

🎉 1 arquivo(s) órfão(s) deletado(s) com sucesso!
```

---

## ⚙️ Variáveis de Ambiente

Se quiser especificar o caminho do arquivo de credenciais, defina:

```bash
FIREBASE_KEY_PATH=/caminho/para/serviceAccountKey.json npm run cleanup-orphaned
```

Padrão: `./serviceAccountKey.json` (raiz do projeto)

---

## ⚠️ Segurança

- **NUNCA** commit o arquivo `serviceAccountKey.json` no Git
- Já está no `.gitignore` por padrão
- Guarde este arquivo com segurança
- Se exposto, regenere a chave no Firebase Console

---

## 🔍 Lógica do Script

O script verifica se cada arquivo segue este padrão:
```
documents/{documentId}-{filename}
```

Exemplo:
- Caminho: `documents/1776229137412-Tut_Tinkercad.pdf`
- ID extraído: `1776229137412`
- Procura por: Documento com ID `1776229137412` no Firestore
- Se não existir → É órfão → Deleta

---

## 🆘 Troubleshooting

### "Arquivo de credenciais não encontrado"
- ✅ Baixe o `serviceAccountKey.json` do Firebase Console
- ✅ Coloque na raiz do projeto
- ✅ Renomeie corretamente

### Erro de permissão
- ✅ Verifique se as credenciais têm permissão de admin
- ✅ Regerar a chave no Firebase Console

### Script não encontra documentos
- ✅ Verifique se o banco de dados `educandario-site` está ativo
- ✅ Confirme que os documentos existem em `db.collection('documents')`

---

## 📝 Notas

- O script é **seguro**: sempre verifica se o documento existe antes de deletar
- Pode ser executado quantas vezes quiser
- Não afeta documentos válidos
- Ideal rodar regularmente para manter Storage otimizado

---

## 🎯 Próximos Passos

Após rodar o script com sucesso:

1. Verifique no [Firebase Console](https://console.firebase.google.com/project/educandario-site/storage) se os arquivos órfãos foram removidos
2. Confirme que os documentos ainda aparecem no admin panel
3. Opcional: Agende execução regular via cron job ou Cloud Functions
