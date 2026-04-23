# DMC Computer - E-commerce Website

A modern e-commerce website for DMC Computer Store built with Laravel, Tailwind CSS v4, and Alpine.js.

## 🎨 Design Features

- **Dark Tech Aesthetic**: Neon green (#00ff24) and black color scheme
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Components**: Alpine.js for dynamic interactions
- **Modern UI**: Product cards, countdown timers, category grids, and more

## 🚀 Tech Stack

- **Backend**: Laravel 12
- **Frontend**: Blade Templates
- **Styling**: Tailwind CSS v4
- **JavaScript**: Alpine.js
- **Icons**: Lucide Icons (via CDN)
- **Fonts**: Bai Jamjuree, Montserrat (Google Fonts)

## 📦 Installation

### Prerequisites
- PHP 8.3+
- Composer
- Node.js 20+
- npm

### Setup Steps

1. **Install PHP Dependencies** (if not already done):
```bash
composer install
```

2. **Install Node Dependencies**:
```bash
npm install
```

3. **Configure Environment**:
```bash
# Copy .env.example to .env if not exists
cp .env.example .env

# Generate application key
php artisan key:generate
```

4. **Build Assets**:
```bash
# Development
npm run dev

# Production
npm run build
```

5. **Start Development Server**:
```bash
php artisan serve
```

Visit `http://localhost:8000` to see the website.

## 📁 Project Structure

```
├── app/
│   └── Http/Controllers/
│       └── HomeController.php          # Homepage controller with mock data
├── resources/
│   ├── css/
│   │   └── app.css                     # Tailwind v4 config & custom styles
│   ├── js/
│   │   └── app.js                      # JavaScript entry point
│   └── views/
│       ├── layouts/
│       │   └── app.blade.php           # Main layout
│       ├── components/
│       │   ├── header.blade.php        # Header with navigation
│       │   ├── footer.blade.php        # Footer with links
│       │   └── product-card.blade.php  # Reusable product card
│       └── home.blade.php              # Homepage view
├── public/
│   └── images/                         # All product images and assets
├── routes/
│   └── web.php                         # Web routes
├── postcss.config.js                   # PostCSS configuration
└── vite.config.js                      # Vite configuration
```

## 🎯 Key Components

### Header Component
- Mobile-responsive navigation with hamburger menu
- Category dropdown
- Search bar
- Shopping cart with badge
- User account icon

### Product Card Component
- Product image with hover effects
- Rating display
- Price formatting
- Wishlist button
- Badge support (New, Sale, etc.)

### Countdown Timer
- Alpine.js powered countdown
- Shows days, hours, minutes, seconds
- Auto-updates every second

### Special Offers Section
- Product cards with countdown timers
- Stock availability indicators
- Progress bars showing sold percentage
- Feature lists with checkmarks

## 🎨 Design Tokens

All design tokens are defined in `resources/css/app.css`:

### Colors
- `--color-neon-green`: #00ff24 (Primary)
- `--color-forest-green`: #108043
- `--color-dark-green`: #058031
- `--color-pure-black`: #000000
- `--color-red-accent`: #ff0000

### Typography
- Primary: 'Bai Jamjuree'
- Secondary: 'Montserrat'

### Spacing & Borders
- Custom radius values
- Shadow definitions
- Consistent spacing scale

## 🔧 Customization

### Adding New Products
Edit the mock data in `app/Http/Controllers/HomeController.php`:

```php
$featuredProducts = [
    [
        'id' => 1,
        'name' => 'Product Name',
        'image' => asset('images/products/product.png'),
        'price' => 100000,
        'rating' => 5,
        'reviewCount' => 10,
    ],
];
```

### Modifying Styles
All custom styles are in `resources/css/app.css`. The file uses Tailwind v4's `@theme` directive for design tokens.

### Adding New Sections
Create new Blade components in `resources/views/components/` and include them in `home.blade.php`.

## 🌐 Alpine.js Components

### Countdown Timer
```javascript
x-data="countdown('2025-12-31T23:59:59')"
```

### Mobile Menu
```javascript
x-data="{ mobileMenuOpen: false }"
@click="mobileMenuOpen = !mobileMenuOpen"
```

### Dropdown
```javascript
x-data="{ categoriesOpen: false }"
@click.away="categoriesOpen = false"
```

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🎭 Icons

Icons are loaded from Lucide Icons CDN. Usage:
```html
<i class="icon-shopping-cart"></i>
<i class="icon-heart"></i>
<i class="icon-search"></i>
```

## 🚀 Production Deployment

1. Build assets:
```bash
npm run build
```

2. Optimize Laravel:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

3. Set environment to production in `.env`:
```
APP_ENV=production
APP_DEBUG=false
```

## 📝 Notes

- All product images are stored in `public/images/`
- Mock data is used for demonstration
- Replace with actual database queries when integrating backend
- Countdown timers use Alpine.js for real-time updates
- All colors follow the dark tech aesthetic theme

## 🤝 Contributing

This is a custom-built e-commerce website for DMC Computer Store. For modifications or enhancements, update the relevant Blade components and controllers.

## 📄 License

Proprietary - DMC Computer Store © 2025