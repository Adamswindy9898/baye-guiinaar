import os
import hmac
import hashlib
import httpx
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, field_validator

router = APIRouter()

PAYDUNYA_BASE_URL = os.getenv("PAYDUNYA_BASE_URL", "https://app.paydunya.com/sandbox-api/v1")
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

    @field_validator("amount")
    @classmethod
    def amount_must_be_positive(cls, v: int) -> int:
        if v <= 0:
            raise ValueError("Le montant doit etre positif")
        return v

    @field_validator("customer_phone")
    @classmethod
    def phone_must_be_valid(cls, v: str) -> str:
        cleaned = v.replace(" ", "").replace("+", "").replace("-", "")
        if not cleaned.isdigit() or len(cleaned) < 9:
            raise ValueError("Numero de telephone invalide")
        return v


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
async def payment_callback(request: Request):
    body = await request.body()
    signature = request.headers.get("X-PayDunya-Signature", "")

    expected_sig = hmac.new(
        PAYDUNYA_MASTER_KEY.encode(),
        body,
        hashlib.sha512
    ).hexdigest()

    if not hmac.compare_digest(signature, expected_sig):
        raise HTTPException(status_code=403, detail="Signature invalide")

    data = await request.json()
    order_id = data.get("custom_data", {}).get("order_id")
    status = data.get("status")

    if not order_id:
        raise HTTPException(status_code=400, detail="order_id manquant")

    return {"status": "received", "order_id": order_id, "payment_status": status}


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
