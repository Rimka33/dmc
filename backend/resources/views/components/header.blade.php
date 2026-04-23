<header x-data="{ mobileMenuOpen: false, cartOpen: false, categoriesOpen: false }"
        class="font-sans sticky top-0 z-50 w-full shadow-md">
    <div class="py-2.5" style="background: linear-gradient(to bottom, rgba(1, 26, 10, 1))">
        <div class="container mx-auto px-4">
            <div class="flex items-center justify-between text-xs text-white">

                <div class="flex items-center gap-6">
                    <span class="hidden md:inline text-white/80 font-semibold uppercase tracking-wide text-[11px]">PARLER AU COMMERCIAL :</span>

                    <button class="flex items-center gap-2 hover:text-[var(--color-neon-green)] transition-colors group text-left">
                        <i class="icon-map-pin text-sm text-white group-hover:text-[var(--color-neon-green)]"></i>
                        <span class="hidden sm:inline font-bold text-[10px] leading-tight uppercase text-white/90">LOCALISER<br>LA BOUTIQUE</span>
                    </button>

                    <a href="tel:+221772367777" class="flex items-center gap-2 text-[var(--color-neon-green)] font-bold text-sm hover:underline">
                        <i class="icon-phone text-sm"></i>
                        +(221) 77 236 77 77
                    </a>
                </div>

                <div class="flex items-center gap-70">
                    <a href="{{ route('home') }}" class="hover:opacity-80 transition-opacity">
                        <img src="{{ asset('images/logo.png') }}" alt="DMC Logo" class="h-10 md:h-15 object-contain">
                    </a>

                    <div class="flex items-center gap-3 md:gap-4 text-white">
                        <button class="hover:text-[var(--color-neon-green)] transition-colors">
                            <i class="icon-heart text-lg"></i>
                        </button>

                        <div class="relative flex items-center" x-data="{ cartCount: 2 }">
                             <button @click="cartOpen = !cartOpen" class="relative flex items-center hover:text-[var(--color-neon-green)] transition-colors">
                                <i class="icon-shopping-cart text-lg"></i>
                                <span x-show="cartCount > 0" class="absolute -top-1.5 -right-1.5 bg-[var(--color-red-accent)] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                    <span x-text="cartCount"></span>
                                </span>
                            </button>

                            <div class="hidden md:block ml-3 px-2 py-1 bg-[var(--color-red-accent)] text-white text-xs font-bold rounded">
                                0.00 F.CFA
                            </div>
                        </div>

                        <button class="hover:text-[var(--color-neon-green)] transition-colors">
                            <i class="icon-user text-lg"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="bg-[var(--color-forest-green)] border-t border-white/10 shadow-md">
        <div class="container mx-auto px-4">
            <div class="flex items-center justify-between h-14 gap-4"> <div class="relative h-full flex items-center" @click.away="categoriesOpen = false">
                    <button @click="categoriesOpen = !categoriesOpen" class="flex items-center gap-2 px-4 h-10 bg-black/20 text-white font-bold text-[13px] uppercase rounded hover:bg-black/30 transition-colors">
                        <i class="icon-menu text-lg"></i>
                        <span class="hidden md:inline tracking-wide">Catégories</span>
                        <i class="icon-chevron-down text-xs ml-1"></i>
                    </button>

                    <div x-show="categoriesOpen"
                         class="absolute top-full left-0 mt-0 w-64 bg-white shadow-xl rounded-b-md overflow-hidden z-50 py-1 border-t-2 border-[var(--color-neon-green)]">
                        <a href="{{ route('category.show', 'ordinateurs-portables') }}" class="block px-4 py-3 hover:bg-gray-50 text-gray-700 text-sm font-medium border-b border-gray-100 last:border-0 transition-colors">Ordinateurs Portables</a>
                        <a href="{{ route('category.show', 'ordinateurs-bureau') }}" class="block px-4 py-3 hover:bg-gray-50 text-gray-700 text-sm font-medium border-b border-gray-100 last:border-0 transition-colors">Ordinateurs Bureau</a>
                        <a href="{{ route('category.show', 'accessoires') }}" class="block px-4 py-3 hover:bg-gray-50 text-gray-700 text-sm font-medium border-b border-gray-100 last:border-0 transition-colors">Accessoires & Périphériques</a>
                        <a href="{{ route('category.show', 'chargeurs') }}" class="block px-4 py-3 hover:bg-gray-50 text-gray-700 text-sm font-medium border-b border-gray-100 last:border-0 transition-colors">Chargeurs</a>
                        <a href="{{ route('category.show', 'batteries') }}" class="block px-4 py-3 hover:bg-gray-50 text-gray-700 text-sm font-medium border-b border-gray-100 last:border-0 transition-colors">Batteries</a>
                        <a href="{{ route('category.show', 'imprimantes') }}" class="block px-4 py-3 hover:bg-gray-50 text-gray-700 text-sm font-medium border-b border-gray-100 last:border-0 transition-colors">Imprimantes</a>
                        <a href="{{ route('category.show', 'multimedia') }}" class="block px-4 py-3 hover:bg-gray-50 text-gray-700 text-sm font-medium border-b border-gray-100 last:border-0 transition-colors">Multimédia</a>
                    </div>
                </div>

                <nav class="hidden lg:flex flex-1 items-center justify-center gap-8">
                    <a href="{{ route('home') }}" class="text-white font-bold text-sm uppercase tracking-wider hover:text-[var(--color-neon-green)] transition-colors py-4 border-b-2 border-transparent hover:border-[var(--color-neon-green)]">Accueil</a>
                    <a href="#" class="text-white font-bold text-sm uppercase tracking-wider hover:text-[var(--color-neon-green)] transition-colors py-4 border-b-2 border-transparent hover:border-[var(--color-neon-green)]">Boutique</a>
                    <a href="#" class="text-white font-bold text-sm uppercase tracking-wider hover:text-[var(--color-neon-green)] transition-colors py-4 border-b-2 border-transparent hover:border-[var(--color-neon-green)]">Promotions</a>
                    <a href="#" class="text-white font-bold text-sm uppercase tracking-wider hover:text-[var(--color-neon-green)] transition-colors py-4 border-b-2 border-transparent hover:border-[var(--color-neon-green)]">Contact</a>
                </nav>

                <div class="hidden md:block w-64 relative shrink-0">
                    <input type="text"
                           placeholder="Rechercher un produit..."
                           class="w-full pl-4 pr-10 py-2 rounded-sm border-0 bg-white text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-neon-green)] shadow-inner">
                    <button class="absolute right-0 top-0 h-full w-10 flex items-center justify-center hover:bg-gray-100 rounded-r-sm transition-colors">
                        <i class="icon-search text-[var(--color-forest-green)] text-lg"></i>
                    </button>
                </div>

                <button @click="mobileMenuOpen = !mobileMenuOpen" class="lg:hidden text-white">
                    <i class="icon-menu text-2xl"></i>
                </button>
            </div>
        </div>
    </div>

    <div x-show="mobileMenuOpen" class="lg:hidden bg-[var(--color-dark-green)] border-t border-white/20">
        <nav class="container mx-auto px-4 py-4 flex flex-col gap-4">
             <div class="relative">
                <input type="text" placeholder="Rechercher..." class="w-full px-4 py-2 rounded text-sm text-black">
                 <i class="icon-search absolute right-3 top-2.5 text-gray-500"></i>
            </div>
            <a href="{{ route('home') }}" class="text-[var(--color-neon-green)] font-bold text-sm uppercase border-b border-white/10 pb-2">Accueil</a>
            <a href="#" class="text-white font-bold text-sm uppercase hover:text-[var(--color-neon-green)] border-b border-white/10 pb-2">Boutique</a>
            <a href="#" class="text-white font-bold text-sm uppercase hover:text-[var(--color-neon-green)] border-b border-white/10 pb-2">Promotions</a>
            <a href="#" class="text-white font-bold text-sm uppercase hover:text-[var(--color-neon-green)]">Contact</a>
        </nav>
    </div>
</header>
