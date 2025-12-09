# 🚀 START HERE - Frontend Development Task

## Project Overview

**Project Name:** Product Recommendation System Demo  
**Course:** Riset Sistem Berbasis Pakar (Expert System Research)  
**Institution:** Institut Teknologi Sepuluh Nopember (ITS)  
**Role:** Frontend Developer (React)

---

## What You Need to Do

Build a **Product Recommendation System Frontend** that:

1. 🏠 **Landing Page** - Show recommendations from 2 algorithms (NCF, CBF)
2. 📦 **Catalog Page** - Browse products and see recommendations from 4 algorithms (NCF, CBF, SVD, KNN)
3. 👥 **Users Page** - Browse users and their purchase history

**Key Requirements:**
- ✅ Use **REAL API data** (NO mock data)
- ✅ **Review the repo first** before starting
- ✅ **Push changes directly** to main branch
- ✅ **Don't modify endpoints** - adapt your code instead
- ✅ **Review your own work** before committing

---

## Quick Start (5 Steps)

### 1️⃣ READ FIRST

Read these files in order:

1. **This file** (`START_HERE.md`) - You're here! ✓
2. **FRONTEND_TASK_PROMPT.md** - Complete requirements & checklist
3. **IMPLEMENTATION_GUIDE.md** - Step-by-step with code examples
4. **PHASE_1_SETUP.md** - Structure & routing setup
5. **PHASE_2_CATALOG.md** - Catalog implementation details

**Time:** 15-20 minutes to read everything

### 2️⃣ SETUP ENVIRONMENT

```bash
# 1. Install dependencies
npm install

# 2. Check/create .env.local
# Should contain:
VITE_API_URL=http://localhost:8000/api

# 3. In another terminal, start backend
# (Instructions in backend README)

# 4. Start frontend
npm run dev
# http://localhost:5173
```

### 3️⃣ REVIEW EXISTING CODE

```bash
# Look at existing structure
ls -la src/

# Check current setup
cat src/App.jsx
cat src/utils/constants.js
cat src/components/Navbar.jsx

# Understand authentication
cat src/contexts/AuthContext.jsx
```

### 4️⃣ IMPLEMENT PHASE 2

Follow IMPLEMENTATION_GUIDE.md, create/update these files:

✅ **Step 1-3:** Setup & API
- `src/api/catalogApi.js` - Create (API integration)
- `src/hooks/useCatalog.js` - Create (state management)

✅ **Step 4-5:** Components
- `src/components/CatalogItemCard.jsx` - Create (product card)
- `src/components/AlgorithmComparisonModal.jsx` - Create (recommendation comparison)

✅ **Step 6-10:** Integration
- `src/pages/Catalog.jsx` - Update (main page)
- `src/utils/constants.js` - Update (add routes & algorithms)
- `src/App.jsx` - Update (add routes)
- `src/components/Navbar.jsx` - Update (add navigation)

### 5️⃣ COMMIT & PUSH

```bash
# After each major feature, commit with clear message
git add .
git commit -m "feat: Phase 2 - Implement catalog page..."
git push origin main

# Or break into smaller commits:
git commit -m "feat: Create API layer (catalogApi.js)"
git push origin main

git commit -m "feat: Create hooks (useCatalog.js)"
git push origin main

git commit -m "feat: Implement catalog page and components"
git push origin main
```

---

## File Structure

```
testingfp/
├── src/
│   ├── api/
│   │   └── catalogApi.js          ← CREATE THIS
│   ├── components/
│   │   ├── CatalogItemCard.jsx    ← CREATE THIS
│   │   ├── AlgorithmComparisonModal.jsx ← CREATE THIS
│   │   └── Navbar.jsx              ← UPDATE THIS
│   ├── hooks/
│   │   └── useCatalog.js           ← CREATE THIS
│   ├── pages/
│   │   ├── Catalog.jsx             ← UPDATE THIS
│   │   ├── Users.jsx               ← LEAVE AS PLACEHOLDER
│   │   └── ...
│   ├── utils/
│   │   └── constants.js            ← UPDATE THIS
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── App.jsx                     ← UPDATE THIS
│   └── ...
├── FRONTEND_TASK_PROMPT.md        ← COMPLETE REQUIREMENTS
├── IMPLEMENTATION_GUIDE.md         ← STEP-BY-STEP GUIDE
├── PHASE_1_SETUP.md                ← STRUCTURE INFO
├── PHASE_2_CATALOG.md              ← FEATURE DETAILS
└── START_HERE.md                   ← YOU ARE HERE
```

---

## API Endpoints (DO NOT MODIFY)

These are the endpoints you'll use:

```
GET  /api/items                                   → Get all products
GET  /api/users                                   → Get all users
GET  /recommend_ncf/{userId}/context/{itemId}   → NCF recommendations
GET  /recommend_cbf/{userId}/context/{itemId}   → CBF recommendations
GET  /recommend_svd/{userId}/context/{itemId}   → SVD recommendations (NEW)
GET  /recommend_knn/{userId}/context/{itemId}   → KNN recommendations (NEW)
```

**Example Request:**
```javascript
// Get recommendations for user 1, looking at product 5
GET http://localhost:8000/api/recommend_ncf/1/context/5

// Response:
{
  "items": [
    { "id": 10, "name": "Product 10", "score": 0.95 },
    { "id": 23, "name": "Product 23", "score": 0.87 },
    ...
  ]
}
```

---

## Key Features to Implement

### Feature 1: Catalog Page
- **Route:** `/catalog` (requires login)
- **Fetch:** `GET /api/items` → Display products
- **UI:** Responsive grid of product cards
- **On Click:** Fetch recommendations from 4 algorithms
- **Modal:** Show comparison of recommendations

### Feature 2: Product Card
- Image (with fallback)
- Name, category, rating
- Price (formatted IDR)
- Sentiment score (progress bar)
- "Lihat Rekomendasi" button
- Selected state styling

### Feature 3: Recommendation Modal
- Header with product name
- Grid of 4 algorithm cards (2x2)
- Each card shows:
  - Algorithm name & description
  - Top 5 recommendations
  - Score bars
  - Error handling per algorithm
- Close button
- Responsive on mobile

---

## Important Rules

### ❌ DO NOT
- Create mock/dummy data
- Use `localStorage` with fake data
- Modify API endpoints
- Add new endpoints
- Use feature branches (push to main)
- Commit without testing

### ✅ DO
- Use REAL API data only
- Test on mobile & desktop
- Review code before committing
- Write clear commit messages
- Handle errors gracefully
- Show loading indicators
- Push changes regularly
- Review your own PRs

---

## Testing Checklist

Before each commit, verify:

- [ ] No console errors
- [ ] Items load from API
- [ ] Search/filter works
- [ ] Click item opens modal
- [ ] All 4 algorithms show recommendations
- [ ] Recommendations have correct format
- [ ] Mobile responsive (375px, 768px, 1024px)
- [ ] Error messages displayed
- [ ] Loading states shown
- [ ] All data from API (NO mock data)
- [ ] Code follows repo style
- [ ] Commit message is clear

---

## Commit Message Format

```
feat: Phase 2 - Brief description

- Change 1
- Change 2
- Change 3

Resolves: [any related issues]
```

**Examples:**
```
feat: Phase 2a - Create API integration layer

- Create catalogApi.js with all API functions
- Add getAllItems(), getRecommendations() functions
- Implement error handling with proper messages
- Support parallel requests for all algorithms

feat: Phase 2b - Implement catalog components

- Create CatalogItemCard component
- Create AlgorithmComparisonModal component
- Create useCatalog and useContextRecommendation hooks
- Add search and filtering functionality

feat: Phase 2c - Complete catalog page

- Update Catalog.jsx with full functionality
- Integrate API calls and custom hooks
- Add loading and error states
- Implement responsive design with Tailwind
```

---

## Tech Stack

- **Frontend:** React 18+
- **Styling:** Tailwind CSS
- **HTTP:** Axios
- **Build:** Vite
- **Icons:** lucide-react
- **State:** React Context + Hooks

---

## Getting Help

If stuck:

1. Check FRONTEND_TASK_PROMPT.md → "TROUBLESHOOTING GUIDE"
2. Check IMPLEMENTATION_GUIDE.md → specific step
3. Review similar components in repo
4. Check backend response format
5. Ask Nabil with:
   - Error screenshot
   - Code causing issue
   - Full console error
   - What you've tried

---

## Success Criteria

✅ When you're done:

- [ ] Catalog page fully functional
- [ ] Products fetch and display from API
- [ ] Search/filter works
- [ ] Click product shows modal
- [ ] Modal displays all 4 algorithms
- [ ] Recommendations show with scores
- [ ] Mobile responsive
- [ ] No console errors
- [ ] All real data (no mock)
- [ ] Code follows project style
- [ ] Changes pushed to main
- [ ] Self-reviewed and tested

---

## Timeline

- **Reading docs:** 15-20 min
- **Environment setup:** 5-10 min
- **Code review:** 10-15 min
- **Implementation:**
  - API layer: 30 min
  - Hooks: 20 min
  - Components: 60 min
  - Page integration: 40 min
  - Testing & debugging: 30 min
  - **Total:** ~3-4 hours

**Total Time:** ~4-5 hours for complete Phase 2

---

## Next Steps

1. ✅ Read START_HERE.md (you're here!)
2. → Read FRONTEND_TASK_PROMPT.md
3. → Read IMPLEMENTATION_GUIDE.md
4. → Setup environment
5. → Review existing code
6. → Start implementing Phase 2
7. → Test thoroughly
8. → Commit & push
9. → Review your own work
10. → Ready for code review!

---

## Resources

- React Docs: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Axios: https://axios-http.com
- lucide-react: https://lucide.dev
- Vite: https://vitejs.dev

---

**Good luck! You've got this! 🎉**

If you have questions, re-read the docs or ask Nabil.

**Remember:** Real data only, no mock data, test before pushing!

---

*Last Updated: December 10, 2025*  
*Semester: Riset Sistem Berbasis Pakar*  
*Institution: Institut Teknologi Sepuluh Nopember (ITS)*
