---
description: Plan de séparation complète Frontend/Backend avec API REST
---

# PLAN DE SÉPARATION FRONTEND/BACKEND - DMC

## OBJECTIF
Séparer complètement le frontend React du backend Laravel en utilisant une API REST pure.

## PHASE 1 : NETTOYAGE ET SUPPRESSION DES DUPLICATIONS

### 1.1 Supprimer les Controllers Web (garder uniquement API)
- ❌ Supprimer `app/Http/Controllers/HomeController.php`
- ❌ Supprimer `app/Http/Controllers/CategoryController.php`
- ❌ Supprimer `app/Http/Controllers/ProductController.php`
- ❌ Supprimer `app/Http/Controllers/ShopController.php`
- ❌ Supprimer `app/Http/Controllers/CartController.php`
- ❌ Supprimer `app/Http/Controllers/PageController.php`
- ❌ Supprimer `app/Http/Controllers/Auth/AuthController.php` (garder Api/AuthController)
- ✅ Garder `app/Http/Controllers/Admin/*` (pour le panel admin)

### 1.2 Nettoyer les Routes
- ❌ Supprimer toutes les routes web client de `routes/web.php`
- ✅ Garder uniquement les routes admin dans `routes/web.php`
- ✅ Compléter `routes/api.php` avec toutes les routes nécessaires

### 1.3 Supprimer Inertia.js
- ❌ Désinstaller `@inertiajs/react`
- ❌ Supprimer les imports Inertia des controllers restants
- ✅ Le frontend utilisera React Router + Axios

## PHASE 2 : COMPLÉTER LE BACKEND API

### 2.1 Créer les API Resources (Transformers)
- ✅ `CategoryResource.php`
- ✅ `ProductResource.php`
- ✅ `ProductCollection.php`
- ✅ `SpecialOfferResource.php`
- ✅ `OrderResource.php`
- ✅ `UserResource.php`

### 2.2 Compléter les Controllers API
- ✅ `Api/CategoryController.php` - CRUD complet
- ✅ `Api/ProductController.php` - CRUD complet + filtres
- ✅ `Api/CartController.php` - Gestion panier
- ✅ `Api/OrderController.php` - Gestion commandes
- ✅ `Api/ContactController.php` - Formulaire contact
- ✅ Améliorer `Api/AuthController.php`

### 2.3 Créer les Services Backend
- ✅ `CartService.php` - Logique métier panier
- ✅ `OrderService.php` - Logique métier commandes
- ✅ `ImageUploadService.php` - Upload images

### 2.4 Configurer CORS
- ✅ Configurer `config/cors.php`
- ✅ Permettre les requêtes depuis le frontend

### 2.5 Compléter les Routes API
- ✅ Routes authentification
- ✅ Routes produits et catégories
- ✅ Routes panier
- ✅ Routes commandes
- ✅ Routes contact

### 2.6 Validation et Request Classes
- ✅ `StoreProductRequest.php`
- ✅ `UpdateProductRequest.php`
- ✅ `StoreCategoryRequest.php`
- ✅ `CheckoutRequest.php`

## PHASE 3 : DOCUMENTATION API

### 3.1 Créer la documentation API
- ✅ Documenter tous les endpoints
- ✅ Exemples de requêtes/réponses
- ✅ Codes d'erreur

## RÉSULTAT FINAL

**Backend Laravel** :
- API REST pure
- Retourne uniquement du JSON
- Authentification avec Sanctum
- CORS configuré
- Resources pour formater les réponses

**Frontend React** (à corriger par l'utilisateur) :
- SPA pure avec React Router
- Appels API avec Axios
- Gestion d'état locale
- Déployable séparément
