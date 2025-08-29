# Private-Shirt.de - Modular Vue.js Application

This is a modern, modular Vue.js application for an e-commerce platform specializing in custom printed shirts and merchandise.

## 🏗️ Project Structure

The application has been refactored from a monolithic single-file structure into a modern, modular architecture following Vue.js and Nuxt.js best practices.

### 📁 Directory Structure

```
Private-Shirt/
├── app.vue                    # Main application layout
├── components/                # Reusable Vue components
│   ├── Header.vue            # Navigation header with cart
│   ├── Footer.vue            # Site footer
│   ├── NotificationBar.vue   # Top notification banner
│   ├── Cart.vue              # Shopping cart sidebar
│   └── DesignCreator.vue     # Product customization tool
├── pages/                     # Page components
│   ├── index.vue             # Home page
│   ├── ready-to-buy.vue      # Product catalog
│   ├── customization-creator.vue # Custom product creator
│   ├── product-detail.vue    # Individual product view
│   ├── grossbestellung.vue   # Bulk order form
│   ├── checkout.vue          # Checkout process
│   └── order-confirmation.vue # Order confirmation
├── composables/               # Vue 3 composables
│   ├── useWooCommerce.js     # WooCommerce API integration
│   └── useCart.js            # Cart management logic
├── assets/                    # Static assets
│   ├── css/
│   ├── images/
│   └── videos/
├── layouts/                   # Layout components
├── server/                    # Server-side API
└── public/                    # Public static files
```

## 🚀 Features

### Core Functionality
- **Product Catalog**: Browse ready-to-buy and customizable products
- **Shopping Cart**: Full cart management with saved items and recently viewed
- **Product Customization**: Built-in design creator for custom products
- **Checkout Process**: Multi-step checkout with shipping and payment
- **Bulk Orders**: Special form for business customers
- **WooCommerce Integration**: Full e-commerce backend integration

### Technical Features
- **Modular Architecture**: Clean separation of concerns
- **Composables**: Reusable logic with Vue 3 Composition API
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **State Management**: Local storage persistence
- **Error Handling**: Graceful error states and fallbacks
- **Performance**: Optimized loading and transitions

## 🛠️ Technology Stack

- **Frontend**: Vue.js 3 with Composition API
- **Styling**: Tailwind CSS
- **E-commerce**: WooCommerce REST API
- **State Management**: Vue 3 reactive system
- **Build Tool**: Vite (via Nuxt.js)
- **Deployment**: Static site generation ready

## 📦 Components Overview

### Core Components

#### `Header.vue`
- Navigation menu with logo
- Shopping cart icon with item count
- Responsive mobile menu
- Submenu for product categories

#### `Footer.vue`
- Company information and links
- Social media integration
- Legal pages and contact info

#### `Cart.vue`
- Shopping cart sidebar
- Item quantity management
- Saved for later functionality
- Recently viewed products
- Free shipping progress indicator

#### `NotificationBar.vue`
- Rotating promotional messages
- Smooth transitions
- Responsive design

### Page Components

#### `pages/index.vue` (Home Page)
- Hero section with video background
- Product carousels (Bestsellers, Summer collection)
- Feature sections (Creator, Corporate, Events)
- Customer testimonials
- Store locations

#### `pages/ready-to-buy.vue` (Product Catalog)
- Category filtering
- Search and sort functionality
- Product grid with hover effects
- Pagination
- Loading skeletons

#### `pages/customization-creator.vue`
- Product customization interface
- Design tools integration
- Category filtering for customizable products

#### `pages/product-detail.vue`
- Product image gallery
- Size and color selection
- Product information tabs
- Add to cart functionality
- Related products

#### `pages/grossbestellung.vue`
- Bulk order form
- File upload for designs
- Business benefits showcase

#### `pages/checkout.vue`
- Multi-step checkout process
- Shipping address form
- Payment method selection
- Order review and confirmation

## 🔧 Composables

### `useWooCommerce.js`
Provides WooCommerce API integration:
- Product fetching and formatting
- Category management
- Error handling and fallbacks
- Image fallback system

### `useCart.js`
Manages shopping cart functionality:
- Cart state management
- Local storage persistence
- Cart calculations (total, shipping, etc.)
- Recently viewed products
- Saved for later items

## 🎨 Design System

### Color Palette
- **Primary**: `#D8127D` (Pink)
- **Secondary**: `#0a3a47` (Dark Blue)
- **Accent**: `#ffd44d` (Yellow)
- **Neutral**: Gray scale

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800

### Components
- Consistent button styles with hover states
- Form inputs with focus states
- Card layouts with shadows
- Responsive grid systems

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   - Configure WooCommerce API credentials
   - Set up environment variables

3. **Development**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔒 Security

- API keys are stored securely
- Input validation on all forms
- XSS protection
- CSRF protection for forms

## 🚀 Performance

- Lazy loading for images
- Optimized bundle splitting
- Efficient state management
- Minimal re-renders
- Cached API responses

## 🤝 Contributing

1. Follow the modular architecture
2. Use composables for reusable logic
3. Maintain consistent styling with Tailwind
4. Add proper error handling
5. Test responsive design

## 📄 License

This project is proprietary software for Private-Shirt.de

---

**Note**: This application has been refactored from a monolithic structure to a modern, modular Vue.js application while maintaining all original functionality and design.
