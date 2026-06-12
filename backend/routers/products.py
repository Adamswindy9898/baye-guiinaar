import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import firebase_admin
from firebase_admin import firestore

router = APIRouter()

db = firestore.client()


class ProductCreate(BaseModel):
    name: str
    description: str = ""
    price: int
    unit: str = "pièce"
    category: str = "poulets"
    stock: int = 0
    seller_id: str
    seller_name: str
    location: str = "Thiès"


@router.get("/")
async def list_products(category: Optional[str] = None, location: Optional[str] = None):
    ref = db.collection("products")

    if category:
        ref = ref.where("category", "==", category)
    if location:
        ref = ref.where("location", "==", location)

    products = ref.where("available", "==", True).stream()
    return [{"id": p.id, **p.to_dict()} for p in products]


@router.get("/{product_id}")
async def get_product(product_id: str):
    doc = db.collection("products").document(product_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Produit introuvable")
    return {"id": doc.id, **doc.to_dict()}


@router.post("/")
async def create_product(product: ProductCreate):
    data = {
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "unit": product.unit,
        "category": product.category,
        "stock": product.stock,
        "sellerId": product.seller_id,
        "seller": product.seller_name,
        "location": product.location,
        "available": True,
        "image": "/images/default.jpg",
        "createdAt": firestore.SERVER_TIMESTAMP,
    }

    doc_ref = db.collection("products").add(data)
    return {"success": True, "id": doc_ref[1].id}


@router.delete("/{product_id}")
async def delete_product(product_id: str):
    doc_ref = db.collection("products").document(product_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Produit introuvable")
    doc_ref.delete()
    return {"success": True}
