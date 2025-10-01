# 🍔 MyBurger - React Burger Builder

A modern React application for building custom burgers with Firebase integration.

## 🚀 Features

- **Interactive Burger Builder** - Add/remove ingredients with real-time visual updates
- **Dynamic Pricing** - Live price calculation based on selected ingredients
- **Order Summary Modal** - Review order before submission
- **Professional UI** - Modern design with responsive layout
- **Firebase Ready** - Configured for Firebase Realtime Database integration
- **TypeScript** - Full type safety throughout the application

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Axios** for HTTP requests
- **Firebase** for backend services
- **CSS3** with modern styling and animations

## 📁 Project Structure

```
src/
├── components/
│   ├── Burger/                 # Burger visualization components
│   │   ├── Burger.tsx
│   │   ├── BurgerIngredient/
│   │   ├── BuildControls/
│   │   └── OrderSummary/
│   ├── Layout/                 # App layout wrapper
│   ├── Navigation/             # Header navigation
│   │   ├── Toolbar/
│   │   ├── NavigationItems/
│   │   └── NavigationItem/
│   └── UI/                     # Reusable UI components
│       ├── Modal/
│       └── Backdrop/
├── config/                     # Configuration files
│   ├── firebase.ts
│   └── constants.ts
├── services/                   # API services
│   ├── api.ts
│   └── orderService.ts
├── types/                      # TypeScript type definitions
│   └── index.ts
└── containers/                 # Smart components
    └── App.tsx
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd react-course
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

## 🔥 Firebase Integration

### Current Status
- ✅ Firebase configuration ready
- ✅ Axios instance configured
- ✅ Order service prepared
- ⏳ Ready for activation (uncomment in BurgerBuilder.tsx)

### Firebase Setup
1. **Database URL**: `https://burger-react-course-ad413-default-rtdb.firebaseio.com`
2. **Collection Path**: `/burger-db/orders`
3. **Order Structure**:
   ```typescript
   {
     ingredients: { salad: number, bacon: number, cheese: number, meat: number },
     price: number,
     customer: {
       name: string,
       email: string,
       address: { street: string, zipCode: string, country: string },
       deliveryMethod: 'fastest' | 'cheapest'
     }
   }
   ```

### Activating Firebase Integration
To enable Firebase integration:

1. **Uncomment the OrderService import** in `BurgerBuilder.tsx`:
   ```typescript
   import OrderService from '../../services/orderService'
   ```

2. **Uncomment the Firebase call** in `purchaseContinueHandler`:
   ```typescript
   const result = await OrderService.createOrder(orderData);
   ```

## 🎯 Component Features

### Burger Builder
- **Ingredient Controls**: Add/remove ingredients with price updates
- **Visual Burger**: Real-time burger visualization with realistic ingredients
- **Minimum Meat Rule**: Always maintains at least 1 meat patty
- **Order Modal**: Professional order summary with cancel/continue options

### Navigation
- **Fixed Toolbar**: Professional header with logo and navigation
- **Responsive Design**: Adapts to mobile and desktop
- **Ready for Routing**: Prepared for React Router integration

### UI Components
- **Modal System**: Backdrop + modal with smooth animations
- **Reusable Components**: Modular, typed components

## 🔍 Best Practices Applied

- ✅ **TypeScript**: Full type safety with shared interfaces
- ✅ **Component Architecture**: Separation of concerns (containers vs components)
- ✅ **CSS Organization**: Kebab-case naming, component-scoped styles
- ✅ **Error Handling**: Proper try-catch blocks and user feedback
- ✅ **Code Organization**: Logical file structure and imports
- ✅ **Performance**: Optimized re-renders and state management

## 🚀 Next Steps

1. **Activate Firebase Integration**
2. **Add Customer Form** for order details
3. **Implement React Router** for navigation
4. **Add Loading States** for async operations
5. **Create Orders History** page
6. **Add Authentication** for user accounts

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Design Features

- **Professional Color Scheme**: Browns and oranges matching burger theme
- **Smooth Animations**: Modal transitions and hover effects
- **Responsive Layout**: Mobile-first design approach
- **Accessibility**: Proper focus management and keyboard navigation

---

**Ready for Firebase integration! 🔥**