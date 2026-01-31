import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    // Enable minification and tree-shaking
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // React core
            if (id.includes('react-dom') || id.includes('react-router') || id.includes('/react/')) {
              return 'vendor-react';
            }
            // 3D libraries (Three.js is large)
            if (id.includes('three') || id.includes('@react-three')) {
              return 'vendor-three';
            }
            // Animation libraries
            if (id.includes('framer-motion') || id.includes('gsap')) {
              return 'vendor-animation';
            }
            // Firebase (very large)
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            // UI libraries
            if (id.includes('@nextui-org')) {
              return 'vendor-ui';
            }
            // React icons (can be large)
            if (id.includes('react-icons')) {
              return 'vendor-icons';
            }
            // Other utilities
            if (id.includes('lodash') || id.includes('lenis') || id.includes('lucide')) {
              return 'vendor-utils';
            }
          }
        },
      },
    },
  },
  // Optimize dev server
  server: {
    hmr: {
      overlay: true,
    },
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})