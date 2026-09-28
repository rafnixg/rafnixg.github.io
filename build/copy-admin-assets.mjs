import { copyFileSync, mkdirSync } from 'node:fs';

mkdirSync('assets/vendor', { recursive: true });
copyFileSync('node_modules/quill/dist/quill.js', 'assets/vendor/quill.js');
copyFileSync('node_modules/quill/dist/quill.snow.css', 'assets/vendor/quill.snow.css');
