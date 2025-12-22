import './bootstrap';
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'DMC';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        // Si c'est ClientEntry, on retourne le composant directement importé (non, dynamic import mieux)
        // Mais nous n'avons pas de dossier "entry", c'est à la racine de js/
        if (name === 'ClientEntry') {
            return resolvePageComponent(`./ClientEntry.jsx`, import.meta.glob('./ClientEntry.jsx'));
        }
        return resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx'));
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
