from dotenv import load_dotenv
load_dotenv()

import os
import json
from typing import Dict, List, Any
import google.generativeai as genai
from PIL import Image
import io

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

EXTRACTION_PROMPT = """
Extract ALL invoice data from this document and return ONLY valid JSON:

{
  "invoices": [
    {
      "serial_number": "invoice number or INV-001",
      "customer_name": "customer name",
      "product_name": "product name",
      "quantity": number,
      "tax": number,
      "total_amount": number,
      "date": "YYYY-MM-DD or MISSING",
      "discount": number or 0,
      "payment_mode": "payment type or MISSING",
      "notes": "notes or MISSING"
    }
  ],
  "products": [
    {
      "name": "product name",
      "quantity": total quantity,
      "unit_price": price per unit,
      "tax": tax amount,
      "price_with_tax": total with tax,
      "discount": discount or 0,
      "sku": "SKU or MISSING"
    }
  ],
  "customers": [
    {
      "customer_name": "customer name",
      "phone_number": "phone or MISSING",
      "total_purchase_amount": total amount,
      "email": "email or MISSING",
      "address": "address or MISSING"
    }
  ]
}

Rules:
- Extract ALL invoices/line items
- Use "MISSING" for unavailable fields
- Return ONLY JSON, no markdown
- All numbers must be numeric
"""

async def extract_with_ai(file_path: str, file_type: str) -> Dict[str, List[Dict[str, Any]]]:
    """Use Gemini Vision to extract data"""
    try:
        if not GEMINI_API_KEY:
            raise Exception("GEMINI_API_KEY not set")
        
        model = genai.GenerativeModel('gemini-2.5-flash')
        image = load_file_as_image(file_path, file_type)
        response = model.generate_content([EXTRACTION_PROMPT, image])
        
        response_text = response.text.strip()
        response_text = clean_json_response(response_text)
        
        extracted_data = json.loads(response_text)
        extracted_data = validate_structure(extracted_data)
        extracted_data = normalize_data(extracted_data)
        
        return extracted_data
        
    except json.JSONDecodeError as e:
        raise Exception(f"AI returned invalid JSON: {str(e)}")
    except Exception as e:
        raise Exception(f"AI extraction failed: {str(e)}")

def load_file_as_image(file_path: str, file_type: str) -> Image.Image:
    """Load PDF or image"""
    try:
        if file_type == '.pdf':
            try:
                from pdf2image import convert_from_path
                images = convert_from_path(file_path, first_page=1, last_page=1, dpi=300)
                return images[0]
            except ImportError:
                try:
                    import fitz
                    doc = fitz.open(file_path)
                    page = doc[0]
                    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
                    img_data = pix.tobytes("png")
                    return Image.open(io.BytesIO(img_data))
                except ImportError:
                    raise Exception("Install: pip install PyMuPDF")
        else:
            return Image.open(file_path)
    except Exception as e:
        raise Exception(f"Failed to load file: {str(e)}")

def clean_json_response(text: str) -> str:
    """Clean AI response"""
    if '```json' in text:
        text = text.split('```json')[1].split('```')[0]
    elif '```' in text:
        text = text.split('```')[1].split('```')[0]
    return text.strip()

def validate_structure(data: Dict) -> Dict:
    """Ensure required keys exist"""
    if 'invoices' not in data:
        data['invoices'] = []
    if 'products' not in data:
        data['products'] = []
    if 'customers' not in data:
        data['customers'] = []
    return data

def normalize_data(data: Dict) -> Dict:
    """Normalize data types"""
    for invoice in data.get('invoices', []):
        invoice['serial_number'] = str(invoice.get('serial_number', 'MISSING'))
        invoice['customer_name'] = str(invoice.get('customer_name', 'MISSING'))
        invoice['product_name'] = str(invoice.get('product_name', 'MISSING'))
        invoice['quantity'] = safe_int(invoice.get('quantity', 1))
        invoice['tax'] = safe_float(invoice.get('tax', 0))
        invoice['total_amount'] = safe_float(invoice.get('total_amount', 0))
        invoice['date'] = str(invoice.get('date', 'MISSING'))
        invoice['discount'] = safe_float(invoice.get('discount', 0))
        invoice['payment_mode'] = str(invoice.get('payment_mode', 'MISSING'))
        invoice['notes'] = str(invoice.get('notes', 'MISSING'))
    
    for product in data.get('products', []):
        product['name'] = str(product.get('name', 'MISSING'))
        product['quantity'] = safe_int(product.get('quantity', 0))
        product['unit_price'] = safe_float(product.get('unit_price', 0))
        product['tax'] = safe_float(product.get('tax', 0))
        product['price_with_tax'] = safe_float(product.get('price_with_tax', 0))
        product['discount'] = safe_float(product.get('discount', 0))
        product['sku'] = str(product.get('sku', 'MISSING'))
    
    for customer in data.get('customers', []):
        customer['customer_name'] = str(customer.get('customer_name', 'MISSING'))
        customer['phone_number'] = str(customer.get('phone_number', 'MISSING'))
        customer['total_purchase_amount'] = safe_float(customer.get('total_purchase_amount', 0))
        customer['email'] = str(customer.get('email', 'MISSING'))
        customer['address'] = str(customer.get('address', 'MISSING'))
    
    return data

def safe_float(value) -> float:
    """Safely convert to float"""
    if value is None:
        return 0.0
    try:
        return float(value)
    except:
        return 0.0

def safe_int(value) -> int:
    """Safely convert to int"""
    if value is None:
        return 0
    try:
        return int(float(value))
    except:
        return 0