import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import firebase_admin
from firebase_admin import credentials, firestore

router = APIRouter()

# Initialiser Firebase Admin
if not firebase_admin._apps:
    cred_path = os.getenv("FIREBASE_SERVICE_ACCOUNT", "serviceAccountKey.json")
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    else:
        firebase_admin.initialize_app()

db = firestore.client()


class OrderItem(BaseModel):
    product_id: str
    name: str
    price: int
    quantity: int


class CreateOrderRequest(BaseModel):
    customer_id: str
    customer_name: str
    customer_phone: str
    customer_address: str
    customer_city: str
    seller_id: str
    items: list[OrderItem]
    total: int
    payment_method: str = "wave"


@router.post("/create")
async def create_order(req: CreateOrderRequest):
    order_data = {
        "customerId": req.customer_id,
        "customerName": req.customer_name,
        "customerPhone": req.customer_phone,
        "customerAddress": req.customer_address,
        "customerCity": req.customer_city,
        "sellerId": req.seller_id,
        "items": [item.model_dump() for item in req.items],
        "total": req.total,
        "paymentMethod": req.payment_method,
        "status": "pending",
        "paymentStatus": "pending",
        "createdAt": firestore.SERVER_TIMESTAMP,
    }

    doc_ref = db.collection("orders").add(order_data)
    order_id = doc_ref[1].id

    return {"success": True, "order_id": order_id}


@router.get("/{order_id}")
async def get_order(order_id: str):
    doc = db.collection("orders").document(order_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Commande introuvable")
    return {"id": doc.id, **doc.to_dict()}


@router.get("/customer/{customer_id}")
async def get_customer_orders(customer_id: str):
    orders = db.collection("orders").where("customerId", "==", customer_id).stream()
    return [{"id": o.id, **o.to_dict()} for o in orders]


@router.patch("/{order_id}/status")
async def update_order_status(order_id: str, status: str, payment_status: Optional[str] = None):
    doc_ref = db.collection("orders").document(order_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Commande introuvable")

    update = {"status": status}
    if payment_status:
        update["paymentStatus"] = payment_status

    doc_ref.update(update)
    return {"success": True}
