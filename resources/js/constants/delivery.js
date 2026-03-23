/**
 * Livraison Configuration
 * Modifiez les prix ici selon les secteurs.
 * Les prix sont en FCFA.
 */
export const SHIPPING_FEES = {
  // Dakar est divisé en sous-secteurs pour plus de précision
  'Dakar': {
    default: 2000,
    neighborhoods: {
      'Plateau': 1500,
      'Médina': 1500,
      'Fann': 2000,
      'Point E': 2000,
      'Almadies': 3000,
      'Ngor': 3000,
      'Ouakam': 2500,
      'Mermoz': 2500,
      'Sacré Cœur': 2500,
      'Dieuppeul': 2000,
      'Liberte': 2000,
      'Yoff': 2500,
      'Guediawaye': 3500,
      'Pikine': 3500,
      'Rufisque': 5000,
    }
  },
  'Thiès': {
      default: 5000,
  },
  'Saint-Louis': {
      default: 7000,
  },
  'Diourbel': {
      default: 7000,
  },
  'Kaolack': {
      default: 7000,
  },
  'DEFAULT': 5000
};

/**
 * Fonction pour calculer les frais de livraison
 */
export const calculateShippingFee = (region, neighborhood) => {
  if (!region) return SHIPPING_FEES.DEFAULT;
  
  const regionConfig = SHIPPING_FEES[region];
  
  if (!regionConfig) return SHIPPING_FEES.DEFAULT;
  
  // Si c'est un objet (comme Dakar)
  if (typeof regionConfig === 'object') {
    if (neighborhood && regionConfig.neighborhoods && regionConfig.neighborhoods[neighborhood]) {
      return regionConfig.neighborhoods[neighborhood];
    }
    return regionConfig.default || SHIPPING_FEES.DEFAULT;
  }
  
  return regionConfig;
};
