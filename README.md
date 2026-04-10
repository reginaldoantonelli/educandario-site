# 🏫 Educandário Nossa Senhora Aparecida

> **Site institucional moderno com painel administrativo seguro**

Site e plataforma administrativa moderna para o Educandário Nossa Senhora Aparecida. Substituiu um antigo portal WordPress com uma arquitetura SPA (Single Page Application) em React, oferecendo melhor desempenho, segurança e experiência do usuário.

![Lighthouse Score](https://img.shields.io/badge/Performance-98-brightgreen) ![Accessibility](https://img.shields.io/badge/Accessibility-100-brightgreen) ![Best%20Practices](https://img.shields.io/badge/Best%20Practices-100-brightgreen) ![SEO](https://img.shields.io/badge/SEO-100-brightgreen)

---

## 🚀 Stack Tecnológico

| Área | Tecnologia |
|------|-----------|
| **Frontend** | React 19 + TypeScript |
| **Build** | Vite 7 (⚡ Ultra-rápido) |
| **Styling** | Tailwind CSS v4 + Dark Mode |
| **Icons** | Lucide React (18+ ícones SVG otimizados) |
| **Optimização** | Sharp.js (imagens WebP) |
| **Roteamento** | React Router v6 |
| **Linting** | ESLint + Prettier |

---

## ✨ Funcionalidades Principais

### 🎨 Interface & UX

- ✅ **Dark Mode Nativo** com persistência em localStorage
- ✅ **Tema Claro/Escuro** com transições suaves
- ✅ **Responsivo** (Mobile First) - 100% em todos dispositivos
- ✅ **Controle de Acessibilidade** (Tamanho de fonte, contraste)
- ✅ **WCAG AA Compliant** - Acessibilidade para todos

### ⚡ Performance

- ✅ **Lazy Loading** de componentes e imagens
- ✅ **Imagens Otimizadas** em WebP com fallback
- ✅ **Code Splitting** automático via Vite
- ✅ **Lighthouse Score 98+** em todas métrics

### 🔐 Área Administrativa

- ✅ **Página de Login** com validação e feedback visual
- ✅ **Autenticação Segura** com estado de carregamento
- ✅ **Checkbox "Lembrar-me"** (Persistent sessions)
- ✅ **Mostrar/Ocultar Senha** com ícone
- ✅ **Validação em Tempo Real** com mensagens de erro
- ✅ **Spinner Animado** profissional durante autenticação
- ✅ **Proteção de Conta** - sem link de auto-registro

### 📱 Componentes

- ✅ **Navbar** com navegação, tema e acessibilidade
- ✅ **Footer** com info de contato e redes sociais
- ✅ **Hero Section** com CTA destacado
- ✅ **Project Cards** com efeitos hover
- ✅ **Donation Modal** com PIX integrado
- ✅ **Alert/Error Messages** com auto-dismiss

---

## 📄 Páginas da Aplicação

| Página | Descrição | Status |
|--------|-----------|--------|
| 🏠 **Home** | Destaque institucional, projetos, impacto e CTA | ✅ Ativa |
| ℹ️ **Sobre** | Apresentação da missão e valores | ✅ Ativa |
| 📜 **Nossa História** | Linha do tempo interativa com fotos | ✅ Ativa |
| 📋 **Regimento Interno** | Normas e download do PDF | ✅ Ativa |
| 📊 **Transparência** | Informações financeiras e relatórios | ✅ Ativa |
| 📧 **Contato** | Formulário de contato e dados | ✅ Ativa |
| 🔓 **Login** | Autenticação segura com UI moderna | ✅ Ativa |
| ⚠️ **404** | Página de erro customizada | ✅ Ativa |

---

## 🎯 Funcionalidades Técnicas da Página Login

### 🔑 Autenticação

```typescript
// Validação em tempo real
✓ Email válido com regex personalisado
✓ Senha mínimo 6 caracteres
✓ Feedback instantâneo de erros
✓ Limpeza automática de mensagens
```

### 🎨 UX/UI Melhorada

- **Estado de Loading**: Spinner SVG animado + texto "Autenticando..."
- **Campos Desabilitados**: Durante carregamento, com opacity reduzida
- **Mostrar/Ocultar Senha**: Toggle com ícone Eye/EyeOff
- **Lembrar Dispositivo**: Checkbox opcional para persistent login
- **Mensagens Contextuais**: Erro/Sucesso com cores e ícones
- **Tema Dinâmico**: Dark mode com botão de toggle no topo

### 🔒 Segurança

- Autenticação sem link de auto-registro (admin only)
- Link "Esqueceu a senha?" para recuperação
- Proteção contra múltiplas tentativas (placeholder)
- Validação de entrada sanitizada
- Headers de segurança otimizados

---

## 🛠️ Setup & Execução

### Pré-requisitos

```
✓ Node.js 18.0.0 ou superior
✓ npm 9.0.0+ ou yarn 4.0.0+
```

### 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/reginaldoantonelli/educandario-site.git
cd educandario-site

# Instale dependências
npm install
# ou
yarn install
```

### 🚀 Desenvolvimento

```bash
# Inicie o servidor com hot reload
npm run dev
# Acesse: http://localhost:5173
```

### 📦 Build & Deploy

```bash
# Build otimizado para produção
npm run build
# Gera pasta /dist pronta para deploy

# Preview do build (teste local)
npm run preview
# Acesse: http://localhost:4173
```

### 🖼️ Otimizar Imagens

```bash
# Converte e otimiza todas as imagens para WebP
npm run optimize-images

# Resultado: /src/assets-optimized/
# ✓ Reduz tamanho em ~60%
# ✓ Mantém qualidade visual
# ✓ Fallback para PNG/JPG automático
```

### 📋 Linting & Formatação

```bash
# Verificar erros de lint
npm run lint

# Corrigir automaticamente
npm run lint --fix
```

---

## 📁 Estrutura do Projeto

```
educandario-site/
├── public/                    # Arquivos estáticos
│   └── robots.txt
├── src/
│   ├── assets/               # Imagens originais
│   │   └── project/
│   ├── assets-optimized/     # Imagens otimizadas (WebP)
│   ├── components/           # Componentes reutilizáveis
│   │   ├── Admin/            # Componentes do painel admin
│   │   │   ├── UploadModal.tsx              # Modal de upload de documentos
│   │   │   ├── UploadConfirmationModal.tsx  # Confirmação de upload com loading
│   │   │   ├── EditDocumentModal.tsx        # Modal de edição de documentos
│   │   │   ├── OperationConfirmationModal.tsx  # Confirmação genérica com spinner
│   │   │   └── ConfirmDeleteModal.tsx       # Confirmação de exclusão
│   │   ├── Navbar/
│   │   │   └── index.tsx     # Nav com dark mode & acessibilidade
│   │   ├── Footer/
│   │   │   └── index.tsx
│   │   ├── Hero/
│   │   │   └── index.tsx
│   │   ├── ProjectCards/
│   │   │   └── index.tsx
│   │   ├── ImpactStats/
│   │   │   └── index.tsx
│   │   ├── DonationModel/
│   │   │   └── DonationModal.tsx
│   │   └── NotificationPanel.tsx  # Painel de notificações com timestamp
│   ├── hooks/                # Custom React Hooks
│   ├── layouts/
│   │   └── DefaultLayout.tsx # Layout principal
│   ├── pages/                # Páginas (roteadas)
│   │   ├── Home/
│   │   ├── About/
│   │   ├── Contact/
│   │   ├── HistoryPage/
│   │   │   └── index.tsx     # Página de história com modal de zoom
│   │   ├── RegimentoInterno/
│   │   │   └── index.tsx
│   │   ├── ErrorPage/
│   │   │   └── index.tsx
│   │   ├── Login/
│   │   │   └── index.tsx     # 🔒 Autenticação admin
│   │   └── Admin/            # 🔒 Área administrativa (protegida)
│   │       ├── Dashboard/
│   │       │   └── index.tsx     # Visão geral com métricas dinâmicas
│   │       ├── Transparency/
│   │       │   └── index.tsx     # Gestão de documentos públicos
│   │       └── Settings/
│   │           └── index.tsx     # Configurações administrativas
│   ├── App.tsx               # Configuração de rotas
│   ├── main.tsx              # Entry point
│   └── index.css             # Estilos globais
├── vite.config.ts            # Config do Vite
├── tailwind.config.js        # Config Tailwind
├── tsconfig.json             # Config TypeScript
├── eslint.config.js          # Config ESLint
├── package.json
└── README.md
```

---

## 🎨 Tecnologias de Estilo

### Tailwind CSS v4

- **Utility-First**: Classes pequenas e reutilizáveis
- **Dark Mode**: Ativo-automático via classe `dark`
- **Responsive**: Breakpoints Mobile-First (sm, md, lg, xl)

### Exemplo de Uso

```jsx
<div className="bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
  {/* Claro em light mode, escuro em dark mode */}
</div>
```

---

## 🔍 Performance & Otimizações

### Lighthouse Metrics

| Métrica | Score | Target |
|---------|-------|--------|
| Performance | 98 | >90 ✅ |
| Accessibility | 100 | >90 ✅ |
| Best Practices | 100 | >90 ✅ |
| SEO | 100 | >90 ✅ |

### Estratégias Aplicadas

1. **Code Splitting**: Carregamento sob demanda de componentes
2. **Image Optimization**: WebP com lazy loading
3. **Tree Shaking**: Remove código não utilizado
4. **Minification**: CSS/JS/HTML minificados
5. **Caching**: Versionamento automático de assets

---

## 🌐 Deploy

### Opções de Deploy

#### Vercel (Recomendado)

```bash
npm i -g vercel
vercel
# Conecta ao GitHub automaticamente
```

#### Netlify

```bash
npm run build
# Fazer upload da pasta /dist
```

#### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

## 🤝 Contribuindo

### Como Reportar Issues

1. Abra uma issue no GitHub
2. Descreva o problema com prints/vídeos
3. Especifique browser e SO

### Como Fazer PR

```bash
# 1. Fork o repositório
# 2. Crie uma branch
git checkout -b feat/sua-feature

# 3. Commit suas mudanças
git commit -m "feat: descrição clara"

# 4. Push e abra PR
git push origin feat/sua-feature
```

### Padrões de Código

- ✅ TypeScript com tipos explícitos
- ✅ Componentes funcionais com Hooks
- ✅ Nomes descritivos em inglês
- ✅ Comentários para lógica complexa
- ✅ Arquivo .env.example fornecido

---

## 📝 Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

```env
# API
VITE_API_URL=https://api.educandario.com

# Features
VITE_ENABLE_DONATIONS=true
VITE_ENABLE_ADMIN=true

# Analytics (opcional)
VITE_GA_ID=UA-XXXXXXXXX-X
```

---

## 📚 Documentação Adicional

- [Tailwind CSS](https://tailwindcss.com) - Estilos
- [React Router](https://reactrouter.com) - Roteamento
- [Vite Docs](https://vitejs.dev) - Build tool
- [TypeScript](https://www.typescriptlang.org) - Tipagem

---

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/reginaldoantonelli/educandario-site/issues)
- **Discussões**: [GitHub Discussions](https://github.com/reginaldoantonelli/educandario-site/discussions)
- **Email**: <contato@educandario.org>

---

## 📄 Licença

Este projeto está sob licença **MIT**. Veja [LICENSE](./LICENSE) para detalhes.

---

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ por **Reginaldo Antonelli**

[![GitHub](https://img.shields.io/badge/GitHub-reginaldoantonelli-181717?style=flat&logo=github)](https://github.com/reginaldoantonelli)

---

**Última atualização**: Abril de 2026

```

## 📊 Scripts Disponíveis

| Comando | Descrição |
| -------- | ----------- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm run lint` | Verificação de código |
| `npm run optimize-images` | Otimização de imagens |

## 🎯 Lighthouse Scores

Testado em modo produção (`npm run preview`):

- **Performance:** 98/100
- **Accessibility:** 100/100
- **Best Practices:** 100/100
- **SEO:** 100/100

## 📝 Notas

- Links e textos institucionais refletem informações fornecidas pelo Educandário
- Dados sensíveis (PIX, contas, documentos) devem ser conferidos pela equipe responsável antes da publicação

## 📄 Licença

Este projeto foi desenvolvido para o Educandário Nossa Senhora Aparecida de Itapira/SP.
