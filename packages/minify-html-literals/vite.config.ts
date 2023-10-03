import { builtinModules } from 'node:module'
import path from 'node:path'
import url from 'node:url'
// import pattycake from 'pattycake'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import tsconfigPaths from 'vite-tsconfig-paths'

import pkg from './package.json' assert { type: 'json' }

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), 'src/index.ts'),
      fileName: 'index',
      formats: ['es', 'cjs'],
      name: 'index',
    },
    minify: 'esbuild',
    rollupOptions: {
      external: [
        ...builtinModules,
        ...builtinModules.map(module => `node:${module}`),
        ...Object.keys(pkg.dependencies),
      ],
    },
  },
  plugins: [
    // pattycake.vite({ disableOptionalChaining: false }),
    tsconfigPaths(),
    dts(),
  ],
})
