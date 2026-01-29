# Educandário Nossa Senhora Aparecida

Site institucional moderno para o Educandário Nossa Senhora Aparecida, substituindo o antigo portal WordPress. Construído com React + Vite para desempenho, acessibilidade e facilidade de manutenção.

![Lighthouse Score](https://img.shields.io/badge/Performance-98-brightgreen) ![Accessibility](https://img.shields.io/badge/Accessibility-100-brightgreen) ![Best Practices](https://img.shields.io/badge/Best%20Practices-100-brightgreen) ![SEO](https://img.shields.io/badge/SEO-100-brightgreen)

## 🚀 Tecnologias

- **React 19** + TypeScript (SPA com React Router)
- **Vite 7** (build/dev server ultra-rápido)
- **Tailwind CSS v4** (estilos e responsividade)
- **Lucide Icons** (ícones otimizados)
- **Sharp** (otimização de imagens)

## ✨ Funcionalidades

- 🌙 **Dark Mode** com persistência em localStorage
- 🔤 **Controle de Fonte** (A-/A+) para acessibilidade
- 📱 **Responsivo** para todos os dispositivos
- ⚡ **Lazy Loading** de páginas e imagens
- 🖼️ **Imagens otimizadas** em WebP
- ♿ **WCAG AA** compliant (contraste e aria-labels)

## 📄 Páginas

| Página | Descrição |
| -------- | ----------- |
| Home | Destaque institucional, projetos e CTAs |
| Sobre | Apresentação da organização |
| Nossa História | Linha do tempo e fotos com lightbox |
| Regimento Interno | Normas e download do PDF |
| Transparência | Informações financeiras |
| Contato | Formulário e dados de contato |

## 🛠️ Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/reginaldoantonelli/educandario-site.git
cd educandario-site

# Instale as dependências
npm install
```

### Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento
npm run dev

# Acesse em http://localhost:5173
```

### Build de Produção

```bash
# Gera o build otimizado na pasta /dist
npm run build
```

### Testar em Modo Produção

```bash
# Após o build, rode o preview
npm run preview

# Acesse em http://localhost:4173
```

### Otimização de Imagens

```bash
# Otimiza todas as imagens em src/assets/
npm run optimize-images

# As imagens otimizadas ficam em src/assets-optimized/
```

## 📁 Estrutura do Projeto

```
src/
├── assets/           # Imagens e recursos estáticos
├── components/       # Componentes reutilizáveis
│   ├── Navbar/       # Navegação com dark mode e controles
│   ├── Footer/       # Rodapé com links e redes sociais
│   ├── Hero/         # Banner principal
│   ├── ProjectCards/ # Carrossel de projetos
│   └── DonationModal/# Modal de doação com PIX
├── layouts/          # Layouts de página
├── pages/            # Páginas da aplicação
└── App.tsx           # Rotas e configuração
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
