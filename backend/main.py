from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from sklearn.metrics.pairwise import cosine_similarity
from surprise import dump
import torch.nn.functional as F
import torch.nn as nn
import numpy as np
import sqlite3
import pickle
import torch
import math
import ast
import os
from dotenv import load_dotenv

load_dotenv()

KNN_PATH = os.getenv("KNN_PATH")
SVDPP_PATH = os.getenv("SVDPP_PATH")
NCF_PATH = os.getenv("NCF_PATH")
CBF_PATH = os.getenv("CBF_PATH")
DB_PATH = os.getenv("DB_PATH")

ml_models = {
    "knn": None,
    "svdpp": None,
    "ncf": None,
    "cbf": None
}

class NCFModel(nn.Module):
    def __init__(self, num_users, num_items, num_cats, num_dense=2, embed_dim=16):
        super(NCFModel, self).__init__()
        self.user_embed = nn.Embedding(num_users, embed_dim)
        self.item_embed = nn.Embedding(num_items, embed_dim)
        self.cat_embed = nn.Embedding(num_cats, embed_dim // 2)
        self.dense_layer = nn.Linear(num_dense, 8)
        input_dim = embed_dim * 2 + (embed_dim // 2) + 8
        self.fc1 = nn.Linear(input_dim, 64)
        self.bn1 = nn.BatchNorm1d(64)
        self.fc2 = nn.Linear(64, 32)
        self.output = nn.Linear(32, 1)
        self.relu = nn.ReLU()

    def forward(self, user, item, cat, dense):
        u = self.user_embed(user)
        i = self.item_embed(item)
        c = self.cat_embed(cat)
        d = self.relu(self.dense_layer(dense))
        vector = torch.cat([u, i, c, d], dim=-1)
        x = self.relu(self.bn1(self.fc1(vector)))
        x = self.relu(self.fc2(x))
        pred = self.output(x)
        return pred

def calculate_sigmoid_percentage(score):
    mu = 3.5
    scale = 0.5
    x_transformed = (score - mu) / scale
    sigmoid = 1 / (1 + math.exp(-x_transformed))
    return int(sigmoid * 100)

def calculate_percentage(score):
    pct = max(0, score) * 100
    return int(pct)

# == APP SETUP ==

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Loading KNN Model...")
    try:
        with open(KNN_PATH, "rb") as f:
            ml_models["knn"] = pickle.load(f)
        print("KNN Model loaded successfully!")
    except Exception as e:
        print(f"Failed to load KNN model: {e}")
        ml_models["knn"] = None

    print("Loading SVD++ Model...")
    try:
        _, loaded_algo = dump.load(SVDPP_PATH)
        ml_models["svdpp"] = loaded_algo
        
        trainset = loaded_algo.trainset
        all_raw_ids = [trainset.to_raw_iid(i) for i in trainset.all_items()]
        ml_models["svdpp_all_items"] = all_raw_ids
        
        print(f"SVD++ loaded successfully with {len(all_raw_ids)} items.")
    except Exception as e:
        print(f"Failed to load SVD++: {e}")
        ml_models["svdpp"] = None
            
    print("Loading NCF Model...")
    try:
        with open(NCF_PATH, "rb") as f:
            checkpoint = pickle.load(f)
        
        # Reconstruct encoders
        le_user = checkpoint['le_user']
        le_item = checkpoint['le_item']
        le_cat = checkpoint['le_cat']
        
        # Initialize Model
        model = NCFModel(
            num_users=len(le_user.classes_),
            num_items=len(le_item.classes_),
            num_cats=len(le_cat.classes_),
            embed_dim=checkpoint['embed_dim']
        )
        # Load weights
        model.load_state_dict(checkpoint['model_state'])
        model.eval() # Set to evaluation mode
        
        # Store in global dictionary
        ml_models["ncf"] = model
        ml_models["le_user"] = le_user
        ml_models["le_item"] = le_item
        ml_models["le_cat"] = le_cat
        ml_models["scaler"] = checkpoint['scaler']
        
        # We need to know the Category Index for every Item Index
        item_meta_df = checkpoint['item_meta']
        # Map raw category to encoded category
        item_meta_df['c_idx'] = le_cat.transform(item_meta_df['category'])
        # Map raw item to encoded item
        item_meta_df['i_idx'] = le_item.transform(item_meta_df['itemId'])
        
        # Create lookup array: Index = i_idx, Value = c_idx
        num_items = len(le_item.classes_)
        c_idx_lookup = np.zeros(num_items, dtype=int)
        c_idx_lookup[item_meta_df['i_idx'].values] = item_meta_df['c_idx'].values
        
        ml_models["c_idx_lookup"] = torch.tensor(c_idx_lookup, dtype=torch.long)
        ml_models["all_item_indices"] = torch.arange(num_items, dtype=torch.long)
        
        print("NCF Model loaded successfully!")
    except Exception as e:
        print(f"Failed to load model: {e}")
        ml_models["ncf"] = None

    print("Loading CBF Model...")
    try:
        with open(CBF_PATH, "rb") as f:
            ml_models["cbf"] = pickle.load(f)
        print("CBF Model loaded successfully!")
    except Exception as e:
        print(f"Failed to load CBF model: {e}")
        ml_models["cbf"] = None
        
    yield
    ml_models.clear()

app = FastAPI(lifespan=lifespan)

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        
    allow_credentials=True,
    allow_methods=["*"],          
    allow_headers=["*"],          
)

# == CONTROLLERS ==

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def fetch_db_details(item_ids, scores):
    placeholders = ','.join('?' for _ in item_ids)
    query = f"SELECT * FROM items WHERE itemId IN ({placeholders})"
    
    conn = get_db_connection()
    rows = conn.execute(query, list(map(int, item_ids))).fetchall()
    conn.close()
    
    db_items = {row['itemId']: dict(row) for row in rows}
    
    results = []
    for i, iid in enumerate(item_ids):
        if iid in db_items:
            item_data = db_items[iid]
            item_data['ai_score'] = f"{scores[i]:.4f}" # Raw Cosine Score
            item_data['match_percentage'] = f"{calculate_percentage(scores[i])}% Match"
            results.append(item_data)
            
    return {"recommendations": results}

# == ENDPOINTS ==

@app.get("/api/recommend_knn/{user_id}", tags=["Recommendations"])
def recommend_knn_user(user_id: int, k: int = 10):
    if ml_models["knn"] is None:
        raise HTTPException(status_code=503, detail="KNN model not loaded")
    
    package = ml_models["knn"]
    
    model = package["model"]
    matrix = package["matrix"]
    idx_to_item = package["idx_to_item"]
    user_history = package["user_history"].get(user_id, set())

    if user_id not in package["user_to_idx"]:
        return {"user_id": user_id, "note": "Cold Start", "recommendations": []}
    
    u_idx = package["user_to_idx"][user_id]
    user_interactions = matrix.T[u_idx]
    seen_item_indices = user_interactions.indices

    candidates = {}

    if len(seen_item_indices) == 0:
        return {"user_id": user_id, "note": "No interactions found", "recommendations": []}
    
    distances, indices = model.kneighbors(matrix[seen_item_indices], n_neighbors=10)

    for i in range(len(seen_item_indices)):
        for j in range(len(distances[i])):
            neighbor_idx = indices[i][j]
            dist = distances[i][j]
            
            if idx_to_item[neighbor_idx] in user_history:
                continue
            
            # convert cosine distance to cosine similarity
            similarity = 1 - dist
            
            # add similarity scores if recommended by multiple source items
            if neighbor_idx not in candidates:
                candidates[neighbor_idx] = 0
            candidates[neighbor_idx] += similarity
        
    sorted_candidates = sorted(candidates.items(), key=lambda x: x[1], reverse=True)[:k]
    
    ids = [idx_to_item[idx] for idx, score in sorted_candidates]
    scores = [score for idx, score in sorted_candidates]
    
    return fetch_db_details(ids, scores)

@app.get("/api/recommend_knn/{user_id}/context/{item_id}", tags=["Recommendations"])
def recommend_knn_context(user_id: int, item_id: int, k: int = 10):
    if ml_models["knn"] is None:
        raise HTTPException(status_code=503, detail="KNN model not loaded")
        
    package = ml_models["knn"]
    
    model = package["model"]
    matrix = package["matrix"]
    item_to_idx = package['item_to_idx']
    idx_to_item = package["idx_to_item"]
    user_history = package["user_history"].get(user_id, set())
    
    if item_id not in item_to_idx:
        raise HTTPException(status_code=404, detail="Item not found")

    seed_idx = item_to_idx[item_id]

    distances, indices = model.kneighbors(matrix[seed_idx], n_neighbors=k+5)

    ids = []
    scores = []
    
    for dist, neighbor_idx in zip(distances[0], indices[0]):
        if neighbor_idx == seed_idx:
            continue
                    
        real_id = idx_to_item[neighbor_idx]
        
        # don't show what they already bought
        if real_id in user_history:
            continue
            
        # Convert cosine distance back to cosine similarity
        score = 1 - dist
        
        ids.append(real_id)
        scores.append(score)
        
        if len(ids) >= k:
            break
    
    if not ids:
        return {"user_id": user_id, "item_id": item_id, "note": "No recommendations found", "recommendations": []}
            
    return fetch_db_details(ids, scores)

@app.get("/api/recommend_svdpp/{user_id}", tags=["Recommendations"])
def recommend_svdpp_user(user_id: int, k: int = 10):
    if ml_models["svdpp"] is None:
        raise HTTPException(status_code=503, detail="SVD++ model not loaded")
    
    algo = ml_models["svdpp"]
    all_item_ids = ml_models.get("svdpp_all_items", [])
    
    # fallback if cache empty
    if not all_item_ids:
        conn = get_db_connection()
        rows = conn.execute("SELECT itemId FROM items").fetchall()
        conn.close()
        all_item_ids = [row['itemId'] for row in rows]
        ml_models["svdpp_all_items"] = all_item_ids

    # predict rating for every candidate item
    predictions = []
    for iid in all_item_ids:
        pred = algo.predict(user_id, iid)
        predictions.append((iid, pred.est))
    
    # sort
    predictions.sort(key=lambda x: x[1], reverse=True)
    top_k = predictions[:k]
    
    final_ids = [pid for pid, score in top_k]
    final_scores = [score / 5.0 for pid, score in top_k]
    
    results = fetch_db_details(final_ids, final_scores)
    
    # for i, item in enumerate(results["recommendations"]):
    #     item['match_percentage'] = f"{calculate_sigmoid_percentage(final_scores[i])}% Match"
        
    return results

@app.get("/api/recommend_svdpp/{user_id}/context/{item_id}", tags=["Recommendations"])
def recommend_svdpp_context(user_id: int, item_id: int, k: int = 10):
    if ml_models["svdpp"] is None:
        raise HTTPException(status_code=503, detail="SVD++ model not loaded")
        
    algo = ml_models["svdpp"]
    
    # get item
    try:
        inner_id = algo.trainset.to_inner_iid(item_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Item not found in model")

    # get item factors (The Latent Matrix Q)
    item_factors = algo.qi
    seed_vector = item_factors[inner_id].reshape(1, -1)
    
    # calculate simiarity
    sim_scores = cosine_similarity(seed_vector, item_factors).flatten()
    
    # get candidate pool (Top 50 Similar Items)
    candidate_inner_ids = sim_scores.argsort()[::-1][1:51] # skip 0 (itself)
    
    # rerank these candidates by User's Predicted Rating
    ranked_candidates = []
    
    for inner_iid in candidate_inner_ids:
        raw_iid = algo.trainset.to_raw_iid(inner_iid)
        
        pred = algo.predict(user_id, raw_iid)
        
        ranked_candidates.append((raw_iid, pred.est))
        
    # sort and top k
    ranked_candidates.sort(key=lambda x: x[1], reverse=True)
    top_k = ranked_candidates[:k]
    
    final_ids = [pid for pid, score in top_k]
    final_scores = [score / 5.0 for pid, score in top_k]
    
    results = fetch_db_details(final_ids, final_scores)
    
    # for i, item in enumerate(results["recommendations"]):
    #     item['match_percentage'] = f"{calculate_sigmoid_percentage(final_scores[i])}% Match"
        
    return results

@app.get("/api/recommend_ncf/{user_id}", tags=["Recommendations"])
def recommend_ncf_user(user_id: int, k: int = 10):
    if ml_models["ncf"] is None:
        raise HTTPException(status_code=503, detail="Model not available")
        
    le_user = ml_models["le_user"]
    le_item = ml_models["le_item"]
    
    if user_id not in le_user.classes_:
        conn = get_db_connection()
        items = conn.execute("SELECT * FROM items ORDER BY RANDOM() LIMIT ?", (k,)).fetchall()
        conn.close()
        return {"user_id": user_id, "type": "popular_fallback", "recommendations": [dict(i) for i in items]}

    # Prepare Inference Tensors
    u_idx = le_user.transform([user_id])[0]
    num_items = len(le_item.classes_)
    
    # User Tensor: [u_idx, u_idx, u_idx...]
    user_tensor = torch.tensor([u_idx] * num_items, dtype=torch.long)
    
    # Item Tensor: [0, 1, 2, ... N]
    item_tensor = ml_models["all_item_indices"]
    
    # Category Tensor: Lookup from pre-computed array
    cat_tensor = ml_models["c_idx_lookup"]
    
    # Dense Tensor: (Interaction=0, Time=Max)
    # Note: In a real app, you might want to pass 'current_time' from the client
    dummy_dense = np.zeros((num_items, 2)) # [0, 0]
    scaled_dense = ml_models["scaler"].transform(dummy_dense)
    dense_tensor = torch.tensor(scaled_dense, dtype=torch.float32)
    
    model = ml_models["ncf"]
    with torch.no_grad():
        preds = model(user_tensor, item_tensor, cat_tensor, dense_tensor).flatten()
        
    # Sort and Top K
    top_indices = preds.argsort(descending=True)[:k]
    top_scores = preds[top_indices]
    
    # Convert Indices back to Real Item IDs
    top_item_ids = le_item.inverse_transform(top_indices.numpy())

    top_scores /= 6.5

    results = fetch_db_details(top_item_ids, top_scores.numpy())

    # for i, item in enumerate(results["recommendations"]):
    #     item['match_percentage'] = f"{calculate_sigmoid_percentage(top_scores[i])}% Match"

    return results

@app.get("/api/recommend_ncf/{user_id}/context/{item_id}", tags=["Recommendations"])
def recommend_ncf_context(user_id: int, item_id: int, k: int = 10):
    # Check model status
    if ml_models["ncf"] is None:
        raise HTTPException(status_code=503, detail="Model not available")
    
    le_user = ml_models["le_user"]
    le_item = ml_models["le_item"]
    model = ml_models["ncf"]
    
    if user_id not in le_user.classes_:
        raise HTTPException(status_code=404, detail="User not found")
    if item_id not in le_item.classes_:
        raise HTTPException(status_code=404, detail="Item not found")
        
    target_u_idx = le_user.transform([user_id])[0]
    seed_i_idx = le_item.transform([item_id])[0]
    
    with torch.no_grad():
        # Shape: [1, embed_dim]
        seed_vector = model.item_embed(torch.tensor(seed_i_idx))
        
        # Get all item embeddings
        all_item_vectors = model.item_embed.weight # Shape: [Num_Items, embed_dim]
        
        # Calculate similarity between seed and ALL items
        sim_scores = F.cosine_similarity(seed_vector, all_item_vectors)
        
        # Get Top 50 "Similar" Candidates
        candidate_indices = sim_scores.argsort(descending=True)[1:51] # Skip 0 (itself)
        
        # Re-Rank these 50 candidates using the NCF User Prediction
        
        # Prepare Batch for NCF
        num_candidates = len(candidate_indices)
        user_tensor = torch.tensor([target_u_idx] * num_candidates, dtype=torch.long)
        item_tensor = candidate_indices
        
        # Look up categories for these specific candidates
        cat_tensor = ml_models["c_idx_lookup"][candidate_indices]
        
        # Dense features (Fresh context)
        dummy_dense = np.zeros((num_candidates, 2))
        scaled_dense = ml_models["scaler"].transform(dummy_dense)
        dense_tensor = torch.tensor(scaled_dense, dtype=torch.float32)
        
        # Predict Ratings
        preds = model(user_tensor, item_tensor, cat_tensor, dense_tensor).flatten()
        
        # Final Sort (Combine Similarity + User Rating)
        top_k_indices = preds.argsort(descending=True)[:k]
        
        # Map back to real IDs
        # Note: We need to map from the 'candidate_indices' subset, not the full array
        final_item_indices = candidate_indices[top_k_indices]
        final_item_ids = le_item.inverse_transform(final_item_indices.numpy())
        final_scores = preds[top_k_indices]
    
    final_scores /= 6.5

    results = fetch_db_details(final_item_ids, final_scores.numpy())

    # for i, item in enumerate(results["recommendations"]):
    #     item['match_percentage'] = f"{calculate_sigmoid_percentage(final_scores[i])}% Match"

    return results

@app.get("/api/recommend_cbf/{user_id}", tags=["Recommendations"])
def recommend_cbf_user(user_id: int, k: int = 10):
    model = ml_models["cbf"]
    if model is None:
        raise HTTPException(status_code=503, detail="CBF Model not loaded")

    user_map = model['user_map']
    item_ids = model['item_ids']
    
    # cold start check
    if user_id not in user_map:
        return {"user_id": user_id, "note": "Cold Start", "recommendations": []}

    u_idx = user_map[user_id]
    user_vector = model['user_matrix'][u_idx]

    # similarity to all items
    scores = cosine_similarity(user_vector, model['item_matrix']).flatten()

    # top K
    top_indices = scores.argsort()[-k:][::-1]
    
    top_item_ids = item_ids[top_indices]
    top_scores = scores[top_indices]
    
    return fetch_db_details(top_item_ids, top_scores)

@app.get("/api/recommend_cbf/{user_id}/context/{item_id}", tags=["Recommendations"])
def recommend_cbf_context(user_id: int, item_id: int, k: int = 10):
    model = ml_models["cbf"]
    if model is None:
        raise HTTPException(status_code=503, detail="CBF Model not loaded")

    user_map = model['user_map']
    item_map = model['item_map']
    
    if user_id not in user_map:
         raise HTTPException(status_code=404, detail="User not found in profile")
    if item_id not in item_map:
         raise HTTPException(status_code=404, detail="Item not found in catalog")

    u_idx = user_map[user_id]
    i_idx = item_map[item_id]
    
    user_vector = model['user_matrix'][u_idx]
    target_item_vector = model['item_matrix'][i_idx]

    # calculate user affinity
    user_scores = cosine_similarity(user_vector, model['item_matrix']).flatten()
    
    # calculate item similarity
    item_scores = cosine_similarity(target_item_vector, model['item_matrix']).flatten()

    alpha = 0.7 # user affinity * (1-weight) + item similarity * weight
    final_scores = (item_scores * alpha) + (user_scores * (1 - alpha))

    # top K
    top_indices = final_scores.argsort()[-(k+1):][::-1] # Get k+1 in case self is there
    
    final_ids = model['item_ids'][top_indices]
    final_vals = final_scores[top_indices]
    
    # filter out the context item itself
    clean_ids = []
    clean_scores = []
    for iid, sc in zip(final_ids, final_vals):
        if iid != item_id:
            clean_ids.append(iid)
            clean_scores.append(sc)
        if len(clean_ids) == k:
            break
            
    return fetch_db_details(clean_ids, clean_scores)

@app.get("/api/products/{item_id}", tags=["Products"])
def get_product_details(item_id: int):
    conn = get_db_connection()
    product = conn.execute("SELECT * FROM items WHERE itemId = ?", (item_id,)).fetchone()
    conn.close()
    if product is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return dict(product)

@app.get("/api/products/{page_num}/page/{page_size}", tags=["Products"])
def get_products_paginated(page_num: int, page_size: int):
    conn = get_db_connection()
    offset = (page_num - 1) * page_size
    products = conn.execute("SELECT * FROM items LIMIT ? OFFSET ?", (page_size, offset)).fetchall()
    conn.close()
    return [dict(p) for p in products]

@app.get("/api/users/", tags=["Users"])
def get_all_user_profiles():
    conn = get_db_connection()
    profiles = conn.execute("SELECT * FROM users").fetchall()
    conn.close()
    return [dict(p) for p in profiles]

@app.get("/api/users/{user_id}", tags=["Users"])
def get_user_profile(user_id: int):
    conn = get_db_connection()
    profile = conn.execute("SELECT * FROM users WHERE userId = ?", (user_id,)).fetchone()
    if profile is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_data = dict(profile)

    raw_history = user_data.get("purchase_history", "[]")
    item_ids = []

    try:
        if isinstance(raw_history, str):
            item_ids = ast.literal_eval(raw_history)
        elif isinstance(raw_history, list):
            item_ids = raw_history
    except Exception:
        item_ids = []

    item_details = []

    if item_ids:
        unique_ids = list(set(item_ids))
            
        # Dynamic SQL for "WHERE itemId IN (?, ?, ?)"
        placeholders = ','.join('?' for _ in unique_ids)
        query = f"SELECT * FROM items WHERE itemId IN ({placeholders})"
        
        # Execute query
        item_rows = conn.execute(query, unique_ids).fetchall()
        
        # Create a Lookup Dictionary: ID -> Item Data
        item_lookup = {row['itemId']: dict(row) for row in item_rows}
        
        # Reconstruct the full history list (preserving order and duplicates)
        for iid in item_ids:
            if iid in item_lookup:
                item_details.append(item_lookup[iid])

    # Attach details to response
    user_data['purchase_history_details'] = item_details
    
    conn.close()
    return user_data