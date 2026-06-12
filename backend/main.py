from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routers import payments, orders, products

load_dotenv()

app = FastAPI(title="SenAgro Market API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://senagro.sn"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(payments.router, prefix="/api/payments", tags=["Paiements"])
app.include_router(orders.router, prefix="/api/orders", tags=["Commandes"])
app.include_router(products.router, prefix="/api/products", tags=["Produits"])


@app.get("/")
def root():
    return {"message": "SenAgro Market API", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "ok"}
