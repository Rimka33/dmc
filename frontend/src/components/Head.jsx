import { useEffect } from 'react';

// Remplacement minimal de Head d'Inertia pour le projet standalone
export function Head({ children }) {
    useEffect(() => {
        if (!children) return;
        const nodes = Array.isArray(children) ? children : [children];
        nodes.forEach((child) => {
            if (child?.type === 'title') {
                document.title = child.props.children;
            }
        });
    }, [children]);
    return null;
}
