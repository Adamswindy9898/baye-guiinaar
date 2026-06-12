import os
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

PAYDUNYA_BASE_URL = "https://app.paydunya.com/sandbox-api/v1"
PAYDUNYA_MASTER_KEY = os.getenv("PAYDUNYA_MASTER_KEY", "")
PAYDUNYA_PRIVATE_KEY = os.getenv("PAYDUNYA_PRIVATE_KEY", "")
PAYDUNYA_TOKEN = os.getenv("PAYDUNYA_TOKEN", "")


class PaymentRequest(BaseModel):
    order_id: str
    amount: int
    description: str
    customer_name: str
    customer_phone: str
    customer_email: str = ""


class PaymentCallback(BaseModel):
    data: dict


@router.post("/initiate")
async def initiate_payment(req: PaymentRequest):
    headers = {
        "PAYDUNYA-MASTER-KEY": PAYDUNYA_MASTER_KEY,
        "PAYDUNYA-PRIVATE-KEY": PAYDUNYA_PRIVATE_KEY,
        "PAYDUNYA-TOKEN": PAYDUNYA_TOKEN,
        "Content-Type": "application/json",
    }

    payload = {
        "invoice": {
            "total_amount": req.amount,
            "description": req.description,
        },
        "store": {
            "name": "SenAgro Market",
            "tagline": "Marketplace Agricole du Sénégal",
            "phone": "221770000000",
            "website_url": "https://senagro.sn",
        },
        "custom_data": {
            "order_id": req.order_id,
            "customer_name": req.customer_name,
            "customer_phone": req.customer_phone,
        },
        "actions": {
            "callback_url": os.getenv("BACKEND_URL", "http://localhost:8000") + "/api/payments/callback",
            "return_url": os.getenv("FRONTEND_URL", "http://localhost:3000") + "/commande/confirmation",
            "cancel_url": os.getenv("FRONTEND_URL", "http://localhost:3000") + "/panier",
        },
    }

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{PAYDUNYA_BASE_URL}/checkout-invoice/create",
            json=payload,
            headers=headers,
        )

    data = resp.json()

    if data.get("response_code") == "00":
        return {
            "success": True,
            "payment_url": data["response_text"],
            "token": data.get("token"),
        }

    raise HTTPException(status_code=400, detail=data.get("response_text", "Erreur de paiement"))


@router.post("/callback")
async def payment_callback(callback: PaymentCallback):
    # PayDunya envoie les données de confirmation ici
    # Mettre à jour le statut de la commande dans Firestore
    return {"status": "received"}


@router.get("/verify/{token}")
async def verify_payment(token: str):
    headers = {
        "PAYDUNYA-MASTER-KEY": PAYDUNYA_MASTER_KEY,
        "PAYDUNYA-PRIVATE-KEY": PAYDUNYA_PRIVATE_KEY,
        "PAYDUNYA-TOKEN": PAYDUNYA_TOKEN,
    }

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{PAYDUNYA_BASE_URL}/checkout-invoice/confirm/{token}",
            headers=headers,
        )

    data = resp.json()
    return {
        "status": data.get("status"),
        "amount": data.get("invoice", {}).get("total_amount"),
        "customer": data.get("custom_data", {}),
    }
