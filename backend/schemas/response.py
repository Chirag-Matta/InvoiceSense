from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date

# schemas/response.py
class ExtractionResponse(BaseModel):
    invoices: List[Invoice]
    products: List[Product]
    customers: List[Customer]
    success: bool = True
    message: str = "Data extracted successfully"