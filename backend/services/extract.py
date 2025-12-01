from typing import Dict, Any
from services.excel_parser import parse_excel
from services.ai_extractor import extract_with_ai

async def process_file(file_path: str, file_ext: str) -> Dict[str, Any]:
    """Main extraction pipeline"""
    try:
        if file_ext in ['.xlsx', '.xls']:
            extracted_data = parse_excel(file_path)
        elif file_ext in ['.pdf', '.png', '.jpg', '.jpeg']:
            extracted_data = await extract_with_ai(file_path, file_ext)
        else:
            raise Exception(f"Unsupported file type: {file_ext}")
        
        return {
            "invoices": extracted_data.get('invoices', []),
            "products": extracted_data.get('products', []),
            "customers": extracted_data.get('customers', []),
            "success": True,
            "message": f"Successfully extracted {len(extracted_data.get('invoices', []))} invoices"
        }
        
    except Exception as e:
        return {
            "invoices": [],
            "products": [],
            "customers": [],
            "success": False,
            "message": f"Extraction failed: {str(e)}"
        }