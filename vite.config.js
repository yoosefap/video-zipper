import {defineConfig} from 'vite';
import crossOriginIsolation from 'vite-plugin-cross-origin-isolation';
import { resolve } from 'path';

export default defineConfig({
    base: '/video-zipper/',
    plugins: [
        crossOriginIsolation()
    ]
});