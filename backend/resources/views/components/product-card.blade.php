@props(['product'])


<div class="card-product group relative">
    <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 h-full flex flex-col items-center">
        <!-- Product Image -->
        <div class="relative overflow-hidden w-32 h-32 mx-auto mb-2">
            <a href="#">
                <img src="{{ $product['image'] }}"
                     alt="{{ $product['name'] }}"
                     class="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110">
            </a>

            @if(isset($product['badge']))
            <span class="absolute top-2 left-2 px-2 py-1 bg-[var(--color-red-accent)] text-white text-xs font-bold uppercase rounded">
                {{ $product['badge'] }}
            </span>
            @endif
        </div>

        <!-- Product Info -->
        <div class="w-full flex-1 flex flex-col items-center text-center space-y-2">
            @if(isset($product['category']))
            <p class="text-[var(--color-light-gray-text)] text-xs font-bold uppercase">{{ $product['category'] }}</p>
            @endif

            <h3 class="text-sm font-semibold text-gray-900 line-clamp-2 min-h-[40px]">
                <a href="#" class="hover:text-[var(--color-forest-green)] transition-colors">
                    {{ $product['name'] }}
                </a>
            </h3>

            <!-- Rating -->
            <div class="flex items-center gap-2 justify-center">
                <div class="flex text-yellow-400">
                    @for($i = 0; $i < 5; $i++)
                        <i class="icon-star text-xs {{ $i < $product['rating'] ? 'text-yellow-400' : 'text-gray-300' }}"></i>
                    @endfor
                </div>
                <span class="text-xs text-gray-500">({{ $product['reviewCount'] }})</span>
            </div>

            <!-- Price -->
            <div class="flex items-center gap-2 flex-wrap justify-center">
                @if(isset($product['originalPrice']))
                <span class="text-sm text-[var(--color-light-gray-text)] line-through">{{ number_format($product['originalPrice'], 0, ',', ' ') }} F.CFA</span>
                @endif

                @if(isset($product['priceRange']))
                <span class="text-base font-bold text-gray-900">
                    {{ number_format($product['priceRange']['min'], 0, ',', ' ') }} – {{ number_format($product['priceRange']['max'], 0, ',', ' ') }} F.CFA
                </span>
                @else
                <span class="text-base font-bold text-gray-900">{{ number_format($product['price'], 0, ',', ' ') }} F.CFA</span>
                @endif

                @if(isset($product['discount']))
                <span class="px-2 py-1 bg-[var(--color-red-accent)] text-white text-xs font-bold rounded">
                    -{{ $product['discount'] }}%
                </span>
                @endif
            </div>
        </div>

        <!-- Wishlist Icon -->
        <button class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[var(--color-neon-green)] mt-2">
            <i class="icon-heart text-gray-600 text-sm"></i>
        </button>
    </div>
</div>
