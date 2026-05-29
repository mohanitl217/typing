import { defineConfig } from 'vite';

// Multi-page Vite config for the typing-tutor site.
// Each top-level HTML file becomes its own entry, so they can be deep-linked
// (e.g. /learn.html, /practice.html, /admin.html) on Hostinger / Vercel /
// Netlify / any static host.
export default defineConfig({
  // Use relative base so the build output works at root paths AND in subpaths.
  base: './',

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Don't inline anything — keep CSS/JS as separate files so the static host
    // can cache them.
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main:     'index.html',
        learn:    'learn.html',
        practice: 'practice.html',
        exam:     'exam.html',
        admin:    'admin.html',
      },
      output: {
        // Group output assets sensibly
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      }
    }
  },

  server: {
    port: 5173,
    open: '/index.html'
  },

  preview: {
    port: 4173,
    open: '/index.html'
  }
});
