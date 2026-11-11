import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Panel institucional (Dirección, Preceptoría y Docentes).
// Los tipos compartidos se toman directo del código fuente del monorepo.
export default defineConfig({
  plugins: [react()],
  // Evita que esbuild lea el tsconfig de packages/shared-types, que extiende
  // @biliapp/config y solo resuelve con el workspace de pnpm instalado.
  // (Como string, Vite no busca ningún tsconfig.json.)
  esbuild: { tsconfigRaw: '{"compilerOptions":{"target":"ES2022"}}' },
  resolve: {
    alias: {
      '@biliapp/shared-types': fileURLToPath(
        new URL('../../packages/shared-types/src/index.ts', import.meta.url),
      ),
    },
  },
  server: {
    // 3001 para no chocar con apps/web-admin (Next.js, puerto 3000).
    port: Number(process.env.WEB_PANEL_PORT) || 3001,
  },
});
