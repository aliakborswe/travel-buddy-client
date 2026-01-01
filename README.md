# 🌍 TravelBuddy - Find Your Perfect Travel Companion

<div align="center">

![TravelBuddy](https://img.shields.io/badge/TravelBuddy-v1.0.0-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

**Connect with like-minded travelers, plan amazing trips, and create unforgettable memories together.**

[Live Demo](#) • [Documentation](#features) • [Report Bug](#) • [Request Feature](#)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [User Roles](#-user-roles)
- [API Integration](#-api-integration)
- [Payment Integration](#-payment-integration)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 About

**TravelBuddy** is a modern, full-featured travel companion matching platform built with Next.js 16 and TypeScript. It helps travelers find compatible companions based on destinations, dates, budget, interests, and travel style. Whether you're planning a solo adventure, family trip, or group expedition, TravelBuddy connects you with the perfect travel partners.

### ✨ Why TravelBuddy?

- 🔐 **Safe & Verified**: User verification and premium badges for trusted connections
- 🤖 **Smart Matching**: Advanced algorithm matches travelers based on multiple criteria
- 💰 **Budget-Friendly**: Filter by budget range to find companions with similar spending habits
- 🌟 **Review System**: Rate and review travel companions after each trip
- 💳 **Premium Features**: Stripe-powered subscription for enhanced features
- 📱 **Fully Responsive**: Optimized for mobile, tablet, and desktop experiences

---

## 🎯 Features

### Core Features

#### 🏠 **Home & Landing**
- Beautiful, animated hero section with gradient backgrounds
- Feature showcases with hover effects
- Popular destinations display
- Testimonials and social proof
- FAQ section
- Pricing plans comparison

#### 🔐 **Authentication**
- User registration with validation (Zod schema)
- Secure login with JWT tokens
- Password requirements (uppercase, lowercase, number, special char)
- Redux-powered state management
- Auto-login with token refresh
- Test credentials provided for demo

#### 👤 **User Profiles**
- Create and edit detailed profiles
- Upload profile images (Cloudinary integration)
- Add travel interests and visited countries
- Display bio and current location
- Premium badge for subscribed users
- View other users' profiles
- Review system with star ratings

#### ✈️ **Travel Plans**
- Create detailed travel plans with:
  - Destination (country & city)
  - Date ranges (start & end)
  - Budget range with currency
  - Travel type (solo, family, friends, couple)
  - Itinerary and description
  - Maximum travelers limit
  - Interests/activities
- Edit and delete your plans
- View all personal plans
- Status management (planning, active, completed, cancelled)
- Join other travelers' plans

#### 🔍 **Search & Explore**
- Advanced search with multiple filters:
  - Destination search
  - Date range filtering
  - Travel type
  - Interests matching
- Pagination support
- Real-time results
- Detailed plan preview cards

#### 🤝 **Smart Matching**
- AI-powered matching algorithm
- Match score calculation based on:
  - Destination compatibility
  - Date overlap
  - Budget alignment
  - Common interests
  - Travel style
- Suggested matches on dashboard
- Dedicated matching page

#### 📊 **Dashboard**
- Statistics overview:
  - Active plans count
  - Planning stage plans
  - Completed trips
  - New matches available
- Upcoming plans list
- Suggested travel buddies
- Completed travels history
- Pending reviews section
- Premium upgrade prompts

#### ⭐ **Review System**
- Leave reviews for travel companions
- 5-star rating system
- Written feedback
- View reviews by user
- View reviews by travel plan
- Reviewable plans tracking
- Edit and delete reviews

#### 👑 **Premium Subscription**
- Monthly ($9.99) and Yearly ($99.99) plans
- Stripe payment integration
- Features include:
  - Unlimited travel plans
  - Verified badge
  - Priority matching
  - Advanced search filters
  - Direct messaging
  - Premium support
- Payment success/cancel pages
- Payment history

#### 🛡️ **Admin Panel**
- **User Management**:
  - View all users
  - Search by name/email
  - Filter by role
  - View user stats
  - Delete users
  - See premium/verified status
- **Plans Management**:
  - View all travel plans
  - Search by destination
  - Filter by status
  - Delete plans
  - Statistics overview

---

## 🛠 Tech Stack

### Frontend

| Technology | Description |
|------------|-------------|
| **Next.js 16** | React framework with App Router |
| **React 19** | Latest React with Server Components |
| **TypeScript** | Type-safe development |
| **Tailwind CSS 4** | Utility-first CSS framework |
| **Redux Toolkit** | State management |
| **React Redux** | Redux bindings for React |

### UI Components

| Library | Purpose |
|---------|---------|
| **Radix UI** | Accessible component primitives |
| **Lucide React** | Beautiful icon set |
| **Shadcn UI** | Re-usable component collection |
| **cmdk** | Command menu component |
| **date-fns** | Date utility library |
| **React Day Picker** | Date picker component |

### Forms & Validation

| Tool | Use Case |
|------|----------|
| **Zod** | Schema validation |
| **SweetAlert2** | Beautiful alerts & confirmations |

### Payment

| Service | Integration |
|---------|-------------|
| **Stripe** | Payment processing |
| **@stripe/stripe-js** | Stripe JavaScript SDK |
| **@stripe/react-stripe-js** | React components for Stripe |

### Development

| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting |
| **PostCSS** | CSS processing |
| **tw-animate-css** | Tailwind animation utilities |

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- **Git**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/travel-buddy-client.git
cd travel-buddy-client
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
travel-buddy-client/
├── public/                      # Static files
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/              # Authentication routes
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── about/               # About page
│   │   ├── admin/               # Admin panel
│   │   │   ├── plans/
│   │   │   └── users/
│   │   ├── dashboard/           # User dashboard
│   │   ├── explore/             # Search & explore
│   │   ├── matching/            # Find buddies
│   │   ├── payment/             # Payment flows
│   │   │   ├── cancel/
│   │   │   ├── checkout/
│   │   │   └── success/
│   │   ├── premium/             # Subscription
│   │   ├── profile/             # User profiles
│   │   │   ├── [id]/
│   │   │   └── edit/
│   │   ├── travel-plans/        # Travel plans
│   │   │   ├── [id]/
│   │   │   ├── add/
│   │   │   └── edit/
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   └── globals.css          # Global styles
│   ├── components/              # React components
│   │   ├── layout/
│   │   │   └── Navbar.tsx       # Navigation
│   │   ├── providers/           # Context providers
│   │   │   ├── AuthInitializer.tsx
│   │   │   ├── ReduxProvider.tsx
│   │   │   └── ToasterProvider.tsx
│   │   ├── reviews/             # Review components
│   │   │   ├── ReviewForm.tsx
│   │   │   └── ReviewsList.tsx
│   │   ├── ui/                  # Reusable UI components
│   │   └── ErrorBoundary.tsx
│   └── lib/                     # Utilities & config
│       ├── redux/               # Redux store
│       │   ├── slices/
│       │   │   ├── authSlice.ts
│       │   │   ├── paymentSlice.ts
│       │   │   ├── plansSlice.ts
│       │   │   └── reviewsSlice.ts
│       │   ├── hooks.ts
│       │   └── store.ts
│       ├── api-client.ts        # API client
│       ├── constants.ts         # Constants & endpoints
│       ├── sweetalert.ts        # Alert utilities
│       ├── types.ts             # TypeScript types
│       └── utils.ts             # Helper functions
├── .eslintrc.json               # ESLint config
├── next.config.ts               # Next.js config
├── package.json                 # Dependencies
├── postcss.config.mjs           # PostCSS config
├── tailwind.config.ts           # Tailwind config
└── tsconfig.json                # TypeScript config
```

---

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx

# Optional: Analytics, etc.
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Variable Descriptions

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key for payments | Yes (for premium) |

---

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server (localhost:3000)

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors automatically

# Type Checking
npm run type-check   # Run TypeScript compiler check
```

---

## 👥 User Roles

### 🧑 Regular User
- Create and manage travel plans
- Search and explore destinations
- Match with travel buddies
- Join other travelers' plans
- Leave reviews
- Edit profile
- Upgrade to premium

### 👑 Premium User
All regular features plus:
- Verified badge
- Unlimited travel plans
- Priority matching
- Advanced search filters
- Direct messaging
- Premium support

### 🛡️ Admin
All user features plus:
- Manage all users
- Delete users
- View user statistics
- Manage all travel plans
- Delete travel plans
- View platform analytics

### 🔑 Test Credentials

```
Admin Account:
Email: admin@gmail.com
Password: asd123!A

Regular User:
Email: aliakbor@gmail.com
Password: asd123!A
```

---

## 🔌 API Integration

### API Client

The app uses a custom API client (`lib/api-client.ts`) with:
- Automatic token management
- Request/response interceptors
- Error handling
- Token refresh on 401

### Endpoints

```typescript
// Authentication
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh-token

// Users
GET /users/me
GET /users/:id
PATCH /users/:id
GET /users

// Travel Plans
POST /travel-plans
GET /travel-plans
GET /travel-plans/search
GET /travel-plans/:id
PATCH /travel-plans/:id
DELETE /travel-plans/:id
POST /travel-plans/:id/join

// Reviews
POST /reviews
GET /reviews/user/:userId
GET /reviews/travel-plan/:travelPlanId
PATCH /reviews/:id
DELETE /reviews/:id
GET /reviews/reviewable

// Payments
POST /payments/create-intent
POST /payments/confirm
GET /payments/history

// Matching
GET /matching
GET /matching/suggested
```

---

## 💳 Payment Integration

### Stripe Setup

1. **Get Stripe Keys**
   - Sign up at [stripe.com](https://stripe.com)
   - Get publishable key from dashboard
   - Add to `.env.local`

2. **Payment Flow**
   ```
   User selects plan → Create payment intent → 
   Stripe checkout → Confirm payment → 
   Backend verifies → User gets premium
   ```

3. **Test Cards**
   ```
   Success: 4242 4242 4242 4242
   Decline: 4000 0000 0000 0002
   3D Secure: 4000 0025 0000 3155
   ```

---

## 🎨 Features Breakdown

### Responsive Design
- ✅ Mobile-first approach
- ✅ Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- ✅ Touch-friendly interactions
- ✅ Optimized images
- ✅ Flexible grids and layouts

### Performance
- ⚡ Next.js 16 App Router
- ⚡ Server Components
- ⚡ Automatic code splitting
- ⚡ Image optimization
- ⚡ Font optimization (Geist)

### Accessibility
- ♿ Semantic HTML
- ♿ ARIA labels
- ♿ Keyboard navigation
- ♿ Screen reader support
- ♿ Color contrast compliance

### Security
- 🔒 JWT authentication
- 🔒 Password validation
- 🔒 XSS protection
- 🔒 CSRF tokens
- 🔒 Secure payment processing

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new files
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages
- Add comments for complex logic

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Ali Akbor**

- Portfolio: [your-portfolio.com](#)
- GitHub: [@aliakbor](#)
- LinkedIn: [Ali Akbor](#)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Radix UI](https://www.radix-ui.com/) - Accessible components
- [Stripe](https://stripe.com/) - Payment processing
- [Vercel](https://vercel.com/) - Hosting platform

---

## 📸 Screenshots

### Home Page
Beautiful landing page with hero section, features, and CTAs.

### Dashboard
Comprehensive dashboard with statistics, upcoming plans, and matches.

### Travel Plans
Create and manage detailed travel plans with all necessary information.

### Matching System
Smart algorithm suggests compatible travel companions.

### Profile
Detailed user profiles with reviews, interests, and travel history.

### Admin Panel
Powerful admin interface for managing users and travel plans.

---

## 🐛 Known Issues

- None at the moment! Report bugs via GitHub Issues.

---

## 🗺️ Roadmap

- [ ] Real-time chat messaging
- [ ] Push notifications
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Social media integration
- [ ] Trip expense splitting
- [ ] Travel insurance integration
- [ ] Flight/hotel booking API

---

## 💬 Support

For support, email support@travelbuddy.com or join our Slack channel.

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by Ali Akbor

</div>
