# PLA Web Submit - React Application

A modern React.js web application built with Vite, TypeScript, and professional development tools for the PLA Web Submit project.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Development
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Open your browser to [http://localhost:5173](http://localhost:5173)

### Building for Production
- Build the project (Vite only, no TS typecheck): `npm run build`
- Preview production build: `npm run preview`
- Optional: Run TypeScript type checking locally: `npm run typecheck`

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (skips TS typecheck)
- `npm run preview` - Preview production build locally
- `npm run typecheck` - Run TypeScript project references build (type check only)
- `npm run lint` - Run ESLint for code quality checks

## Project Structure
- `src/` - Source code
  - `components/` - React components
  - `assets/` - Static assets
- `public/` - Public assets
- `dist/` - Production build output

## Tech Stack
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting and quality

## Deploying on Render

Render may install only production dependencies during the build if `NODE_ENV=production` is set, which can omit TypeScript and `@types/*` packages. To ensure smooth builds:

- This project’s `build` script uses `vite build` (no type checking) so builds succeed even if devDependencies aren’t installed.
- For CI or local validation, run `npm run typecheck` to run full TypeScript checks.
- If you prefer to keep type checking in Render’s build step, either:
  - Set the environment variable `NPM_CONFIG_PRODUCTION=false` in your Render service so devDependencies are installed during build; or
  - Move required types (`@types/react`, `@types/react-dom`) and build-time tools to `dependencies`.

## Vite Features

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

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
