# React Web Application

A modern React application built with Vite, Redux Toolkit, and role-based authentication.

## Features

- ⚡ **Vite** - Lightning fast development server and build tool
- ⚛️ **React 18** - Latest React with concurrent features
- 🗃️ **Redux Toolkit** - Efficient state management
- 🔐 **JWT Authentication** - Secure token-based auth with role-based access
- 🎨 **CSS Modules** - Scoped styling with no class name conflicts
- 📱 **Responsive Design** - Mobile-first responsive layouts
- 🚀 **Code Splitting** - Optimized bundle sizes

## Project Structure

```
src/
├── api/                    # API client with fetch wrapper
│   └── apiClient.js        # Centralized API calls with token handling
├── assets/
│   └── styles/
│       └── variables.css   # CSS custom properties (theming)
├── components/
│   ├── auth/               # Authentication components
│   │   ├── AuthGuard/      # Protected route wrapper
│   │   └── LoginForm/      # Login form with validation
│   ├── common/             # Reusable components
│   │   ├── Loader/         # Pure CSS loading spinners
│   │   ├── Modal/          # Generic modal component
│   │   └── Portal/         # React portal wrapper
│   └── layout/             # Layout components
│       ├── Header/         # App header with navigation
│       └── Footer/         # App footer
├── hooks/
│   └── useAuth.js          # Custom auth hook
├── pages/                  # Route pages
│   ├── Home/               # Public home page
│   ├── AllOrganisations/   # Admin dashboard
│   ├── OrgAdmin/           # Org admin dashboard
│   └── Search/             # User search page
├── store/
│   ├── index.js            # Redux store configuration
│   └── slices/
│       ├── authSlice.js    # Authentication state
│       └── uiSlice.js      # UI state (modals, loaders)
├── utils/
│   ├── constants.js        # App constants & routes
│   └── tokenUtils.js       # JWT token utilities
├── App.jsx                 # Main app component
├── main.jsx                # App entry point
└── index.css               # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repo-url>
cd React-Web
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Update `.env` with your API URL
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

5. Start development server
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Authentication Flow

1. User clicks "Login" button in header
2. Login modal opens with email/password form
3. On successful login, JWT token is stored in localStorage
4. User is redirected based on their role:
   - **Admin** → All Organisations page
   - **OrgAdmin** → Organisation Dashboard
   - **User** → Search page

### Token Handling

- Tokens are automatically attached to authenticated API requests
- Token expiration is checked before each request
- On token expiration, user is logged out and login modal appears
- Auth state is restored from token on page refresh

## Role-Based Access

| Role | Accessible Routes |
|------|-------------------|
| Admin | `/admin/organisations` |
| OrgAdmin | `/org-admin/dashboard` |
| User | `/search` |
| Public | `/` (Home) |

## API Client

The API client (`src/api/apiClient.js`) provides:

- Automatic Bearer token injection
- Token expiration handling
- Global loading state integration
- Public endpoint exemption
- Standardized error handling

```javascript
import { get, post } from './api/apiClient';

// Authenticated request
const data = await get('/users');

// Public request (no token)
const result = await post('/auth/login', credentials, { auth: false });
```

## Styling

This project uses CSS Modules for component-scoped styles.

### CSS Variables

All design tokens are defined in `src/assets/styles/variables.css`:

- Colors (primary, secondary, backgrounds)
- Typography (fonts, sizes, weights)
- Spacing & sizing
- Shadows & transitions
- Breakpoints

### Responsive Breakpoints

- Mobile: < 480px
- Tablet: < 768px
- Desktop: < 1024px
- Large: > 1024px

## Components

### Modal

Generic modal component using React Portals:

```jsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Modal Title"
  size="medium" // small | medium | large | fullscreen
>
  <YourContent />
</Modal>
```

### Loader

Pure CSS loader with multiple variants:

```jsx
<Loader 
  size="medium"      // small | medium | large
  variant="spinner"  // spinner | dots | pulse
  fullScreen={false}
  text="Loading..."
/>
```

### AuthGuard

Protect routes with role-based access:

```jsx
<AuthGuard allowedRoles={['Admin', 'OrgAdmin']}>
  <ProtectedPage />
</AuthGuard>
```

## License

MIT
