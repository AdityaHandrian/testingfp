# Phase 1: Setup & Structure Implementation

## Objective
Update the application structure, constants, routing, and navigation for the new "Product Recommendation System Demo" website.

## Tasks

### Task 1.1: Update src/utils/constants.js

**Current Status:**
- APP_NAME is "RecSystem - Tokopedia Product Recommender"
- Routes include HOME, LOGIN, SIGNUP, RECOMMENDATION, SENTIMENT, DASHBOARD
- Has SENTIMENT_LABELS and FEATURES constants

**Changes Required:**

```javascript
// ======================= ROUTES =======================
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  CATALOG: '/catalog',              // NEW
  USERS: '/users',                  // NEW
  RECOMMENDATION: '/recommendation',
  SENTIMENT: '/sentiment-analysis',
  DASHBOARD: '/dashboard',
};

// ======================= APP INFO =======================
export const APP_NAME = 'Product Recommendation System Demo';  // CHANGED
export const APP_DESCRIPTION = 'Sistem Rekomendasi Produk berbasis Kecerdasan Buatan';

// ======================= RECOMMENDATION ALGORITHMS =======================
export const ALGORITHMS = {
  NCF: {
    id: 'ncf',
    name: 'Nearest Collaborative Filtering',
    description: 'Rekomendasi berdasarkan kesamaan pengguna',
    color: 'blue',
  },
  CBF: {
    id: 'cbf',
    name: 'Content-Based Filtering',
    description: 'Rekomendasi berdasarkan fitur produk',
    color: 'purple',
  },
  SVD: {
    id: 'svd',
    name: 'Singular Value Decomposition',
    description: 'Rekomendasi berbasis matrix factorization',
    color: 'green',
  },
  KNN: {
    id: 'knn',
    name: 'K-Nearest Neighbors',
    description: 'Rekomendasi berbasis k-tetangga terdekat',
    color: 'orange',
  },
};

// ======================= SENTIMENT LABELS =======================
export const SENTIMENT_LABELS = {
  positive: { label: 'Positif', color: 'green', icon: '😊' },
  neutral: { label: 'Netral', color: 'yellow', icon: '😐' },
  negative: { label: 'Negatif', color: 'red', icon: '😞' },
};

// ======================= FEATURES =======================
export const FEATURES = {
  SENTIMENT: 'sentiment',
  COLLABORATIVE: 'collaborative',
  SVD: 'svd',
  KNN: 'knn',
  // REMOVE: MOCK_DATA (we use real API only)
};
```

**Success Criteria:**
- ✅ New routes CATALOG and USERS added
- ✅ APP_NAME updated to "Product Recommendation System Demo"
- ✅ ALGORITHMS constant with NCF, CBF, SVD, KNN defined
- ✅ No MOCK_DATA feature flag (real API only)

---

### Task 1.2: Update src/App.jsx

**Changes Required:**

1. Import new pages:
```javascript
import Catalog from './pages/Catalog';    // NEW
import Users from './pages/Users';        // NEW
```

2. Add new routes in the Routes component:
```jsx
<Route path={ROUTES.CATALOG} element={<Catalog />} />
<Route path={ROUTES.USERS} element={<Users />} />
```

3. Complete Route structure should look like:
```jsx
<Routes>
  <Route path={ROUTES.HOME} element={<Home />} />
  <Route path={ROUTES.LOGIN} element={<Login />} />
  <Route path={ROUTES.SIGNUP} element={<Signup />} />
  <Route path={ROUTES.CATALOG} element={<Catalog />} />
  <Route path={ROUTES.USERS} element={<Users />} />
  <Route path={ROUTES.RECOMMENDATION} element={<Recommendation />} />
  <Route path={ROUTES.SENTIMENT} element={<SentimentAnalysis />} />
  <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
  <Route path="*" element={<div className="text-center mt-20"><h1>404 - Page Not Found</h1></div>} />
</Routes>
```

**Success Criteria:**
- ✅ Catalog and Users routes added
- ✅ App.jsx imports new pages
- ✅ No errors in console
- ✅ Navigation between pages works

---

### Task 1.3: Update src/components/Navbar.jsx

**Current Status:**
- Shows Home, Features, About, Login/Signup buttons
- Includes user menu when authenticated

**Changes Required:**

1. Add navigation links to Catalog and Users (visible only when authenticated)
2. Update navbar to include:
   - Home (always visible)
   - Features (always visible) 
   - About (always visible)
   - **Catalog (visible when authenticated) - NEW**
   - **Users (visible when authenticated) - NEW**
   - Login/Signup (visible when not authenticated)
   - User menu (visible when authenticated)

3. Example structure for authenticated user navigation:
```jsx
{isAuthenticated && (
  <div className="hidden md:flex items-center space-x-4">
    <Link to={ROUTES.CATALOG} className="text-gray-700 hover:text-gray-900">Catalog</Link>
    <Link to={ROUTES.USERS} className="text-gray-700 hover:text-gray-900">Users</Link>
    <Link to={ROUTES.RECOMMENDATION} className="text-gray-700 hover:text-gray-900">Recommendations</Link>
  </div>
)}
```

**Success Criteria:**
- ✅ Catalog and Users links appear when logged in
- ✅ Links hidden when not logged in
- ✅ Navbar responsive on mobile
- ✅ Active link highlighting works

---

### Task 1.4: Create Placeholder Pages

**Create src/pages/Catalog.jsx:**

```javascript
import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { Loader, AlertCircle } from 'lucide-react';

export default function Catalog() {
  const { isAuthenticated } = useAuthContext();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      // TODO: Fetch items from API endpoint: GET /api/items
      // setIsLoading(true);
      // try {
      //   const response = await axios.get('/api/items');
      //   setItems(response.data);
      // } catch (err) {
      //   setError(err.message);
      // } finally {
      //   setIsLoading(false);
      // }
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold">Catalog</h1>
        <p className="text-gray-600">Silakan login terlebih dahulu untuk melihat katalog produk.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Katalog Produk</h1>
      
      {isLoading && (
        <div className="text-center py-8">
          <Loader className="w-10 h-10 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-600">Memuat katalog produk...</p>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200 mb-8">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !error && items.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-600">Tidak ada produk tersedia.</p>
        </div>
      )}

      {/* TODO: Implement product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Item cards will be rendered here */}
      </div>
    </div>
  );
}
```

**Create src/pages/Users.jsx:**

```javascript
import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { Loader, AlertCircle } from 'lucide-react';

export default function Users() {
  const { isAuthenticated } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      // TODO: Fetch users from API endpoint: GET /api/users
      // setIsLoading(true);
      // try {
      //   const response = await axios.get('/api/users');
      //   setUsers(response.data);
      // } catch (err) {
      //   setError(err.message);
      // } finally {
      //   setIsLoading(false);
      // }
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-gray-600">Silakan login terlebih dahulu untuk melihat daftar pengguna.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manajemen Pengguna</h1>
      
      {isLoading && (
        <div className="text-center py-8">
          <Loader className="w-10 h-10 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-600">Memuat daftar pengguna...</p>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200 mb-8">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !error && users.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-600">Tidak ada pengguna tersedia.</p>
        </div>
      )}

      {/* TODO: Implement user table and selection */}
      <div className="bg-white rounded-lg shadow">
        {/* User table will be rendered here */}
      </div>
    </div>
  );
}
```

**Success Criteria:**
- ✅ Catalog.jsx page created
- ✅ Users.jsx page created
- ✅ Both pages require authentication
- ✅ Pages render without errors
- ✅ Placeholder structure for future implementation

---

## Testing Checklist for Phase 1

- [ ] Navigate to / (home page) - works
- [ ] Navigate to /login - works
- [ ] Navigate to /catalog - requires login, shows placeholder when not authenticated
- [ ] Navigate to /users - requires login, shows placeholder when not authenticated
- [ ] Navigate to /recommendation - works
- [ ] Navigate to /sentiment-analysis - works
- [ ] Navigate to /dashboard - works
- [ ] Navbar shows Catalog and Users links when logged in
- [ ] Navbar hides Catalog and Users links when logged out
- [ ] APP_NAME shows "Product Recommendation System Demo"
- [ ] No console errors

## Commit Message

```
feat: Phase 1 - Update app structure and routes for Product Recommendation System

- Update constants: app name, routes, algorithms
- Add Catalog and Users routes
- Create placeholder pages for Catalog and Users
- Update Navbar with new navigation links
- All new pages require authentication
```

## Files Modified

- `src/utils/constants.js` - Updated
- `src/App.jsx` - Updated
- `src/components/Navbar.jsx` - Updated
- `src/pages/Catalog.jsx` - Created
- `src/pages/Users.jsx` - Created

---

**Status:** Ready for implementation  
**Next Phase:** Phase 2 - Catalog Implementation
