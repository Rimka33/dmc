# DMC Admin Panel - Complete Documentation

## 🎯 Overview
Complete admin dashboard for DMC e-commerce platform with modern UI/UX using React, Inertia, Tailwind CSS v4, and Lucide icons.

## 📁 Directory Structure

```
Admin/
├── Dashboard.jsx           # Main dashboard with KPIs and charts
├── Products/
│   ├── Index.jsx          # Products listing with search/filters
│   ├── Create.jsx         # Product creation form
│   └── Edit.jsx           # Product editing (optional)
├── Categories/
│   └── Index.jsx          # Categories management
├── Orders/
│   └── Index.jsx          # Orders listing and tracking
├── Customers.jsx          # Customer profiles and management
├── Reviews.jsx            # Review moderation
├── Questions.jsx          # Q&A management
├── Messages.jsx           # Support messages/inbox
├── Blog.jsx               # Blog articles management
├── Newsletter.jsx         # Newsletter and campaigns
├── Collections.jsx        # Product collections (featured, etc)
├── Pages.jsx              # Static pages (About, Contact, etc)
├── Banners.jsx            # Promotional banners
├── Settings/
│   └── Index.jsx          # General settings, roles, notifications
└── Auth/
    └── Login.jsx          # Admin login

Layouts/
└── AdminLayout.jsx        # Main layout with sidebar navigation

Components/Admin/
├── StatCard.jsx           # KPI statistics cards
├── DataTable.jsx          # Reusable data table with pagination
├── SearchFilter.jsx       # Search + Advanced filtering
├── StatusBadge.jsx        # Status indicators
├── FormField.jsx          # Form input wrapper
├── ConfirmDialog.jsx      # Confirmation modals
├── ChartCard.jsx          # Chart container
├── PageHeader.jsx         # Page title + breadcrumbs
├── Section.jsx            # Card section wrapper
├── ActionButtons.jsx      # Action button group
├── TagInput.jsx           # Tag input component
└── index.js               # Component exports
```

## 🎨 Design System

### Colors
- **Primary**: Forest Green (#058031)
- **Dark**: Dark Green (#011a0a)
- **Accent**: Neon Green (#00ff24)
- **Background**: Light Gray (#f5f5f7)

### Typography
- **Body**: Bai Jamjuree (400, 500, 600, 700)
- **Headings**: Montserrat (400, 700)

### Icons
- All icons from **Lucide React**
- 20-24px sizes for navigation
- 16-18px sizes for inline icons

## 🚀 Features Implemented

### 1. Dashboard (Dashboard.jsx)
- ✅ KPI cards (sales, orders, customers, avg cart)
- ✅ Sales trend chart (7-day history)
- ✅ Top products pie chart
- ✅ Recent orders table
- ✅ Low stock alerts
- ✅ Conversion rate, pending orders, daily visits

### 2. Products Management (Products/)
- ✅ Full CRUD operations
- ✅ Search by name/SKU
- ✅ Filter by status, category, stock
- ✅ Bulk actions
- ✅ Image gallery support
- ✅ Pricing and stock management
- ✅ Tags support (New, Bestseller, Deal, Featured)

### 3. Categories (Categories/)
- ✅ Hierarchical categories (parent/child)
- ✅ Category icons/images
- ✅ Display ordering
- ✅ Product count per category
- ✅ Active/Inactive toggle

### 4. Orders (Orders/)
- ✅ Order listing with filters
- ✅ Status workflow (pending → paid → preparing → shipped → delivered)
- ✅ Customer information
- ✅ Payment status tracking
- ✅ Date filtering

### 5. Customers (Customers.jsx)
- ✅ Customer profiles
- ✅ Order history
- ✅ Total spent tracking
- ✅ VIP/Risk marking
- ✅ Email and phone contacts

### 6. Reviews Moderation (Reviews.jsx)
- ✅ Review listing with ratings
- ✅ Approval/Rejection workflow
- ✅ Admin responses capability
- ✅ Hide reviews option
- ✅ Filter by rating and status

### 7. Q&A Management (Questions.jsx)
- ✅ Product questions listing
- ✅ Response tracking
- ✅ Public/Private visibility
- ✅ Author information

### 8. Support Messages (Messages.jsx)
- ✅ Message inbox
- ✅ Status workflow (new → in_progress → resolved)
- ✅ Customer contact info
- ✅ Quick reply capability

### 9. Blog (Blog.jsx)
- ✅ Article CRUD
- ✅ Draft/Published status
- ✅ View tracking
- ✅ Category organization

### 10. Newsletter (Newsletter.jsx)
- ✅ Subscriber management
- ✅ Campaign creation
- ✅ KPI tracking (open rate, click rate)
- ✅ Import/Export functionality
- ✅ Segmentation by behavior

### 11. Collections (Collections.jsx)
- ✅ Create featured product collections
- ✅ Bestsellers section
- ✅ New arrivals management
- ✅ Promotional collections

### 12. Pages (Pages.jsx)
- ✅ Static page management
- ✅ SEO fields
- ✅ Draft/Publish workflow

### 13. Banners (Banners.jsx)
- ✅ Promotional banner creation
- ✅ Time-based scheduling
- ✅ Multiple placements
- ✅ Active/Inactive toggle

### 14. Settings (Settings/Index.jsx)
- ✅ Store information (name, email, description)
- ✅ Contact details
- ✅ Social media links
- ✅ Payment methods configuration
- ✅ Role & Permission management
- ✅ Notification preferences

## 🧩 Reusable Components

### StatCard
```jsx
<StatCard 
  title="Ventes du mois"
  value="450,000 F"
  icon={DollarSign}
  trend={12}
  trendValue="+12%"
  color="amber"
/>
```

### DataTable
```jsx
<DataTable 
  columns={columns}
  data={data}
  pagination={pagination}
  emptyMessage="No results"
/>
```

### SearchFilter
```jsx
<SearchFilter 
  placeholder="Search..."
  filters={filterOptions}
  endpoint="/admin/products"
/>
```

### StatusBadge
```jsx
<StatusBadge status="active" />
<StatusBadge status="pending" size="lg" />
```

### FormField
```jsx
<FormField
  label="Product Name"
  name="name"
  type="text"
  error={errors.name}
  required
/>
```

## 🔄 Navigation Structure

**AdminLayout Sidebar Menu:**
1. Dashboard → `/admin/dashboard`
2. Catalogue
   - Products → `/admin/products`
   - Categories → `/admin/categories`
   - Collections → `/admin/collections`
3. Content
   - Blog → `/admin/blog`
   - Pages → `/admin/pages`
   - Banners → `/admin/banners`
4. Orders → `/admin/orders`
5. Customers → `/admin/customers`
6. Interactions
   - Reviews → `/admin/reviews`
   - Questions → `/admin/questions`
   - Messages → `/admin/messages`
7. Newsletter → `/admin/newsletter`
8. Settings → `/admin/settings`

## 🎯 To Integrate with Backend

### Required API Endpoints

**Products**
- `GET /api/admin/products` - List with pagination
- `POST /api/admin/products` - Create
- `GET /api/admin/products/{id}` - Get single
- `POST /api/admin/products/{id}` - Update
- `DELETE /api/admin/products/{id}` - Delete

**Orders**
- `GET /api/admin/orders` - List
- `GET /api/admin/orders/{id}` - Details
- `POST /api/admin/orders/{id}/status` - Update status

**Dashboard Stats**
- `GET /api/admin/dashboard/stats` - KPI data
- `GET /api/admin/dashboard/sales-data` - Chart data

**Similar endpoints for**: Categories, Customers, Reviews, Questions, Messages, Blog, Newsletter, etc.

## 🎨 Tailwind Configuration

Uses **Tailwind CSS v4** with:
- Custom color utilities (forest-green, dark-green, neon-green)
- Custom scrollbar styling
- Glassmorphism effects
- Smooth animations

## 📱 Responsive Design

- Mobile-first approach
- Sidebar collapses on mobile
- Tables scroll horizontally on small screens
- Grid layouts adapt to screen size

## ✨ UI Features

- ✅ Collapsible sidebar navigation
- ✅ Top header with notifications and user menu
- ✅ Breadcrumb navigation
- ✅ Search and advanced filtering
- ✅ Pagination with links
- ✅ Status badges with colors
- ✅ Hover effects and transitions
- ✅ Form validation error display
- ✅ Confirmation dialogs for destructive actions
- ✅ Loading states
- ✅ Empty states with helpful messages
- ✅ Action buttons with icons

## 🔐 Security Considerations

- All admin routes should require authentication
- Implement role-based access control
- CSRF protection on all forms
- Input validation on both client and server
- Sanitize user inputs to prevent XSS

## 📝 Next Steps

1. **Create backend controllers** for each admin module
2. **Define API routes** for data operations
3. **Implement authentication** and authorization
4. **Add form submission handling** with validation
5. **Create mock data** for testing
6. **Add export functionality** (CSV, Excel, PDF)
7. **Implement real-time notifications** for new orders
8. **Add activity logging** for audit trail
9. **Create advanced reporting** features
10. **Optimize performance** with pagination and caching