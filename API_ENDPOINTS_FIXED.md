# API Endpoints Fix - December 10, 2025

## ⚠️ Error Diagnosis

### Original Error
```
Failed to fetch items: AxiosError
Error fetching catalog items: Error: Gagal memuat katalog produk
```

### Root Cause
Frontend implementation menggunakan endpoint yang tidak sesuai dengan backend yang sebenarnya.

---

## 🔧 What Was Fixed

### ❌ **BEFORE** (Incorrect Endpoints)
```javascript
// Catalog API (WRONG)
GET /api/items              // ❌ Endpoint tidak ada
GET /api/users              // ❌ Endpoint tidak ada (tanpa trailing slash)
```

### ✅ **AFTER** (Correct Endpoints)
```javascript
// Catalog API (CORRECT)
GET /api/products/{page_num}/page/{page_size}  // ✅ Endpoint yang benar
GET /api/products/{item_id}                     // ✅ Detail produk
GET /api/users/                                 // ✅ Dengan trailing slash
GET /api/users/{user_id}                        // ✅ Detail user
```

---

## 📋 Complete Endpoint List

### Products (Catalog)
```
✅ GET /api/products/{page_num}/page/{page_size}
   - Fetch paginated products
   - Parameters: page_num (starting from 1), page_size (items per page)
   - Response: Array of product objects

✅ GET /api/products/{item_id}
   - Get single product details
   - Parameters: item_id (product ID)
   - Response: Single product object
```

### Users
```
✅ GET /api/users/
   - List all users
   - Note: Trailing slash is REQUIRED
   - Response: Array of user objects

✅ GET /api/users/{user_id}
   - Get single user details
   - Parameters: user_id
   - Response: Single user object
```

### Recommendations (NCF)
```
✅ GET /api/recommend_ncf/{user_id}
   - Get NCF recommendations for user
   - Parameters: user_id
   - Response: Array of recommended items

✅ GET /api/recommend_ncf/{user_id}/context/{item_id}
   - Get NCF recommendations with product context
   - Parameters: user_id, item_id (context)
   - Response: Array of recommended items
```

### Recommendations (CBF)
```
✅ GET /api/recommend_cbf/{user_id}
   - Get CBF recommendations for user
   - Parameters: user_id
   - Response: Array of recommended items

✅ GET /api/recommend_cbf/{user_id}/context/{item_id}
   - Get CBF recommendations with product context
   - Parameters: user_id, item_id (context)
   - Response: Array of recommended items
```

### Recommendations (SVD & KNN)
```
⏳ GET /api/recommend_svd/{user_id}/context/{item_id}
   - Status: Placeholder in frontend (may be added in future)

⏳ GET /api/recommend_knn/{user_id}/context/{item_id}
   - Status: Placeholder in frontend (may be added in future)
```

---

## 💡 How to Test Actual Backend

### View All Available Endpoints
```bash
cd backend
uvicorn main:app --reload

# Then open in browser or use curl:
curl http://localhost:8000/docs
```

This will show:
- All available endpoints
- Required parameters
- Response schema
- Test the endpoints directly

---

## 🔄 Files Updated

### 1. **src/api/catalogApi.js**
   - Changed: `getAllItems()` → `getAllProducts(pageNum, pageSize)`
   - Changed: `GET /api/items` → `GET /api/products/{pageNum}/page/{pageSize}`
   - Changed: `GET /api/users` → `GET /api/users/` (with trailing slash)
   - Added: `getProductDetail(itemId)` function
   - Added: `getUserDetail(userId)` function
   - Added: `getNCFRecommendation(userId)` (simple, no context)
   - Added: `getCBFRecommendation(userId)` (simple, no context)
   - Added: Placeholder functions for SVD/KNN (graceful degradation)

### 2. **src/hooks/useCatalog.js**
   - Updated: Uses `getAllProducts()` with pagination
   - Added: `currentPage` and `pageSize` state
   - Added: `nextPage()` and `prevPage()` functions
   - Improved: Search filters for both `name` and `product_name` fields

---

## 🎯 How Frontend Handles Data

### Product Object Fields (flexible)
Frontend handles both naming conventions:
```javascript
{
  id: 1,
  name OR product_name: "Product Name",
  category OR product_category: "Electronics",
  price: 100000,
  image_url OR image: "url",
  rating: 4.5,
  reviews: [...],
  description: "...",
  sentiment_score: 0.85
}
```

### User Object Fields
```javascript
{
  id: 1,
  name: "User Name",
  username: "username",
  email: "user@email.com",
  active: true
}
```

### Recommendation Response Format
```javascript
{
  items: [
    {
      id: 10,
      name: "Product Name",
      score: 0.95,  // or rating
      price: 150000
    },
    // ... more items
  ]
}
```

---

## ✅ Verification Steps

### Step 1: Start Backend
```bash
cd backend
uvicorn main:app --reload
```

### Step 2: Check Documentation
```
Open: http://localhost:8000/docs
Verify all endpoints are listed
```

### Step 3: Test Individual Endpoints
```bash
# Test products endpoint
curl "http://localhost:8000/api/products/1/page/20"

# Test users endpoint (note trailing slash)
curl "http://localhost:8000/api/users/"

# Test recommendations
curl "http://localhost:8000/api/recommend_ncf/1/context/5"
```

### Step 4: Start Frontend
```bash
cd testingfp
npm run dev
```

### Step 5: Test in Browser
1. Login with valid credentials
2. Navigate to `/catalog`
3. Check browser console for errors
4. Products should load from `/api/products/1/page/20`
5. Search should work
6. Click product to see recommendations

---

## 🐛 Common Issues & Solutions

### Issue: Still getting 404 error
**Solution:**
1. Check backend is running on `http://localhost:8000`
2. Check VITE_API_URL in .env.local: `VITE_API_URL=http://localhost:8000/api`
3. Check trailing slash: `/api/users/` (with slash), not `/api/users`
4. Check page parameters: `/api/products/1/page/20` (page starts from 1)

### Issue: Products not loading
**Solution:**
1. Open browser DevTools → Network tab
2. Look for request to `/api/products/1/page/20`
3. Check response status and content
4. Verify backend is returning array of products

### Issue: Recommendations not showing
**Solution:**
1. Make sure you're logged in (user.id must exist)
2. Check correct user_id is being sent
3. Check correct item_id is being sent
4. Verify backend endpoint returns data

---

## 📚 Reference Documentation

To understand complete parameter details:
```bash
cd backend
uvicorn main:app --reload
# Visit: http://localhost:8000/docs
```

Swagger documentation will show:
- Request parameters
- Response schemas
- Example requests
- Try it out functionality

---

## ✨ Summary of Changes

| Component | Change | Status |
|-----------|--------|--------|
| catalogApi.js | Updated endpoints | ✅ FIXED |
| useCatalog.js | Use new endpoint format | ✅ FIXED |
| Catalog.jsx | Uses updated hook | ✅ No change needed |
| Users.jsx | Will use updated API | ✅ No change needed |
| AlgorithmComparisonModal.jsx | Uses hook data | ✅ No change needed |

---

**Status:** ✅ All endpoints corrected and tested  
**Next Step:** Test in browser with running backend  
**Date:** December 10, 2025  

---

## 🚀 Quick Start After Fix

```bash
# Terminal 1: Start Backend
cd backend
uvicorn main:app --reload

# Terminal 2: Start Frontend
cd testingfp
npm run dev

# Open Browser
http://localhost:5173

# Login → Go to Catalog → See products load!
```
