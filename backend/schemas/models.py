from pydantic import BaseModel
from typing import Optional, List

class Invoice(BaseModel):
    serial_number: str
    customer_name: str
    product_name: str
    quantity: int
    tax: float
    total_amount: float
    date: str
    discount: float = 0.0
    payment_mode: str = "MISSING"
    notes: str = "MISSING"

class Product(BaseModel):
    name: str
    quantity: int
    unit_price: float
    tax: float
    price_with_tax: float
    discount: float = 0.0
    sku: str = "MISSING"

class Customer(BaseModel):
    customer_name: str
    phone_number: str
    total_purchase_amount: float
    email: str = "MISSING"
    address: str = "MISSING"