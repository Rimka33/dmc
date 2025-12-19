<footer class="footer-dark pt-16 pb-8">
    <div class="container mx-auto px-4">
        <!-- Main Footer Content -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            <!-- Boutique Column -->
            <div>
                <h3 class="text-white font-bold text-sm uppercase mb-4">Boutique</h3>
                <ul class="space-y-2">
                    <li><a href="#" class="text-white text-sm hover:text-[var(--color-neon-green)] transition-colors">Accessoires Informatique</a></li>
                    <li><a href="#" class="text-white text-sm hover:text-[var(--color-neon-green)] transition-colors">Ordinateurs Portables</a></li>
                    <li><a href="#" class="text-white text-sm hover:text-[var(--color-neon-green)] transition-colors">Ordinateurs Bureau</a></li>
                    <li><a href="#" class="text-white text-sm hover:text-[var(--color-neon-green)] transition-colors">Chargeurs Ordinateurs</a></li>
                    <li><a href="#" class="text-white text-sm hover:text-[var(--color-neon-green)] transition-colors">Batteries Ordinateurs</a></li>
                    <li><a href="#" class="text-white text-sm hover:text-[var(--color-neon-green)] transition-colors">Imprimantes & Accessoires</a></li>
                    <li><a href="#" class="text-white text-sm hover:text-[var(--color-neon-green)] transition-colors">Multimédia & Electronique</a></li>
                </ul>
            </div>

            <!-- A Propos Column -->
            <div>
                <h3 class="text-white font-bold text-sm uppercase mb-4">A PROPOS</h3>
                <ul class="space-y-2">
                    <li><a href="#" class="text-white text-sm hover:text-[var(--color-neon-green)] transition-colors">Qui sommes-Nous</a></li>
                    <li><a href="#" class="text-white text-sm hover:text-[var(--color-neon-green)] transition-colors">Témoignages</a></li>
                    <li><a href="#" class="text-white text-sm hover:text-[var(--color-neon-green)] transition-colors">Nos Contacts</a></li>
                    <li><a href="#" class="text-white text-sm hover:text-[var(--color-neon-green)] transition-colors">Notre App</a></li>
                </ul>

                <!-- App Store Badges -->
                <div class="mt-6 space-y-2">
                    <a href="#" class="block">
                        <img src="{{ asset('images/app-store-badge.svg') }}" alt="App Store" class="h-10">
                    </a>
                    <a href="#" class="block">
                        <img src="{{ asset('images/play-store-badge.svg') }}" alt="Google Play" class="h-10">
                    </a>
                </div>
            </div>

            <!-- Mon Compte Column -->
            <div>
                <h3 class="text-white font-bold text-sm uppercase mb-4">MON COMPTE</h3>
                <ul class="space-y-2">
                    <li><a href="#" class="text-white text-sm hover:text-[var(--color-neon-green)] transition-colors">Se connecter</a></li>
                    <li><a href="#" class="text-white text-sm hover:text-[var(--color-neon-green)] transition-colors">S'inscrire</a></li>
                    <li><a href="#" class="text-white text-sm hover:text-[var(--color-neon-green)] transition-colors">Liste de souhaits</a></li>
                    <li><a href="#" class="text-white text-sm hover:text-[var(--color-neon-green)] transition-colors">Suivez vos commandes</a></li>
                    <li><a href="#" class="text-white text-sm hover:text-[var(--color-neon-green)] transition-colors">Vérifier</a></li>
                </ul>

                <!-- Social Media Icons -->
                <div class="flex gap-3 mt-6">
                    <a href="#" class="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:bg-[var(--color-neon-green)] transition-colors">
                        <img src="{{ asset('images/icons/facebook.svg') }}" alt="Facebook" class="w-4 h-4">
                    </a>
                    <a href="#" class="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:bg-[var(--color-neon-green)] transition-colors">
                        <img src="{{ asset('images/icons/instagram.svg') }}" alt="Instagram" class="w-4 h-4">
                    </a>
                    <a href="#" class="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:bg-[var(--color-neon-green)] transition-colors">
                        <img src="{{ asset('images/icons/twitter.svg') }}" alt="Twitter" class="w-4 h-4">
                    </a>
                    <a href="#" class="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:bg-[var(--color-neon-green)] transition-colors">
                        <img src="{{ asset('images/icons/youtube.svg') }}" alt="YouTube" class="w-4 h-4">
                    </a>
                    <a href="#" class="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:bg-[var(--color-neon-green)] transition-colors">
                        <img src="{{ asset('images/icons/linkedin.svg') }}" alt="LinkedIn" class="w-4 h-4">
                    </a>
                </div>
            </div>

            <!-- Service Clientèle Column -->
            <div>
                <h3 class="text-white font-bold text-sm uppercase mb-4">SERVICE CLIENTÈLE</h3>
                <ul class="space-y-2">
                    <li><a href="#" class="text-white text-sm hover:text-[var(--color-neon-green)] transition-colors">Retours & Remboursement</a></li>
                    <li><a href="#" class="text-white text-sm hover:text-[var(--color-neon-green)] transition-colors">Politique de Confidentialité</a></li>
                    <li><a href="#" class="text-white text-sm hover:text-[var(--color-neon-green)] transition-colors">Termes & Conditions</a></li>
                </ul>
            </div>

            <!-- Newsletter Column -->
            <div>
                <h3 class="text-white font-bold text-sm uppercase mb-4">Newsletter</h3>
                <p class="text-white/40 text-xs mb-4 leading-relaxed">
                    Bénéficiez de 15 % de réduction sur votre premier achat ! Soyez également informé(e) en avant-première des promotions, des lancements de nouveaux produits et des offres exclusives !
                </p>

                <!-- Newsletter Form -->
                <form class="relative mb-6">
                    <input type="email"
                           placeholder="votre Email"
                           class="w-full px-4 py-3 pr-24 rounded-[var(--radius-xs)] text-xs text-gray-400 bg-white shadow-[var(--shadow-input)] focus:outline-none focus:ring-2 focus:ring-[var(--color-neon-green)]">
                    <button type="submit" class="absolute right-0 top-0 h-full px-4 bg-[var(--color-neon-green)] text-black text-xs font-bold uppercase rounded-r-[var(--radius-xs)] hover:bg-[var(--color-forest-green)] transition-colors">
                        S'inscrire
                    </button>
                </form>

                <p class="text-white font-bold text-lg mb-2">Nous Joindre : +221 77 236 77 77</p>

                <div class="flex items-start gap-2 mb-2">
                    <i class="icon-map-pin text-[var(--color-neon-green)] mt-1"></i>
                    <p class="text-[var(--color-neon-green)] text-sm">DMC BOUTIQUE : 345 Rue FA 22, Dakar - Sénégal</p>
                </div>

                <p class="text-white text-sm">Email: contact@dmcomputer.sn</p>
            </div>
        </div>

        <!-- Bottom Footer -->
                <img src="{{ asset('images/payment-methods.png') }}" alt="Payment Methods" class="h-6" style="margin-left: 33%">

        <div class="border-t border-white/10 pt-6">
            <div class="flex flex-col md:flex-row items-center justify-between gap-4">
                <p class="text-white text-sm text-center md:text-center">
                    <span class="text-white">© 2025</span>
                    <span class="text-white font-bold">Daroul Mouhty Computer</span>
                    <span class="text-white">Tous droits réservés. Conçu par iTEA</span>
                </p>

            </div>
        </div>
    </div>
</footer>
