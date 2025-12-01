import openpyxl
from typing import Dict, List, Any
from datetime import datetime

def parse_excel(file_path: str) -> Dict[str, List[Dict[str, Any]]]:
    """Parse Excel file and extract invoice data"""
    try:
        workbook = openpyxl.load_workbook(file_path)
        sheet = workbook.active
        
        # Get headers
        headers = []
        for cell in sheet[1]:
            if cell.value:
                headers.append(str(cell.value).strip().lower())
        
        # Header mappings
        header_map = {
            'serial number': 'serial_number',
            'serial no': 'serial_number',
            'invoice number': 'serial_number',
            'invoice no': 'serial_number',
            'customer name': 'customer_name',
            'customer': 'customer_name',
            'product name': 'product_name',
            'product': 'product_name',
            'item': 'product_name',
            'quantity': 'quantity',
            'qty': 'quantity',
            'tax': 'tax',
            'total': 'total_amount',
            'total amount': 'total_amount',
            'amount': 'total_amount',
            'date': 'date',
            'invoice date': 'date',
            'phone': 'phone_number',
            'phone number': 'phone_number',
            'contact': 'phone_number',
            'price': 'unit_price',
            'unit price': 'unit_price',
            'rate': 'unit_price',
            'discount': 'discount',
            'email': 'email',
            'address': 'address',
        }
        
        # Normalize headers
        normalized_headers = []
        for h in headers:
            normalized = header_map.get(h, h.replace(' ', '_'))
            normalized_headers.append(normalized)
        
        # Extract data
        invoices = []
        products_map = {}
        customers_map = {}
        
        for row_idx, row in enumerate(sheet.iter_rows(min_row=2, values_only=True), start=2):
            if not any(row):
                continue
            
            row_data = {}
            for idx, value in enumerate(row):
                if idx < len(normalized_headers):
                    row_data[normalized_headers[idx]] = value
            
            # Extract invoice
            invoice = {
                'serial_number': str(row_data.get('serial_number', f'INV-{row_idx}')),
                'customer_name': str(row_data.get('customer_name', 'MISSING')),
                'product_name': str(row_data.get('product_name', 'MISSING')),
                'quantity': safe_int(row_data.get('quantity', 1)),
                'tax': safe_float(row_data.get('tax', 0)),
                'total_amount': safe_float(row_data.get('total_amount', 0)),
                'date': format_date(row_data.get('date')),
                'discount': safe_float(row_data.get('discount', 0)),
                'payment_mode': str(row_data.get('payment_mode', 'MISSING')),
                'notes': str(row_data.get('notes', 'MISSING'))
            }
            invoices.append(invoice)
            
            # Extract product
            product_name = invoice['product_name']
            if product_name != 'MISSING':
                unit_price = row_data.get('unit_price', 0)
                if not unit_price and invoice['total_amount'] and invoice['quantity']:
                    unit_price = (invoice['total_amount'] - invoice['tax']) / invoice['quantity']
                
                if product_name not in products_map:
                    products_map[product_name] = {
                        'name': product_name,
                        'quantity': invoice['quantity'],
                        'unit_price': safe_float(unit_price),
                        'tax': invoice['tax'],
                        'price_with_tax': invoice['total_amount'],
                        'discount': invoice['discount'],
                        'sku': str(row_data.get('sku', 'MISSING'))
                    }
                else:
                    products_map[product_name]['quantity'] += invoice['quantity']
                    products_map[product_name]['price_with_tax'] += invoice['total_amount']
                    products_map[product_name]['tax'] += invoice['tax']
            
            # Extract customer
            customer_name = invoice['customer_name']
            if customer_name != 'MISSING':
                if customer_name not in customers_map:
                    customers_map[customer_name] = {
                        'customer_name': customer_name,
                        'phone_number': str(row_data.get('phone_number', 'MISSING')),
                        'total_purchase_amount': invoice['total_amount'],
                        'email': str(row_data.get('email', 'MISSING')),
                        'address': str(row_data.get('address', 'MISSING'))
                    }
                else:
                    customers_map[customer_name]['total_purchase_amount'] += invoice['total_amount']
        
        return {
            'invoices': invoices,
            'products': list(products_map.values()),
            'customers': list(customers_map.values())
        }
        
    except Exception as e:
        raise Exception(f"Excel parsing error: {str(e)}")


def format_date(date_value) -> str:
    """Format date to ISO string"""
    if not date_value:
        return 'MISSING'
    if isinstance(date_value, datetime):
        return date_value.strftime('%Y-%m-%d')
    try:
        return str(date_value)
    except:
        return 'MISSING'


def safe_float(value) -> float:
    """Safely convert to float - handles strings like '1.000'"""
    if value is None or value == '':
        return 0.0
    try:
        return float(value)
    except (ValueError, TypeError):
        return 0.0


def safe_int(value) -> int:
    """Safely convert to int - handles strings like '1.000' by converting to float first"""
    if value is None or value == '':
        return 0
    try:
        # Convert to float first (handles "1.000"), then to int
        return int(float(value))
    except (ValueError, TypeError):
        return 0