# Aspire - Vue 3 + Quasar + TypeScript Project

A modern Vue 3 application built with Quasar Framework, TypeScript, and organized SCSS architecture.

## 🚀 Features

- **Vue 3** with Composition API
- **Quasar Framework** for UI components
- **TypeScript** for type safety
- **Vue Router** with authentication guards
- **Pinia** for state management
- **SCSS** with organized architecture
- **Axios** for API calls
- **ESLint + Prettier** for code quality
- **Vitest** for testing

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format
```

## 📁 Project Structure

```
src/
├── api/
│   └── axios.ts              # Axios configuration
├── components/
│   └── ...                   # Vue components
├── composables/
│   └── ...                   # Vue composables
├── router/
│   └── index.ts             # Vue Router configuration
├── services/
│   └── ...                  # API services
├── stores/
│   └── ...                  # Pinia stores
├── styles/
│   ├── main.scss           # Main stylesheet
│   ├── _variables.scss     # SCSS variables
│   ├── _mixins.scss        # SCSS mixins
│   └── _utilities.scss     # Utility classes
├── views/
│   └── ...                 # Vue pages
├── App.vue                # Root component
└── main.ts               # Application entry point
```

## 🔐 Authentication

The application includes authentication guards in the router configuration. Routes can be protected using the `requiresAuth` meta property.

## 🔌 Services & API Calls

Services are simple wrappers around axios calls that return promises:

```typescript
// Example service usage
import authService from '@/services/authService'

const handleLogin = async () => {
  try {
    const response = await authService.login({
      email: 'user@example.com',
      password: 'password'
    })
    console.log('Login successful:', response.data)
  } catch (error) {
    console.error('Login failed:', error.response?.data)
  }
}
```

## 🎨 Styling

The project uses organized SCSS with variables, mixins, and utilities. Import styles in components:

```vue
<style lang="scss" scoped>
@import '../styles/variables';
@import '../styles/mixins';

.my-component {
  padding: $spacing-lg;
  color: $color-primary;
}
</style>
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code

## 🚀 Deployment

```bash
# Build the application
npm run build

# Deploy the contents of dist/ to your hosting provider
```