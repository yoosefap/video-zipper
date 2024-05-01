import {defineConfig} from 'vite';
import crossOriginIsolation from 'vite-plugin-cross-origin-isolation';

export default defineConfig({
    base: '/video-zipper/',
    plugins: [
        crossOriginIsolation()
    ]
});