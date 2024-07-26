import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    let outputDir = 'dist';

    if (mode === 'server') {
        outputDir = 'dist-test';
    } else if (mode === 'production') {
        outputDir = 'dist-production';
    }

    return {
        plugins: [react(), svgr()],
        server: {
            proxy: {
                '/api': {
                    target: 'https://www.fim.benewake.top',
                    changeOrigin: true,
                    rewrite: path => path.replace(/^\/api/, '')
                }
            }
        },
        build: {
            outDir: outputDir,
            rollupOptions: {
                // 其他的 Rollup 选项可以放在这里
            },
        }
    }
})
