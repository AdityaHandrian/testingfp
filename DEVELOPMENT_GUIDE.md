# Product Recommendation System Demo - Complete Development Guide

## 📋 Project Overview

**Project Name:** Product Recommendation System Demo  
**Course:** Riset Sistem Berbasis Pakar (Expert Systems Research)  
**Institution:** Institut Teknologi Sepuluh Nopember (ITS)  
**Department:** Teknik Informatika (Computer Science)

**Technology Stack:**
- Frontend: React 19 + Vite
- Styling: Tailwind CSS
- UI Components: Lucide React
- API Client: Axios
- Routing: React Router DOM 7

## 🎯 Project Goals

1. **Demonstrate Expert System Concepts:**
   - Knowledge acquisition and representation
   - Reasoning with uncertainty
   - Explainable AI (XAI)
   - Algorithm comparison

2. **Implement Recommendation Algorithms:**
   - NCF (Nearest Collaborative Filtering)
   - CBF (Content-Based Filtering)
   - SVD (Singular Value Decomposition)
   - KNN (K-Nearest Neighbors)

3. **Create Interactive UI:**
   - User-friendly navigation
   - Real-time algorithm comparison
   - Purchase history tracking
   - Sentiment analysis integration

## 📁 Project Structure

```
testingfp/
├── src/
│   ├── api/
│   │   ├── apiClient.js              (Existing)
│   │   ├── catalogApi.js             (Phase 2)
│   │   ├── usersApi.js               (Phase 3)
│   │   ├── recommendationApi.js      (Phase 4)
│   │   └── mockData.js               (To be removed)
│   ├── components/
│   │   ├── Navbar.jsx                (Phase 1 - Updated)
│   │   ├── Footer.jsx                (Existing)
│   │   ├── ProductCard.jsx           (Existing)
│   │   ├── CatalogItemCard.jsx       (Phase 2)
│   │   ├── AlgorithmComparisonModal.jsx (Phase 2)
│   │   ├── UserSelector.jsx          (Phase 3)
│   │   ├── UserHistoryTable.jsx      (Phase 3)
│   │   └── AlgorithmComparison.jsx   (Phase 4)
│   ├── contexts/
│   │   └── AuthContext.jsx           (Existing)
│   ├── hooks/
│   │   ├── useAuth.js                (Existing)
│   │   ├── useRecommendation.js      (Existing)
│   │   ├── useCatalog.js             (Phase 2)
│   │   ├── useUsers.js               (Phase 3)
│   │   └── useAlgorithmComparison.js (Phase 4)
│   ├── pages/
│   │   ├── Home.jsx                  (Phase 4 - Updated)
│   │   ├── Login.jsx                 (Existing)
│   │   ├── Signup.jsx                (Existing)
│   │   ├── Catalog.jsx               (Phase 2)
│   │   ├── Users.jsx                 (Phase 3)
│   │   ├── Recommendation.jsx        (Phase 4 - Updated)
│   │   ├── SentimentAnalysis.jsx     (Existing)
│   │   └── Dashboard.jsx             (Existing)
│   ├── utils/
│   │   └── constants.js              (Phase 1 - Updated)
│   ├── assets/
│   ├── App.jsx                       (Phase 1 - Updated)
│   ├── main.jsx                      (Existing)
│   ├── index.css                     (Existing)
│   └── App.css                       (Existing)
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── FRONTEND_IMPLEMENTATION_PLAN.md   (This overview)
├── PHASE_1_SETUP.md                  (Setup & Structure)
├── PHASE_2_CATALOG.md                (Catalog Implementation)
├── PHASE_3_USERS.md                  (Users Implementation) - To be created
├── PHASE_4_LANDING.md                (Landing Page Enhancement) - To be created
├── PHASE_5_RECOMMENDATION.md         (Recommendation Refactor) - To be created
└── PHASE_6_TESTING.md                (Testing & Polish) - To be created
```

## 🔄 Implementation Phases

### Phase 1: Setup & Structure ✅
**Status:** Ready to implement
**Duration:** 1-2 hours
**Files:** 3 updated, 2 created

**Tasks:**
- Update `src/utils/constants.js`
- Update `src/App.jsx` with new routes
- Update `src/components/Navbar.jsx`
- Create `src/pages/Catalog.jsx` (placeholder)
- Create `src/pages/Users.jsx` (placeholder)

**Key Changes:**
- Rename app to "Product Recommendation System Demo"
- Add routes: `/catalog`, `/users`
- Add algorithm constants (NCF, CBF, SVD, KNN)
- Update navigation

**Deliverables:**
- Routing setup complete
- Navigation structure ready
- Placeholder pages in place

---

### Phase 2: Catalog Implementation ✅
**Status:** Ready to implement
**Duration:** 3-4 hours
**Files:** 4 created, 1 updated

**Tasks:**
- Create `src/api/catalogApi.js`
- Create `src/hooks/useCatalog.js`
- Create `src/components/CatalogItemCard.jsx`
- Create `src/components/AlgorithmComparisonModal.jsx`
- Implement full `src/pages/Catalog.jsx`

**Key Features:**
- Fetch items from backend API
- Display items in responsive grid
- Search functionality
- Click item → trigger all 4 algorithm recommendations
- Modal shows comparison of results

**API Endpoints:**
```
GET /api/items
GET /api/recommend_ncf/{userId}/context/{itemId}
GET /api/recommend_cbf/{userId}/context/{itemId}
GET /api/recommend_svd/{userId}/context/{itemId}
GET /api/recommend_knn/{userId}/context/{itemId}
```

**Deliverables:**
- Catalog page with full functionality
- Algorithm comparison modal
- Real API integration (no mock data)

---

### Phase 3: Users Implementation
**Status:** In guide (PHASE_3_USERS.md)
**Duration:** 3-4 hours
**Files:** 4 created, 1 updated

**Tasks:**
- Create `src/api/usersApi.js`
- Create `src/hooks/useUsers.js`
- Create `src/components/UserSelector.jsx`
- Create `src/components/UserHistoryTable.jsx`
- Implement full `src/pages/Users.jsx`

**Key Features:**
- Display user list from API
- Multi-user selection
- View purchase history per user
- Compare recommendations across users

**API Endpoints:**
```
GET /api/users
GET /api/users/{userId}/history
```

**Deliverables:**
- Users page with table
- User selection interface
- History display
- Multi-user comparison

---

### Phase 4: Landing Page Enhancement
**Status:** In guide (PHASE_4_LANDING.md)
**Duration:** 2-3 hours
**Files:** 1 updated, 1 created

**Tasks:**
- Create `src/components/AlgorithmComparison.jsx`
- Update `src/pages/Home.jsx` for authenticated users

**Key Features:**
- When not logged in: Show current landing page
- When logged in: Show recommendation comparison
- Display NCF and CBF results side-by-side
- Show algorithm differences and explanations

**Deliverables:**
- Enhanced landing page
- Real-time recommendation comparison
- Algorithm visualization

---

### Phase 5: Recommendation Page Refactor
**Status:** In guide (PHASE_5_RECOMMENDATION.md)
**Duration:** 2-3 hours
**Files:** 1 created, 1 updated

**Tasks:**
- Create `src/hooks/useAlgorithmComparison.js`
- Update `src/pages/Recommendation.jsx`

**Key Features:**
- Algorithm selection (dropdown/tabs)
- Comparison matrix
- Reasoning/explanation display
- Support for SVD and KNN (newly added)

**Deliverables:**
- Algorithm selection interface
- Comparison matrix view
- Explanation display

---

### Phase 6: Testing & Polish
**Status:** In guide (PHASE_6_TESTING.md)
**Duration:** 2-3 hours

**Tasks:**
- Test all pages and features
- Verify API integration
- Error handling
- Responsive design
- Performance optimization
- Documentation

**Deliverables:**
- Fully tested application
- Error handling in place
- Mobile responsive
- Documentation complete

---

## 🔐 Authentication Flow

The app uses React Context for authentication:

```javascript
// AuthContext provides:
- user: { id, name, email, ... }
- isAuthenticated: boolean
- login(email, password)
- signup(userData)
- logout()
```

**Protected Pages:**
- `/catalog` - Requires authentication
- `/users` - Requires authentication
- `/recommendation` - Requires authentication (for personal recommendations)

**Public Pages:**
- `/` - Landing page (content changes based on auth)
- `/login` - Login page
- `/signup` - Signup page
- `/sentiment-analysis` - Sentiment analysis (available to all)

## 🌐 API Integration Strategy

### Endpoint Structure

```
Base URL: http://localhost:8000/api (configurable via .env)

Authentication:
  POST /auth/login
  POST /auth/signup

Catalog:
  GET /items
  GET /items/{itemId}

Recommendations:
  GET /recommend_ncf
  GET /recommend_cbf
  GET /recommend_svd
  GET /recommend_knn
  GET /recommend_ncf/{userId}/context/{itemId}
  GET /recommend_cbf/{userId}/context/{itemId}
  GET /recommend_svd/{userId}/context/{itemId}
  GET /recommend_knn/{userId}/context/{itemId}

Users:
  GET /users
  GET /users/{userId}
  GET /users/{userId}/history

Sentiment:
  POST /sentiment/analyze
```

### No Mock Data Policy

✅ **ALL** API calls must use real endpoints  
❌ **NO** mock data generators  
❌ **NO** hardcoded fake responses  
✅ **Always** handle API errors gracefully

**Mock Data File:**
- `src/api/mockData.js` should be removed after Phase 1
- Any remaining references should be deleted
- Use real API responses only

## 🧪 Testing Strategy

### Unit Testing
- API functions (catalogApi.js, usersApi.js, etc.)
- Hooks (useCatalog, useUsers, etc.)
- Utility functions

### Integration Testing
- Page-to-page navigation
- Authentication flow
- API integration
- State management

### E2E Testing
- User journey: Login → Browse Catalog → View Recommendations
- Algorithm comparison functionality
- User selection and history

### Manual Testing Checklist

**Pre-Implementation:**
- [ ] Review this guide
- [ ] Review all phase guides
- [ ] Understand API endpoints from backend
- [ ] Confirm .env configuration

**During Implementation:**
- [ ] Test each component in isolation
- [ ] Test integration between components
- [ ] Verify API calls with real data
- [ ] Check error handling

**After Implementation:**
- [ ] Full user journey testing
- [ ] Mobile responsive testing
- [ ] Error scenario testing
- [ ] Performance testing

## 📝 Git Workflow

### Branch Strategy

```
main (stable)
├── develop (integration)
│   ├── feature/phase-1-setup
│   ├── feature/phase-2-catalog
│   ├── feature/phase-3-users
│   ├── feature/phase-4-landing
│   ├── feature/phase-5-recommendation
│   └── feature/phase-6-testing
```

### Commit Convention

```
feat: Add new feature
fix: Fix a bug
refactor: Refactor code
docs: Update documentation
test: Add/update tests
chore: Update dependencies
```

### PR Review Checklist

- [ ] Code follows project style
- [ ] No console errors/warnings
- [ ] Real API integration (no mock data)
- [ ] Error handling implemented
- [ ] Loading states shown
- [ ] Mobile responsive
- [ ] Documentation updated
- [ ] Tests pass

## 🚀 Getting Started

### Prerequisites

```bash
Node.js >= 16.0.0
npm >= 8.0.0
```

### Installation

```bash
# Clone repository
git clone https://github.com/AdityaHandrian/testingfp.git
cd testingfp

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000/api" > .env

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

## 📚 Key Concepts

### Recommendation Algorithms

**NCF (Nearest Collaborative Filtering)**
- Based on user similarity
- Finds users with similar preferences
- Recommends products those users liked
- Good for finding similar user groups

**CBF (Content-Based Filtering)**
- Based on item features
- Recommends items similar to what user liked
- Uses product attributes and metadata
- Good for cold-start problem

**SVD (Singular Value Decomposition)**
- Matrix factorization technique
- Decomposes user-item interaction matrix
- Captures latent factors
- Mathematically sophisticated approach

**KNN (K-Nearest Neighbors)**
- Instance-based learning
- Finds k nearest users/items
- Makes predictions based on neighbors
- Simple but effective

### Expert System Components

1. **Knowledge Acquisition:**
   - Collecting user preferences
   - Gathering product information
   - Capturing sentiment from reviews

2. **Knowledge Representation:**
   - User-item interaction matrix
   - Product feature vectors
   - Sentiment scores

3. **Inference Engine:**
   - Recommendation algorithms
   - Comparison logic
   - Decision making

4. **Explainability (XAI):**
   - Showing why items recommended
   - Algorithm comparison
   - Confidence scores
   - Reasoning explanation

## 📖 Additional Resources

### Course Materials (Attached)
- `02-RepresentasiPengetahuan-1.pdf` - Knowledge Representation
- `03-Knowledge Acquisition and Representation.pdf` - Knowledge Acquisition
- `04-KnowledgeAcquisition-1.pdf` - Knowledge Acquisition Details
- `05-Reasoning-and-Uncertainty.pdf` - Reasoning and Uncertainty
- `06-XAI_Explainable Artificial Intelligence.pdf` - XAI
- `07-EvaluasiKinerja.pptx` - Performance Evaluation

### External Resources
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Lucide Icons](https://lucide.dev)

## ❓ FAQ

**Q: How do I start implementation?**  
A: Start with Phase 1 using the PHASE_1_SETUP.md guide. Follow each task sequentially.

**Q: Can I use mock data?**  
A: No. All API calls must use real backend endpoints. Mock data is strictly forbidden.

**Q: How do I handle API errors?**  
A: Use try-catch blocks and display user-friendly error messages. See examples in each phase guide.

**Q: What if backend endpoint is not ready?**  
A: Work with backend developer to define API contract first. Create API service files that can be tested once endpoints are ready.

**Q: How do I test locally?**  
A: Ensure backend is running on http://localhost:8000. Update .env if using different URL.

## 📞 Support

**For questions about:**
- Implementation: See phase guides
- API integration: See API Integration Strategy section
- Course concepts: Review attached PDF materials
- General issues: Check this guide's FAQ section

## ✅ Implementation Checklist

### Before Starting
- [ ] Read FRONTEND_IMPLEMENTATION_PLAN.md
- [ ] Read DEVELOPMENT_GUIDE.md (this file)
- [ ] Understand API endpoints
- [ ] Confirm environment setup

### Phase 1
- [ ] Update constants.js
- [ ] Update App.jsx
- [ ] Update Navbar.jsx
- [ ] Create Catalog.jsx
- [ ] Create Users.jsx
- [ ] Test routing
- [ ] Commit: `feat: Phase 1 - Setup & Structure`

### Phase 2
- [ ] Create catalogApi.js
- [ ] Create useCatalog.js
- [ ] Create CatalogItemCard.jsx
- [ ] Create AlgorithmComparisonModal.jsx
- [ ] Implement Catalog.jsx
- [ ] Test catalog functionality
- [ ] Commit: `feat: Phase 2 - Catalog Implementation`

### Phase 3
- [ ] Create usersApi.js
- [ ] Create useUsers.js
- [ ] Create UserSelector.jsx
- [ ] Create UserHistoryTable.jsx
- [ ] Implement Users.jsx
- [ ] Test users functionality
- [ ] Commit: `feat: Phase 3 - Users Implementation`

### Phase 4
- [ ] Create AlgorithmComparison.jsx
- [ ] Update Home.jsx
- [ ] Test authenticated landing page
- [ ] Commit: `feat: Phase 4 - Landing Page Enhancement`

### Phase 5
- [ ] Create useAlgorithmComparison.js
- [ ] Update Recommendation.jsx
- [ ] Add algorithm selection
- [ ] Test recommendation page
- [ ] Commit: `feat: Phase 5 - Recommendation Refactor`

### Phase 6
- [ ] Full testing
- [ ] Error handling
- [ ] Mobile responsive
- [ ] Documentation
- [ ] Commit: `feat: Phase 6 - Testing & Polish`

---

**Version:** 1.0  
**Last Updated:** 2025-12-10  
**Status:** Ready for Implementation  
**Next Action:** Read PHASE_1_SETUP.md and start development
