# Product Recommendation System Demo - Frontend Implementation Plan

## 📋 Project Overview

**Project Name:** Product Recommendation System Demo  
**Course:** Riset Sistem Berbasis Pakar (Expert Systems Research)  
**Department:** Teknik Informatika (Computer Science)  
**Frontend Developer Role:** Full-stack frontend development with React + Vite

## 🎯 Current Status

✅ Existing structure reviewed:  
- React + Vite project with Tailwind CSS
- Authentication system (AuthContext) already implemented
- Navigation and routing structure in place
- Mock data currently used

## 📄 New Website Structure

### Website Name
**"Product Recommendation System Demo"**

### Pages to Implement

#### 1. **Landing Page** (`/`)
- **When not logged in:** Shows the current landing page (as is)
- **When logged in:** Transforms to show:
  - Recommendation comparison section
  - Hit endpoints:
    - `GET /api/recommend_ncf` (Nearest Collaborative Filtering)
    - `GET /api/recommend_cbf` (Content-Based Filtering)
  - Display both results side-by-side for comparison
  - Show algorithm differences and confidence scores

#### 2. **Catalog Page** (`/catalog`)
- Grid view of all available items
- Endpoint: `GET /api/items` (to be provided by backend)
- Features:
  - Item cards with images, name, description, price
  - Filter/search capabilities
  - **On item click (when logged in):**
    - Trigger inference with both algorithms:
      - `GET /api/recommend_ncf/{userId}/context/{itemId}`
      - `GET /api/recommend_cbf/{userId}/context/{itemId}`
    - Show related products based on selected item
    - Display recommendation explanations

#### 3. **Users Page** (`/users`)
- User management interface
- Features:
  - User list/table (from `GET /api/users` endpoint)
  - Select multiple users for comparison
  - View purchase history for each user
  - Display recommendations per user
  - Show differences in recommendation results across users

#### 4. **Recommendation Page** (Restructure existing)
- Keep the current recommendation functionality
- Add algorithm selection:
  - NCF (Neural Collaborative Filtering)
  - CBF (Content-Based Filtering)
  - SVD (Singular Value Decomposition) - Recently added
  - KNN (K-Nearest Neighbors) - Recently added
- Display comparison matrix
- Show reasoning/explanation for each recommendation

#### 5. **Sentiment Analysis Page** (Keep existing)
- Maintain current sentiment analysis functionality

#### 6. **Dashboard Page** (Keep existing)
- System overview and statistics

## 🔌 API Integration Requirements

### Endpoints to Integrate

```
# Recommendation Algorithms
GET  /api/recommend_ncf
GET  /api/recommend_cbf
GET  /api/recommend_svd
GET  /api/recommend_knn
GET  /api/recommend_ncf/{userId}/context/{itemId}
GET  /api/recommend_cbf/{userId}/context/{itemId}
GET  /api/recommend_svd/{userId}/context/{itemId}
GET  /api/recommend_knn/{userId}/context/{itemId}

# Data Endpoints
GET  /api/items
GET  /api/users
GET  /api/users/{userId}/history

# Authentication (existing)
POST /api/auth/login
POST /api/auth/signup
```

### No Mock Data
✅ **Requirement:** Only use data provided by backend endpoints  
❌ **Remove:** mockData.js references (use real API calls only)

## 📁 File Structure Changes

### New Files to Create

```
src/
├── pages/
│   ├── Catalog.jsx              (NEW)
│   ├── Users.jsx                (NEW)
│   └── [others remain unchanged]
├── components/
│   ├── AlgorithmComparison.jsx  (NEW)
│   ├── ItemCard.jsx             (NEW)
│   ├── UserSelector.jsx         (NEW)
│   └── [others remain]
├── hooks/
│   ├── useCatalog.js            (NEW)
│   ├── useUsers.js              (NEW)
│   ├── useAlgorithmComparison.js (NEW)
│   └── [others remain]
├── api/
│   ├── catalogApi.js            (NEW)
│   ├── usersApi.js              (NEW)
│   ├── recommendationApi.js     (NEW - Refactored)
│   └── mockData.js              (REMOVE or minimize)
└── utils/
    ├── constants.js             (UPDATE)
    └── [others remain]
```

### Files to Update

1. **src/App.jsx**
   - Add routes for Catalog (`/catalog`)
   - Add routes for Users (`/users`)
   - Update navbar links

2. **src/utils/constants.js**
   - Add new routes
   - Update APP_NAME to "Product Recommendation System Demo"
   - Add algorithm constants (NCF, CBF, SVD, KNN)

3. **src/components/Navbar.jsx**
   - Update navigation links for new pages
   - Add links to Catalog and Users pages (visible when authenticated)

4. **src/pages/Home.jsx**
   - When logged in: Show recommendation comparison section
   - Call both `recommend_ncf` and `recommend_cbf` endpoints
   - Display side-by-side comparison

5. **src/pages/Recommendation.jsx**
   - Add algorithm selection dropdown/tabs
   - Implement comparison view
   - Add reasoning/explanation display

## 🔄 Implementation Workflow

### Phase 1: Setup & Structure
1. Update constants.js (routes, app name, algorithms)
2. Update App.jsx with new routes
3. Create Catalog and Users page shells

### Phase 2: Catalog Implementation
1. Create catalogApi.js for backend calls
2. Create useCatalog.js hook
3. Create Catalog.jsx page
4. Implement item click → recommendation inference

### Phase 3: Users Implementation
1. Create usersApi.js for backend calls
2. Create useUsers.js hook
3. Create Users.jsx page with user table
4. Implement multi-user comparison

### Phase 4: Landing Page Enhancement
1. Update Home.jsx for authenticated users
2. Implement recommendation comparison display
3. Add algorithm comparison cards

### Phase 5: Recommendation Page Refactor
1. Add algorithm selection
2. Implement comparison matrix
3. Add reasoning/explanation display

### Phase 6: Testing & Polish
1. Test all API integrations (real data only)
2. Error handling for API failures
3. Loading states
4. Responsive design verification

## 🧪 Testing Checklist

- [ ] All pages load without errors
- [ ] Real API data displays correctly
- [ ] No mock data is used anywhere
- [ ] Algorithm comparison works (NCF vs CBF vs SVD vs KNN)
- [ ] User selection and history view works
- [ ] Catalog item click triggers correct inference
- [ ] Recommendations display with explanations
- [ ] Navigation between pages works
- [ ] Authentication flows properly
- [ ] Mobile responsive design
- [ ] Error handling for API failures
- [ ] Loading indicators show appropriately

## 📝 Git Commit Strategy

Commits should be organized by feature:

1. `feat: Update app structure and constants for Product Recommendation System`
2. `feat: Implement Catalog page with item listing and inference`
3. `feat: Implement Users page with user selection and history`
4. `feat: Enhance landing page with recommendation comparison for authenticated users`
5. `feat: Refactor recommendation page with algorithm selection and comparison`
6. `feat: Add API integration services for all endpoints`
7. `refactor: Remove mock data and use real API endpoints only`
8. `chore: Update navbar and navigation structure`

## 📚 Course Context

This project demonstrates:
- **Expert Systems Knowledge:** Understanding of recommendation algorithms
- **Knowledge Representation:** Different recommendation models (NCF, CBF, SVD, KNN)
- **Knowledge Acquisition:** Learning from user behavior and item features
- **Sentiment Analysis:** Integration of NLP for product reviews
- **XAI (Explainable AI):** Showing reasoning behind recommendations

## 🚀 Next Steps

1. Review this implementation plan with team
2. Confirm backend API endpoints with backend developer
3. Start Phase 1: Setup & Structure
4. Create feature branches for each phase
5. Implement with real backend data (no mock data)
6. Test thoroughly before merging to main

---

**Status:** Ready for implementation  
**Last Updated:** 2025-12-10  
**Frontend Developer:** [Your Name]  
**Project Repository:** https://github.com/AdityaHandrian/testingfp
