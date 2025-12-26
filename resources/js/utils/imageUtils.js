/**
 * Résout le chemin d'image correctement pour les seeders et storage
 * @param {string} path - Le chemin de l'image
 * @returns {string} - Le chemin résolu
 */
export const resolveImagePath = (path) => {
    if (!path) return '/images/placeholder.png';
    
    // Si c'est déjà une URL complète, retourner tel quel
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    
    // Si le chemin commence par /images/ (seeders), retourner tel quel
    if (path.startsWith('/images/')) {
        return path;
    }
    
    // Si le chemin commence par /storage/, retourner tel quel
    if (path.startsWith('/storage/')) {
        return path;
    }
    
    // Si le chemin commence par storage/ (sans /), ajouter / avant
    if (path.startsWith('storage/')) {
        return '/' + path;
    }
    
    // Si le chemin commence par /, retourner tel quel
    if (path.startsWith('/')) {
        return path;
    }
    
    // Sinon, c'est un chemin storage relatif, ajouter /storage/
    return `/storage/${path}`;
};

/**
 * Résout le chemin d'image pour les catégories (gère icon et image)
 * @param {object} category - L'objet catégorie avec icon et image
 * @returns {string} - Le chemin résolu (priorité à image, puis icon)
 */
export const resolveCategoryImage = (category) => {
    if (!category) return '/images/placeholder.png';
    
    const imagePath = category.image || category.icon;
    return resolveImagePath(imagePath);
};

