import os
import time
from collections import defaultdict
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from dotenv import load_dotenv

from routers import payments, orders, products

load_dotenv()

app = FastAPI(title="SenAgro Market API", version="1.0.0", docs_url=None, redoc_url=None)

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,https://senagro.sn,https://senegal-agro-market.vercel.app"
).split(",")

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "senagro.sn", "*.vercel.app", "127.0.0.1"],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

# Rate limiting simple en memoire
rate_limit_store: dict[str, list[float]] = defaultdict(list)
RATE_LIMIT = 60
RATE_WINDOW = 60


@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host if request.client else "unknown"
    now = time.time()
    rate_limit_store[client_ip] = [t for t in rate_limit_store[client_ip] if now - t < RATE_WINDOW]
    if len(rate_limit_store[client_ip]) >= RATE_LIMIT:
        raise HTTPException(status_code=429, detail="Trop de requetes. Reessayez plus tard.")
    rate_limit_store[client_ip].append(now)
    response = await call_next(request)
    return response

app.include_router(payments.router, prefix="/api/payments", tags=["Paiements"])
app.include_router(orders.router, prefix="/api/orders", tags=["Commandes"])
app.include_router(products.router, prefix="/api/products", tags=["Produits"])


@app.get("/")
def root():
    return {"message": "SenAgro Market API", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "ok"}
