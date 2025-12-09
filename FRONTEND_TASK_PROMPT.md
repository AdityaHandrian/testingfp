# Frontend Development Task Prompt
## Product Recommendation System Demo - Mata Kuliah Riset Sistem Berbasis Pakar

**Project Name:** Product Recommendation System Demo  
**Role:** Frontend Developer (React + JavaScript)  
**Status:** Active Development  
**Last Updated:** December 2025

---

## CRITICAL REQUIREMENTS

### 1. ✅ REPOSITORY REVIEW FIRST
**Before starting any implementation, you MUST:**
- [ ] Read all documentation files (PHASE_1_SETUP.md, PHASE_2_CATALOG.md, DEVELOPMENT_GUIDE.md)
- [ ] Review existing code structure in `src/` directory
- [ ] Check current API endpoints in backend
- [ ] Understand the existing routing and authentication flow
- [ ] Review env variables and API configuration

### 2. 🚫 NO MOCK DATA - USE REAL DATA ONLY
**STRICT REQUIREMENT:**
- **NO** hardcoded mock data arrays
- **NO** localStorage with fake data
- **NO** sample/example data for testing
- **MUST** use actual API endpoints from backend
- **MUST** fetch real dataset from the provided endpoints
- If data is missing, ask Nabil before creating mock data

### 3. 📍 ENDPOINT ALIGNMENT - DO NOT MODIFY
**These endpoints are fixed - adapt your code to them:**

```
GET /api/items                                    # Get all items from catalog
GET /api/users                                    # Get all users
GET /recommend_ncf/{userId}/context/{itemId}     # NCF recommendations with context
GET /recommend_cbf/{userId}/context/{itemId}     # CBF recommendations with context
GET /recommend_svd/{userId}/context/{itemId}     # SVD recommendations with context (NEW)
GET /recommend_knn/{userId}/context/{itemId}     # KNN recommendations with context (NEW)
```

**DO NOT:**
- Change endpoint paths
- Rename query parameters
- Add new endpoints
- Create workarounds for missing endpoints

### 4. 🔄 PUSH CHANGES DIRECTLY TO REPO
**After completing each task:**
- [ ] Commit changes with clear message following format:
  ```
  feat: [Phase/Feature] - Description
  
  - Change 1
  - Change 2
  - Change 3
  ```
- [ ] Push immediately to `main` branch (no feature branches)
- [ ] Each push should be self-contained and testable

### 5. 📋 REVIEW YOUR OWN WORK
**Before each commit, review:**
- [ ] Code follows existing style in repository
- [ ] No console errors or warnings
- [ ] All imports are correct
- [ ] Component structure matches existing patterns
- [ ] API calls use proper error handling
- [ ] Loading and error states implemented
- [ ] Mobile responsive design (Tailwind CSS)
- [ ] No mock data anywhere
- [ ] Real data successfully fetched and displayed

---

## PROJECT STRUCTURE OVERVIEW

```
testingfp/
├── src/
│   ├── api/              # API integration layer (catalogApi.js, etc)
│   ├── assets/           # Images, icons, static files
│   ├── components/       # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── CatalogItemCard.jsx
│   │   └── AlgorithmComparisonModal.jsx
│   ├── contexts/         # React Context (AuthContext, etc)
│   ├── hooks/            # Custom React hooks
│   │   └── useCatalog.js
│   ├── pages/            # Full page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Catalog.jsx   # ← NEW: Browse products
│   │   ├── Users.jsx     # ← NEW: Browse and select users
│   │   ├── Recommendation.jsx
│   │   ├── SentimentAnalysis.jsx
│   │   └── Dashboard.jsx
│   ├── utils/
│   │   ├── constants.js  # Routes, app config, algorithms
│   │   └── ...
│   ├── App.jsx           # Main router
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── DEVELOPMENT_GUIDE.md
├── PHASE_1_SETUP.md
├── PHASE_2_CATALOG.md
└── FRONTEND_TASK_PROMPT.md (this file)
```

---

## CURRENT IMPLEMENTATION STATUS

### ✅ COMPLETED
- Authentication (Login/Signup)
- Navigation/Routing setup
- Some UI pages structure
- Tailwind CSS styling

### ⏳ IN PROGRESS - PHASE 1
- Update app constants (APP_NAME, routes, algorithms)
- Implement Catalog page placeholder
- Implement Users page placeholder
- Update Navbar with new navigation

### 📋 PHASE 2 - YOUR MAIN TASK
- **Create API integration** (catalogApi.js)
- **Create custom hooks** (useCatalog.js, useContextRecommendation)
- **Implement Catalog page** with real data
- **Build item card component** (CatalogItemCard.jsx)
- **Build recommendation comparison modal** (AlgorithmComparisonModal.jsx)
- **Fetch and display items** from `/api/items`
- **Trigger recommendations** on item click
- **Compare 4 algorithms**: NCF, CBF, SVD, KNN

### 📅 PHASE 3 - FUTURE
- Users management page
- User selection and history
- User purchase history display

---

## KEY FEATURES TO IMPLEMENT

### 1. **Landing Page (Home)**
- Display when user is NOT logged in: static landing page
- Display when user IS logged in: show recommendations from NCF and CBF
  - Hit `recommend_ncf` endpoint
  - Hit `recommend_cbf` endpoint  
  - Show both results side-by-side for comparison

### 2. **Catalog Page** (/catalog)
- **Fetch**: `GET /api/items` → display all products
- **Grid Layout**: Responsive product cards
- **Search**: Filter products by name
- **On Click** (logged in user):
  - Fetch recommendations for all 4 algorithms with item context
  - Hit: `recommend_ncf/{userId}/context/{itemId}`
  - Hit: `recommend_cbf/{userId}/context/{itemId}`
  - Hit: `recommend_svd/{userId}/context/{itemId}` (NEW)
  - Hit: `recommend_knn/{userId}/context/{itemId}` (NEW)
  - Show modal comparing results from all 4 algorithms

### 3. **Users Page** (/users)
- **Fetch**: `GET /api/users` → display all users
- **Table/List**: Show user information
- **Selection**: User can select multiple users
- **History**: Show purchase/interaction history for each user

### 4. **Algorithm Comparison Modal**
- Show recommendations from all 4 algorithms
- Display in grid (2x2 or responsive)
- Each algorithm card shows:
  - Algorithm name and description
  - Color indicator
  - Top 5 recommended items
  - Recommendation scores/confidence
  - Total count of recommendations
- Handle errors per algorithm gracefully

---

## TECHNICAL REQUIREMENTS

### Stack
- **Frontend Framework:** React 18+
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Build Tool:** Vite
- **Icons:** lucide-react
- **State Management:** React Context + Hooks

### Code Style
- **Language:** ES6+ JavaScript
- **File Structure:** Component per file
- **Naming Convention:** PascalCase for components, camelCase for functions
- **Error Handling:** Try-catch blocks, user-friendly error messages
- **Loading States:** Always show loading indicator when fetching
- **Responsive:** Mobile-first, works on all screen sizes

### API Integration Pattern

```javascript
// 1. Create API service (src/api/catalogApi.js)
const catalogApi = {
  getAllItems: async () => { /* ... */ },
  getRecommendations: async (userId, itemId, algorithm) => { /* ... */ },
};

// 2. Create custom hook (src/hooks/useCatalog.js)
export function useCatalog() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchItems();
  }, []);
  
  return { items, isLoading, error, refetch };
}

// 3. Use in component
export default function Catalog() {
  const { items, isLoading, error } = useCatalog();
  
  return (
    <div>
      {isLoading && <Loader />}
      {error && <ErrorMessage />}
      {items.map(item => <ItemCard key={item.id} item={item} />)}
    </div>
  );
}
```

### Error Handling

```javascript
// Always provide context
catch (error) {
  console.error('Failed to fetch items:', error);
  setError(error.response?.data?.message || 'Gagal memuat data');
}

// User-friendly messages (in Indonesian)
- "Gagal memuat katalog produk"
- "Gagal memuat rekomendasi NCF"
- "Koneksi internet terputus"
- "Server sedang bermasalah"
```

### Real Data Verification
Before committing, verify:
```javascript
// ✅ CORRECT - Fetching from API
const [items, setItems] = useState([]);
useEffect(() => {
  catalogApi.getAllItems()
    .then(data => setItems(data))
    .catch(err => setError(err.message));
}, []);

// ❌ WRONG - Mock data
const [items] = useState([
  { id: 1, name: 'Product 1', price: 100000 },
  { id: 2, name: 'Product 2', price: 200000 },
]);
```

---

## PHASE 2 IMPLEMENTATION CHECKLIST

### Task 1: API Integration (src/api/catalogApi.js)
- [ ] Create file with all API functions
- [ ] `getAllItems()` - Fetch from `/api/items`
- [ ] `getNCFRecommendationContext(userId, itemId)`
- [ ] `getCBFRecommendationContext(userId, itemId)`
- [ ] `getSVDRecommendationContext(userId, itemId)` ← NEW
- [ ] `getKNNRecommendationContext(userId, itemId)` ← NEW
- [ ] `getAllRecommendationsContext(userId, itemId)` - Parallel calls
- [ ] Error handling with try-catch
- [ ] Use `VITE_API_URL` environment variable
- [ ] Test: All functions callable and return data

### Task 2: Custom Hooks (src/hooks/useCatalog.js)
- [ ] Create `useCatalog()` hook
  - [ ] State: items, isLoading, error, selectedItem
  - [ ] Effect: Fetch items on mount
  - [ ] Return: items, isLoading, error, setSelectedItem, refetch
- [ ] Create `useContextRecommendation()` hook
  - [ ] State: recommendations (ncf, cbf, svd, knn), contextItem, isLoading, error
  - [ ] Function: `fetchRecommendationsForContext(userId, itemId)`
  - [ ] Function: `clearRecommendations()`
  - [ ] Test: Hook works in components

### Task 3: Item Card Component (src/components/CatalogItemCard.jsx)
- [ ] Display product image
- [ ] Display product name, category
- [ ] Display price (formatted IDR)
- [ ] Display rating and review count
- [ ] Display sentiment score as progress bar
- [ ] Show discount badge if applicable
- [ ] "Lihat Rekomendasi" button (when logged in)
- [ ] "Terpilih" state when clicked
- [ ] Hover effects and transitions
- [ ] Props: item, onSelect, isSelected
- [ ] Test: All data displays correctly

### Task 4: Recommendation Modal (src/components/AlgorithmComparisonModal.jsx)
- [ ] Header with item name and close button
- [ ] Grid layout (2x2 for 4 algorithms)
- [ ] For each algorithm:
  - [ ] Algorithm name and description
  - [ ] Color indicator
  - [ ] Top 5 recommendations list
  - [ ] Recommendation score bar
  - [ ] Error handling per algorithm
  - [ ] Loading state
- [ ] Footer with close button
- [ ] Mobile responsive
- [ ] Test: Modal displays all algorithms correctly

### Task 5: Catalog Page Update (src/pages/Catalog.jsx)
- [ ] Use `useCatalog()` hook for items
- [ ] Use `useContextRecommendation()` hook for recommendations
- [ ] Header with title and description
- [ ] Search input with real-time filtering
- [ ] Error message display
- [ ] Loading skeleton or spinner
- [ ] Product grid (1 col mobile, 2 tablet, 3-4 desktop)
- [ ] Item click handler (if authenticated)
- [ ] Modal opens on item click
- [ ] Modal closes and clears state
- [ ] Empty state messages
- [ ] Test: Full catalog flow works

### Task 6: Constants Update (src/utils/constants.js)
- [ ] Update APP_NAME to "Product Recommendation System Demo"
- [ ] Add ROUTES.CATALOG and ROUTES.USERS
- [ ] Add ALGORITHMS object with NCF, CBF, SVD, KNN
- [ ] Each algorithm: id, name, description, color
- [ ] Test: Constants accessible in components

### Task 7: Router Update (src/App.jsx)
- [ ] Import Catalog component
- [ ] Import Users component
- [ ] Add routes for both pages
- [ ] Verify no routing errors
- [ ] Test: Navigation works

### Task 8: Navbar Update (src/components/Navbar.jsx)
- [ ] Add Catalog link (visible when authenticated)
- [ ] Add Users link (visible when authenticated)
- [ ] Hide links when not authenticated
- [ ] Active link styling
- [ ] Mobile responsive
- [ ] Test: Navbar shows/hides correctly

---

## TESTING BEFORE PUSHING

### Manual Testing Checklist

**Authentication Flow:**
- [ ] Navigate to `/catalog` when NOT logged in
  - Shows message: "Silakan login terlebih dahulu"
- [ ] Login with valid credentials
- [ ] Navigate to `/catalog` when logged in
  - Catalog page loads
  - Navbar shows Catalog and Users links

**Catalog Page:**
- [ ] Page loads without errors
- [ ] All products from API display in grid
- [ ] Search filter works
- [ ] Count shows correctly ("Menampilkan X dari Y produk")
- [ ] Product cards display:
  - [ ] Image
  - [ ] Name
  - [ ] Price (formatted)
  - [ ] Rating
  - [ ] Button
- [ ] Click product triggers recommendation fetch
- [ ] Modal opens

**Recommendation Modal:**
- [ ] Modal displays with item name in header
- [ ] All 4 algorithms shown (NCF, CBF, SVD, KNN)
- [ ] Each algorithm shows:
  - [ ] Name and description
  - [ ] Number of recommendations
  - [ ] Top 5 items with scores
- [ ] Loading indicator shows while fetching
- [ ] If any algorithm fails, shows error but others work
- [ ] Close button works
- [ ] Modal closes, clears state

**Responsive Design:**
- [ ] Mobile (375px): Single column, stacked modal
- [ ] Tablet (768px): 2-3 columns
- [ ] Desktop (1024px+): 3-4 columns
- [ ] All text readable
- [ ] All buttons clickable

**Performance:**
- [ ] First page load < 2 seconds
- [ ] Search is responsive (debounced if needed)
- [ ] Recommendations fetch doesn't block UI
- [ ] No console errors
- [ ] No memory leaks (check DevTools)

**Data Integrity:**
- [ ] No mock data anywhere
- [ ] All data from API
- [ ] Correct API endpoints called
- [ ] Correct user ID and item ID sent
- [ ] Response data structured correctly

---

## COMMIT GUIDELINES

### Commit Message Format
```
feat: [Phase N] - Brief description

- Change 1
- Change 2
- Change 3
```

### Example Commits

**Phase 1:**
```
feat: Phase 1 - Update app structure and routes

- Update APP_NAME to "Product Recommendation System Demo"
- Add CATALOG and USERS routes to constants
- Add 4 recommendation algorithms (NCF, CBF, SVD, KNN)
- Create placeholder Catalog and Users pages
- Update Navbar with new navigation links
```

**Phase 2 - API:**
```
feat: Phase 2a - Implement API integration layer

- Create catalogApi.js with all API functions
- Add getAllItems() for fetching products
- Add getRecommendations() for all algorithms
- Add error handling and logging
- Support parallel requests for all algorithms
```

**Phase 2 - Components:**
```
feat: Phase 2b - Implement catalog components

- Create CatalogItemCard component
- Create AlgorithmComparisonModal component
- Implement useCatalog and useContextRecommendation hooks
- Add search and filtering functionality
- All data from real API (no mock data)
```

**Phase 2 - Pages:**
```
feat: Phase 2c - Complete catalog page implementation

- Update Catalog.jsx with full functionality
- Integrate API calls and hooks
- Add error handling and loading states
- Mobile responsive design
- All endpoints working and tested
```

---

## TROUBLESHOOTING GUIDE

### Common Issues

**"Cannot read property 'map' of undefined"**
```javascript
// ❌ Wrong
{items.map(item => ...)}

// ✅ Correct
{items && items.length > 0 && items.map(item => ...)}
// OR better:
{items?.map(item => ...)}
```

**"API returns 404"**
- Check endpoint URL matches exactly
- Log the full request: `console.log('Fetching:', url)`
- Verify backend is running
- Check environment variables

**"Component shows old data after filter"**
- Make sure state is cleared properly
- Use `.catch()` or try-catch for errors
- Verify dependencies in useEffect

**"Recommendation modal doesn't show all 4 algorithms"**
- Check API calls are parallel (Promise.all)
- Verify each endpoint exists in backend
- Log responses to see which fail
- Show error state for failed algorithms

**"Image not loading"**
- Check image URL from API
- Provide fallback placeholder
- Use image `onError` handler:
```javascript
<img 
  src={item.image} 
  onError={(e) => { e.target.src = 'fallback.jpg' }}
/>
```

**"Search/filter is slow"**
- Implement debounce:
```javascript
const [searchQuery, setSearchQuery] = useState('');
const debouncedSearch = useMemo(() => {
  return debounce((query) => {
    setFiltered(items.filter(i => i.name.includes(query)));
  }, 300);
}, [items]);
```

---

## DESIGN SYSTEM

Use existing Tailwind CSS classes and components:

### Colors
- Primary: `blue-600`, `blue-500`
- Secondary: `gray-600`, `gray-700`
- Success: `green-500`
- Error: `red-500`
- Warning: `yellow-500`

### Spacing
- Padding: `p-4`, `p-6`
- Margin: `mb-8`, `mt-4`
- Gap: `gap-6`, `gap-4`

### Typography
- Headers: `text-3xl font-bold` (page), `text-lg font-semibold` (card)
- Body: `text-sm`, `text-gray-600`
- Buttons: `font-medium`

### Components
- Buttons: `px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700`
- Cards: `bg-white rounded-lg shadow-md`
- Inputs: `border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500`

---

## GETTING HELP

If you get stuck:
1. Check DEVELOPMENT_GUIDE.md
2. Check PHASE_1_SETUP.md and PHASE_2_CATALOG.md
3. Review similar components in repo
4. Check backend API response format
5. Ask Nabil with:
   - Screenshot of error
   - Code causing issue
   - Full error message from console

---

## FINAL CHECKLIST BEFORE COMMITTING

- [ ] Read all requirements in this document
- [ ] Reviewed existing code and patterns
- [ ] No mock data - all data from API
- [ ] All endpoints used correctly
- [ ] Proper error handling implemented
- [ ] Loading states shown
- [ ] Mobile responsive
- [ ] No console errors or warnings
- [ ] Tested manually on multiple screen sizes
- [ ] Code follows project style
- [ ] Commit message is clear and descriptive
- [ ] Ready to push to main

---

**Last Updated:** December 10, 2025  
**Semester:** Riset Sistem Berbasis Pakar (Expert System Research)  
**Institution:** Institut Teknologi Sepuluh Nopember (ITS)  
**Team Lead:** Nabil Akhtar  
**Frontend Dev:** [Your Name]
