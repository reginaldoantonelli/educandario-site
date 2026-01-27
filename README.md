# Educandario Nossa Senhora Aparecida

Site institucional moderno para o Educandario Nossa Senhora Aparecida, substituindo o antigo portal WordPress (<https://educandarionsa.com.br/wordpress/>). Construido com React + Vite para desempenho, acessibilidade e facilidade de manutencao.

## Tecnologias

- React 18 + TypeScript (SPA com React Router)
- Vite (build/dev server)
- Tailwind CSS (estilos e responsividade)
- Lucide Icons (icones)

## Funcionalidades e Paginas

- Navegacao principal com dropdown "A Instituicao" e CTA de doacao (modal com chave PIX).
- Home: destaque institucional, projetos e chamadas para doacao/contato.
- Sobre: apresentacao da organizacao.
- Nossa Historia: linha do tempo e fotos do Educandario.
- Regimento Interno: normas, diretrizes e download do PDF oficial.
- Transparencia: informacoes financeiras e de prestacao de contas.
- Contato: canais oficiais, formulario/links e dados completos.
- Erro 404: pagina de falha de rota.

## Motivos da substituicao

- Modernizar a experiencia visual e mobile-first.
- Melhorar performance e SEO com Vite + React.
- Facilitar manutencao, modularizacao e evolucao de conteudo.
- Unificar informacoes institucionais, de transparencia e campanhas de doacao.

## Como executar localmente

1) Instale as dependencias:
   - npm install
2) Rode em modo desenvolvimento:
   - npm run dev
3) Acesse:
   - <http://localhost:5173>

## Estrutura principal

- src/components – Navbar, Footer, modais e blocos reutilizaveis.
- src/pages – Home, Sobre, Historia, Regimento Interno, Transparencia, Contato, etc.
- public – assets estaticos (favicon/logo).

## Nota sobre conteudo

- Links e textos institucionais refletem informacoes fornecidas pelo Educandario. Dados sensiveis (PIX, contas, documentos) devem ser conferidos e atualizados pela equipe responsavel antes da publicacao.# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
