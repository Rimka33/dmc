# DMC Admin Panel - Installation & Setup Guide

## ✅ What's Implemented

### 1. **Core Admin Infrastructure**
- ✅ Modern AdminLayout with collapsible sidebar
- ✅ Top header with notifications and user menu
- ✅ Responsive mobile-first design
- ✅ Breadcrumb navigation
- ✅ Complete menu structure with submenus

### 2. **Reusable Components** (11 components)
- ✅ `StatCard` - KPI statistics with trends
- ✅ `DataTable` - Sortable/filterable tables with pagination
- ✅ `SearchFilter` - Advanced search and filtering
- ✅ `StatusBadge` - Status indicators with colors
- ✅ `FormField` - Form input wrapper with validation
- ✅ `ConfirmDialog` - Confirmation modals
- ✅ `ChartCard` - Chart container
- ✅ `PageHeader` - Page titles with breadcrumbs
- ✅ `Section` - Card section wrapper
- ✅ `ActionButtons` - Action button groups
- ✅ `TagInput` - Tag input with suggestions

### 3. **Admin Pages** (14 pages fully implemented)

#### Dashboard
- KPI cards (Sales, Orders, Customers, Avg Cart Value)
- Sales trend chart (7-day history)
- Top products pie chart
- Recent orders table
- Low stock alerts
- Conversion rate, pending orders, daily visits

#### Products Management
- ✅ List with search, filters, pagination
- ✅ Create new products with images
- ✅ Edit existing products
- ✅ Category, pricing, stock management
- ✅ Tags support (New, Bestseller, Deal, Featured)

#### Categories
- ✅ Hierarchical management (parent/child)
- ✅ Icons/images support
- ✅ Display ordering
- ✅ Active/Inactive toggle

#### Orders
- ✅ Order listing with filters
- ✅ Status tracking (pending, paid, preparing, shipped, delivered, etc)
- ✅ Customer information
- ✅ Payment status

#### Customers
- ✅ Customer profiles
- ✅ Order history and total spent
- ✅ VIP/Risk marking
- ✅ Contact information

#### Content Management
- ✅ Blog - Articles CRUD
- ✅ Pages - Static pages management
- ✅ Banners - Promotional banners with scheduling
- ✅ Collections - Product collections (featured, bestsellers, etc)

#### Support & Interactions
- ✅ Reviews - Moderation interface
- ✅ Questions - Q&A management
- ✅ Messages - Support inbox

#### Newsletter
- ✅ Subscriber management
- ✅ Campaign creation and tracking
- ✅ KPI dashboard (open rate, click rate)
- ✅ Import/Export

#### Settings
- ✅ General settings (store name, contact, description)
- ✅ Social media links
- ✅ Payment methods
- ✅ Roles & Permissions
- ✅ Notifications preferences

## 🎨 Design System

### Color Palette (Matches Client Site)
```
- Primary: Forest Green (#058031)
- Dark: Dark Green (#011a0a)
- Accent: Neon Green (#00ff24)
- Background: Light Gray (#f5f5f7)
```

### Typography
- Body: Bai Jamjuree
- Headings: Montserrat
- Already configured in `resources/css/app.css`

### Icons
- Lucide React icons throughout
- Already in `package.json`

## 📋 File Structure

```
resources/js/
├── Pages/Admin/
│   ├── Dashboard.jsx              # Main dashboard
│   ├── Products/
│   │   ├── Index.jsx              # List products
│   │   ├── Create.jsx             # Add product
│   │   └── Edit.jsx               # Edit product
│   ├── Categories/
│   │   ├── Index.jsx              # List categories
│   │   ├── Create.jsx             # Add category
│   │   └── Edit.jsx               # Edit category
│   ├── Orders/
│   │   └── Index.jsx              # List orders
│   ├── Customers.jsx              # Customers management
│   ├── Reviews.jsx                # Review moderation
│   ├── Questions.jsx              # Q&A management
│   ├── Messages.jsx               # Support inbox
│   ├── Blog.jsx                   # Blog articles
│   ├── Newsletter.jsx             # Newsletter management
│   ├── Collections.jsx            # Product collections
│   ├── Pages.jsx                  # Static pages
│   ├── Banners.jsx                # Promotional banners
│   ├── Settings/
│   │   └── Index.jsx              # Settings page
│   ├── Auth/
│   │   └── Login.jsx              # Admin login
│   └── README.md                  # Admin documentation
│
├── Layouts/
│   └── AdminLayout.jsx            # Main layout (sidebar, header)
│
└── Components/Admin/
    ├── StatCard.jsx               # KPI card component
    ├── DataTable.jsx              # Table component
    ├── SearchFilter.jsx           # Search & filters
    ├── StatusBadge.jsx            # Status indicator
    ├── FormField.jsx              # Form field wrapper
    ├── ConfirmDialog.jsx          # Confirmation modal
    ├── ChartCard.jsx              # Chart wrapper
    ├── PageHeader.jsx             # Page header
    ├── Section.jsx                # Card section
    ├── ActionButtons.jsx          # Action buttons
    ├── TagInput.jsx               # Tag input
    └── index.js                   # Component exports
```

## 🔧 Integration Steps

### 1. **Create Laravel Backend Routes** (routes/web.php)

```php
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    // Dashboard
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
    
    // Products
    Route::resource('products', AdminProductController::class);
    
    // Categories
    Route::resource('categories', AdminCategoryController::class);
    
    // Orders
    Route::resource('orders', AdminOrderController::class)->only(['index', 'show', 'update']);
    
    // Customers
    Route::resource('customers', AdminCustomerController::class)->only(['index', 'show']);
    
    // Reviews
    Route::resource('reviews', AdminReviewController::class)->only(['index', 'update']);
    
    // Questions
    Route::resource('questions', AdminQuestionController::class);
    
    // Messages
    Route::resource('messages', AdminMessageController::class)->only(['index', 'show', 'update']);
    
    // Blog
    Route::resource('blog', AdminBlogController::class);
    
    // Newsletter
    Route::get('/newsletter', [AdminNewsletterController::class, 'index']);
    Route::post('/newsletter/campaign', [AdminNewsletterController::class, 'createCampaign']);
    
    // Collections
    Route::resource('collections', AdminCollectionController::class);
    
    // Pages
    Route::resource('pages', AdminPageController::class);
    
    // Banners
    Route::resource('banners', AdminBannerController::class);
    
    // Settings
    Route::get('/settings', [AdminSettingsController::class, 'index'])->name('admin.settings');
    Route::post('/settings', [AdminSettingsController::class, 'update']);
});
```

### 2. **Create Controllers**

Example structure:
```php
<?php
namespace App\Http\Controllers\Admin;

use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'month_sales' => 450000,
                'orders_count' => 125,
                'total_customers' => 892,
                'avg_cart_value' => 42500,
                'sales_trend' => 12,
                'orders_trend' => 5,
                'customers_trend' => 8,
                'pending_orders' => 8,
                'today_visits' => 1240,
                'recent_orders' => [],
                'low_stock_products' => [],
            ]
        ]);
    }
}
```

### 3. **Database Models & Migrations**

Required models:
- Product (with ProductImage, ProductTag relationships)
- Category
- Order (with OrderItem relationship)
- Customer
- Review
- Question
- Message
- BlogArticle
- NewsletterSubscriber
- NewsletterCampaign
- Collection
- Page
- Banner

### 4. **API Response Format**

Ensure your controllers return data matching the component expectations:

```php
// For paginated lists
return Inertia::render('Admin/Products/Index', [
    'products' => Product::paginate(15),
    'filters' => $request->all(),
]);

// For single resources
return Inertia::render('Admin/Products/Edit', [
    'product' => $product,
    'categories' => Category::all(),
]);
```

## 🚀 Getting Started

1. **Review the implementation** in `resources/js/Pages/Admin/`
2. **Create backend routes** (see Integration Steps)
3. **Create controllers** returning Inertia responses
4. **Create database models** and migrations
5. **Add authentication middleware** to admin routes
6. **Test with your backend data**

## 📊 Features Ready to Use

- ✅ Modern responsive UI
- ✅ All CRUD forms built
- ✅ Search & filter logic in place
- ✅ Pagination ready
- ✅ Status management UI
- ✅ Image upload UI (needs backend)
- ✅ Form validation display
- ✅ Error handling
- ✅ Empty states
- ✅ Loading states
- ✅ Confirmation dialogs

## ⚙️ Configuration

### Tailwind CSS v4
Already configured in `resources/css/app.css`:
```css
@import "tailwindcss";
```

### Color Classes Available
- `.bg-forest-green` / `.text-forest-green`
- `.bg-dark-green` / `.text-dark-green`
- `.bg-neon-green` / `.text-neon-green`

### Icons
Import from 'lucide-react':
```jsx
import { ShoppingBag, Plus, Edit, Trash2 } from 'lucide-react';
```

## 📱 Responsive Breakpoints

Components use Tailwind breakpoints:
- `md:` - Medium screens (768px+)
- `lg:` - Large screens (1024px+)

Sidebar collapses on mobile automatically.

## 🔒 Security Checklist

- [ ] Add authentication middleware to routes
- [ ] Implement role-based access control
- [ ] Add CSRF protection
- [ ] Validate all inputs server-side
- [ ] Sanitize user inputs
- [ ] Add rate limiting
- [ ] Enable HTTPS
- [ ] Add activity logging
- [ ] Implement soft deletes for data

## 📝 Next Steps

1. Create backend controllers
2. Create database migrations
3. Implement API endpoints
4. Add authentication
5. Add image upload handling
6. Add export functionality (CSV, PDF)
7. Add real-time notifications
8. Add activity logging
9. Add advanced reporting
10. Optimize performance

## 🎯 Tips for Success

1. **Use the components** - Don't recreate them, reuse!
2. **Follow the pattern** - Each page follows same structure
3. **Test with real data** - Make sure pagination works
4. **Mobile first** - Test on mobile devices
5. **Accessibility** - Ensure WCAG compliance

## 📞 Support

For detailed component documentation, see [resources/js/Pages/Admin/README.md](resources/js/Pages/Admin/README.md)

---

**Last Updated**: December 2025
**Version**: 1.0
**Status**: ✅ Production Ready (Frontend)