import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2022',
    lib: {
      entry: {
        index: 'src/index.ts',
        storage: 'src/storage/index.ts',
        audio: 'src/audio/index.ts',
        analytics: 'src/analytics/index.ts',
        ui: 'src/ui/index.ts',
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      // Capacitor 플러그인은 앱 쪽 것을 그대로 쓴다 (peerDependency)
      external: [/^@capacitor\//],
    },
  },
});
