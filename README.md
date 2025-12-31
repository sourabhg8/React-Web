# React Web Application

A modern React application built with Vite, Redux Toolkit, and role-based authentication for managing organizations and users.

## Features

- ⚡ **Vite** - Lightning fast development server and build tool
- ⚛️ **React 18** - Latest React with concurrent features
- 🗃️ **Redux Toolkit** - Efficient state management
- 🔐 **JWT Authentication** - Secure token-based auth with role-based access
- 👥 **User Management** - Create, edit, delete, and reset passwords for users
- 🏢 **Organization Management** - Full CRUD operations for organizations
- 🔍 **Search** - Search functionality for all users
- 🎨 **CSS Modules** - Scoped styling with no class name conflicts
- 📱 **Responsive Design** - Mobile-first responsive layouts

## Project Structure

```
src/
├── api/                        # API client and services
│   ├── apiClient.js            # Centralized API calls with token handling
│   ├── organizationApi.js      # Organization API endpoints
│   └── userApi.js              # User API endpoints
├── assets/
│   └── styles/
│       └── variables.css       # CSS custom properties (theming)
├── components/
│   ├── auth/                   # Authentication components
│   │   ├── AuthGuard/          # Protected route wrapper
│   │   └── LoginForm/          # Login form with validation
│   ├── common/                 # Reusable components
│   │   ├── Loader/             # Pure CSS loading spinners
│   │   ├── Modal/              # Generic modal component
│   │   └── Portal/             # React portal wrapper
│   ├── layout/                 # Layout components
│   │   ├── Header/             # App header with navigation
│   │   └── Footer/             # App footer
│   ├── organization/           # Organization components
│   │   ├── OrganizationForm/   # Create/Edit organization form
│   │   └── OrganizationDeleteConfirmation/
│   ├── shared/                 # Shared UI components
│   │   ├── DataTable/          # Reusable data table
│   │   ├── icons.jsx           # Shared icon components
│   │   └── index.js            # Shared component exports
│   └── user/                   # User components
│       ├── UserForm/           # Create/Edit user form
│       └── UserDeleteConfirmation/
├── hooks/
│   └── useAuth.js              # Custom auth hook
├── pages/                      # Route pages
│   ├── Home/                   # Public home page
│   ├── AllOrganisations/       # Platform admin - org management
│   ├── Users/                  # User management page
│   └── Search/                 # User search page
├── store/
│   ├── index.js                # Redux store configuration
│   └── slices/
│       ├── authSlice.js        # Authentication state
│       ├── organizationSlice.js # Organization state
│       ├── uiSlice.js          # UI state (modals, loaders)
│       └── userSlice.js        # User state
├── utils/
│   ├── constants.js            # App constants & routes
│   └── tokenUtils.js           # JWT token utilities
├── App.jsx                     # Main app component
├── main.jsx                    # App entry point
└── index.css                   # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see net8-sample)

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
   - **Platform Admin** → All Organisations page
   - **Org Admin** → Users page (filtered by their org)
   - **User** → Search page

### Login Error Handling

| Error | Message Shown |
|-------|---------------|
| Invalid credentials | "Invalid username or password" |
| User disabled | "User account is disabled" |
| Org suspended | "Your organisation subscription is suspended. Please contact support." |
| Org cancelled | "Your organisation subscription has been cancelled. Please contact support." |

### Token Handling

- Tokens are automatically attached to authenticated API requests
- Token expiration is checked before each request
- On token expiration, user is logged out and login modal appears
- Auth state is restored from token on page refresh
- For public endpoints (like login), actual API error messages are shown

## Role-Based Access

| Role | Accessible Pages | Capabilities |
|------|------------------|--------------|
| `platform_admin` | All Organisations, Users (any org), Search | Full access to all organizations and users |
| `org_admin` | Users (own org), Search | Manage users in their organization |
| `org_user` | Search | Basic search access |

## Pages & Features

### All Organisations (`/admin/organisations`)
**Access:** Platform Admin only

- View paginated list of all organizations
- Search organizations by name
- Create new organizations
- Edit organization details (name, contact, subscription limits)
- Change organization status (active/suspended/cancelled)
- Delete organizations (soft delete)
- Navigate to users for any organization

### Users (`/users`)
**Access:** Platform Admin, Org Admin

- View paginated list of users for an organization
- Search users by name or email
- Create new users (password auto-generated)
- Edit user details (name, email, type, status)
- **Reset Password** - Reset user password to auto-generated value
- Delete users (soft delete)

**Password Auto-Generation:**
- Format: `{first4_email}_{first4_name}` (lowercase)
- Example: `john_john` for john.doe@example.com + John Doe

### Search (`/search`)
**Access:** All authenticated users

- Full-text search across searchable items
- Filter by category and type
- Paginated results

## API Integration

### API Client (`src/api/apiClient.js`)

Features:
- Automatic Bearer token injection
- Token expiration handling
- Global loading state integration
- Public endpoint exemption
- Proper error message handling (API messages shown for login errors)

```javascript
import { get, post, put, del } from './api/apiClient';

// Authenticated requests
const users = await get('/user?orgId=org_123');
const newUser = await post('/user?orgId=org_123&orgName=Acme', userData);
await put('/user/usr_123', updateData);
await del('/user/usr_123');

// Public request (no token)
const result = await post('/auth/login', credentials, { auth: false });
```

### User API (`src/api/userApi.js`)

```javascript
import { userApi } from './api/userApi';

// Get users
const users = await userApi.getAll(orgId, page, pageSize);
const user = await userApi.getById(userId);

// CRUD operations
await userApi.create(userData, orgId, orgName);
await userApi.update(userId, updateData);
await userApi.delete(userId);

// Reset password
await userApi.resetPassword(userId);
```

### Organization API (`src/api/organizationApi.js`)

```javascript
import { organizationApi } from './api/organizationApi';

// Get organizations
const orgs = await organizationApi.getAll(page, pageSize);
const org = await organizationApi.getById(orgId);

// CRUD operations
await organizationApi.create(orgData);
await organizationApi.update(orgId, updateData);
await organizationApi.delete(orgId);
```

## Components

### DataTable

Reusable table with loading, empty, and data states:

```jsx
<DataTable
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'actions', label: 'Actions' },
  ]}
  data={users}
  isLoading={isLoading}
  emptyState={<EmptyComponent />}
  renderRow={(item) => (
    <>
      <td>{item.name}</td>
      <td>{item.email}</td>
      <td><ActionButtons /></td>
    </>
  )}
  keyExtractor={(item) => item.id}
/>
```

### Action Buttons

Table row actions with icons:

```jsx
<ActionButtons>
  <ActionBtn icon={TableIcons.edit} onClick={handleEdit} title="Edit" />
  <ActionBtn icon={TableIcons.resetPassword} onClick={handleReset} title="Reset Password" variant="warning" />
  <ActionBtn icon={TableIcons.delete} onClick={handleDelete} title="Delete" variant="delete" />
</ActionButtons>
```

Available variants: `default`, `delete`, `warning`, `users`

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
<AuthGuard allowedRoles={['platform_admin', 'org_admin']}>
  <ProtectedPage />
</AuthGuard>
```

## Styling

### CSS Variables

All design tokens are defined in `src/assets/styles/variables.css`:

- Colors (primary, secondary, success, warning, error)
- Typography (fonts, sizes, weights)
- Spacing & sizing
- Shadows & transitions
- Breakpoints

### Responsive Breakpoints

- Mobile: < 480px
- Tablet: < 768px
- Desktop: < 1024px
- Large: > 1024px

## State Management

### Auth Slice
- User info, token, authentication status
- Login/logout actions
- Token restoration on page load

### Organization Slice
- Organizations list with pagination
- Selected organization
- CRUD operation states
- Modal controls (create/edit/delete)

### User Slice
- Users list with pagination
- Current organization context
- Selected user
- CRUD operation states
- Modal controls (create/edit/delete)

### UI Slice
- Global loader state
- Login modal state
- Toast notifications

## Test Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@platform.com | Admin@123 | Platform Admin |

## License

MIT
