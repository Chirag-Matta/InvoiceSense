# 🧾 Invoice Management System

> **AI-Powered Data Extraction & Management Platform**

A full-stack web application that uses AI (Google Gemini) to automatically extract invoice data from Excel files, PDFs, and images, then provides an intuitive interface to view, edit, and manage invoices, products, and customers with real-time synchronization.

![Tech Stack](https://img.shields.io/badge/React-18.2-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.11-purple)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-2.5_Flash-orange)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Data Synchronization](#-data-synchronization)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🤖 AI-Powered Extraction
- **Multi-format Support**: Upload Excel (.xlsx, .xls), PDF, or Images (.png, .jpg, .jpeg)
- **Google Gemini AI**: Automatically extracts invoice data using vision AI
- **Intelligent Parsing**: Handles various invoice formats and layouts
- **Error Recovery**: Graceful fallback for missing or malformed data

### 📊 Real-Time Data Management
- **Three Synchronized Tables**: Invoices, Products, and Customers
- **Live Calculations**: All totals and aggregates update automatically
- **Bidirectional Sync**: Changes in one table cascade to related tables
- **Inline Editing**: Click-to-edit interface for all fields

### 🔄 Smart Synchronization
- **Product Changes → Invoice Updates**: Changing product price updates all related invoices
- **Invoice Changes → Aggregate Updates**: Quantity changes update product totals
- **Customer Tracking**: Live calculation of total purchases per customer
- **Name Propagation**: Renaming products/customers updates all references

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Drag & Drop Upload**: Intuitive file upload interface
- **Missing Data Highlighting**: Yellow highlights for incomplete fields
- **Tab Navigation**: Organized view of invoices, products, and customers
- **Real-time Feedback**: Success/error messages with animations

---

## 🛠 Tech Stack

### Frontend
- **React** 18.2 - UI library
- **Redux Toolkit** 2.11 - State management
- **Tailwind CSS** 3.4 - Styling framework
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Backend
- **FastAPI** - Modern Python web framework
- **Google Gemini AI** 2.5 Flash - Vision-based data extraction
- **OpenPyXL** - Excel file parsing
- **PyMuPDF / pdf2image** - PDF processing
- **Pillow** - Image processing
- **Pydantic** - Data validation

### Development
- **Uvicorn** - ASGI server
- **Python-dotenv** - Environment management
- **CORS Middleware** - Cross-origin support

---

## 📁 Project Structure

```
invoice-management-system/
│
├── backend/
│   ├── main.py                    # FastAPI application entry point
│   ├── schemas/
│   │   ├── models.py              # Pydantic data models
│   │   └── response.py            # Response schemas
│   ├── services/
│   │   ├── extract.py             # Main extraction pipeline
│   │   ├── excel_parser.py        # Excel parsing logic
│   │   └── ai_extractor.py        # Gemini AI integration
│   ├── requirements.txt           # Python dependencies
│   └── .env                       # Environment variables
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.jsx     # Drag & drop file upload
│   │   │   ├── InvoicesTable.jsx  # Invoice management table
│   │   │   ├── ProductsTable.jsx  # Product management table
│   │   │   ├── CustomersTable.jsx # Customer management table
│   │   │   ├── TabButton.jsx      # Tab navigation component
│   │   │   └── StatusMessage.jsx  # Success/error messages
│   │   ├── pages/
│   │   │   └── Dashboard.jsx      # Main dashboard page
│   │   ├── services/
│   │   │   └── api.js             # API client configuration
│   │   ├── store/
│   │   │   ├── store.js           # Redux store configuration
│   │   │   ├── invoicesSlice.js   # Invoice state management
│   │   │   ├── productsSlice.js   # Product state management
│   │   │   └── customersSlice.js  # Customer state management
│   │   ├── utils/
│   │   │   └── helpers.js         # Utility functions
│   │   ├── App.js                 # Root component
│   │   ├── index.js               # React entry point
│   │   └── index.css              # Global styles
│   ├── package.json               # Node dependencies
│   ├── tailwind.config.js         # Tailwind configuration
│   └── postcss.config.js          # PostCSS configuration
│
└── README.md                      # Project documentation
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Python** (v3.8 or higher)
- **pip** (Python package manager)
- **Google Gemini API Key** ([Get it here](https://makersuite.google.com/app/apikey))

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/invoice-management-system.git
cd invoice-management-system
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Backend Dependencies** (`requirements.txt`):
```txt
fastapi
uvicorn[standard]
python-multipart
python-dotenv
openpyxl
Pillow
google-generativeai
PyMuPDF
pdf2image
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

---

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in the `backend/` directory:

```env
# Google Gemini AI API Key (Required)
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration (Optional)
PORT=8000
HOST=0.0.0.0
```

**Getting Your Gemini API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in your `.env` file

### Frontend Configuration

Create a `.env` file in the `frontend/` directory (optional):

```env
# Backend API URL (defaults to http://localhost:8000)
REACT_APP_API_URL=http://localhost:8000
```

---

## 🏃‍♂️ Running the Application

### Option 1: Run Both Services Separately

#### Terminal 1 - Backend Server

```bash
cd backend

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Start FastAPI server with Uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at: `http://localhost:8000`

#### Terminal 2 - Frontend Development Server

```bash
cd frontend

# Start React development server
npm start
```

The frontend will be available at: `http://localhost:3000`

---

### Option 2: Production Deployment

#### Backend (Production)

```bash
cd backend

# Run without reload for production
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

#### Frontend (Production)

```bash
cd frontend

# Build for production
npm run build

# Serve the build folder with a static server
npx serve -s build -l 3000
```

---

## 📖 Usage Guide

### Step 1: Upload Invoice File

1. Open the application at `http://localhost:3000`
2. Drag and drop a file or click "Choose File"
3. Supported formats:
   - **Excel**: `.xlsx`, `.xls`
   - **PDF**: `.pdf`
   - **Images**: `.png`, `.jpg`, `.jpeg`
4. Wait for AI processing (usually 3-10 seconds)

### Step 2: View Extracted Data

After successful upload, you'll see three tabs:

#### 📄 Invoices Tab
- View all extracted invoice line items
- Edit: Serial number, customer, product, quantity, tax, total, date, payment mode
- **Smart Product Selection**: Selecting a product auto-fills quantity, price, and tax
- **Auto-Calculations**: Changing quantity automatically updates tax and total

#### 📦 Products Tab
- View aggregated product data
- **Live Totals**: Quantity and totals calculated from all invoices
- Edit: Unit price, tax, discount, SKU
- **Cascade Updates**: Changing unit price updates all invoices with this product
- **Name Editing**: Click product name to edit (updates all related invoices)

#### 👥 Customers Tab
- View aggregated customer data
- **Live Purchase Totals**: Calculated from all customer invoices
- Edit: Phone number, email, address
- **Name Editing**: Click customer name to edit (updates all related invoices)

### Step 3: Edit & Sync

All tables are fully synchronized:

```
Change in Invoices → Updates Products & Customers
Change in Products → Updates All Related Invoices → Updates Customers
Change in Customers → Updates All Related Invoices
```

### Missing Data Handling

- Fields with missing data are highlighted in **yellow**
- Click to edit and fill in missing information
- Default value for missing fields: `"MISSING"`

---

## 🔌 API Documentation

### Endpoints

#### `GET /`
Health check endpoint
```json
{
  "message": "Invoice Extraction API",
  "status": "running",
  "version": "1.0.0"
}
```

#### `POST /api/upload`
Upload and process invoice file

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `file` (FormData)

**Response:**
```json
{
  "invoices": [
    {
      "serial_number": "INV-001",
      "customer_name": "John Doe",
      "product_name": "Laptop",
      "quantity": 2,
      "tax": 50.00,
      "total_amount": 1050.00,
      "date": "2024-01-15",
      "discount": 0.0,
      "payment_mode": "Credit Card",
      "notes": "MISSING"
    }
  ],
  "products": [
    {
      "name": "Laptop",
      "quantity": 2,
      "unit_price": 500.00,
      "tax": 50.00,
      "price_with_tax": 1050.00,
      "discount": 0.0,
      "sku": "LAP-001"
    }
  ],
  "customers": [
    {
      "customer_name": "John Doe",
      "phone_number": "+1234567890",
      "total_purchase_amount": 1050.00,
      "email": "john@example.com",
      "address": "123 Main St"
    }
  ],
  "success": true,
  "message": "Successfully extracted 1 invoices"
}
```

#### `GET /health`
Backend health check
```json
{
  "status": "healthy"
}
```

---

## 🔄 Data Synchronization

### How Sync Works

#### 1. Invoice → Products & Customers
When you change an invoice:
- **Quantity change** → Product aggregate quantity updates
- **Total change** → Customer purchase total updates
- **Product switch** → Product aggregates recalculate

#### 2. Products → Invoices → Customers
When you change a product:
- **Unit price change** → All invoices with this product recalculate
- **Tax change** → All invoices with this product recalculate
- Both cascade to update customer totals

#### 3. Customers → Invoices
When you change a customer:
- **Name change** → All invoices with this customer update

### Calculation Logic

**Invoice Total:**
```javascript
total = (unit_price × quantity) + (tax_per_unit × quantity)
```

**Tax Per Unit:**
```javascript
tax_per_unit = product.total_tax / product.total_quantity
```

**Customer Total:**
```javascript
customer_total = sum(all invoices for this customer)
```

**Product Aggregates:**
```javascript
product.quantity = sum(quantities from all invoices)
product.total_tax = sum(tax from all invoices)
product.total_with_tax = sum(totals from all invoices)
```

---

## 🐛 Troubleshooting

### Backend Issues

#### "GEMINI_API_KEY not set"
**Solution:** Create a `.env` file in the `backend/` directory with your API key:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

#### "ModuleNotFoundError: No module named 'openpyxl'"
**Solution:** Install missing dependencies:
```bash
pip install -r requirements.txt
```

#### "Port 8000 already in use"
**Solution:** Kill the process using port 8000 or use a different port:
```bash
# Change port
uvicorn main:app --reload --port 8001

# Update frontend .env
REACT_APP_API_URL=http://localhost:8001
```

#### PDF Processing Fails
**Solution:** Install PDF dependencies:
```bash
# Option 1: PyMuPDF (recommended)
pip install PyMuPDF

# Option 2: pdf2image
pip install pdf2image
# Also requires poppler-utils (system package)
```

### Frontend Issues

#### "Network Error" or "No response from server"
**Solution:**
1. Verify backend is running: `http://localhost:8000/health`
2. Check CORS settings in `backend/main.py`
3. Update API URL in `frontend/src/services/api.js`

#### "Cannot find module 'react'"
**Solution:** Reinstall dependencies:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### Styles not loading
**Solution:** Rebuild Tailwind:
```bash
npm run build
```

### Data Issues

#### Tables not syncing
**Solution:**
1. Check browser console for errors
2. Verify Redux DevTools shows state updates
3. Ensure you're using the latest component files

#### Missing data not highlighted
**Solution:** Verify the field value is exactly `"MISSING"` (case-sensitive)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Coding Standards

- **Backend**: Follow PEP 8 Python style guide
- **Frontend**: Use ESLint and Prettier
- **Commits**: Use conventional commit messages
- **Testing**: Add tests for new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini AI** - For powerful vision-based extraction
- **FastAPI** - For the excellent Python web framework
- **React Team** - For the amazing UI library
- **Tailwind CSS** - For rapid UI development

---

## 📧 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/invoice-management-system/issues)
- **Email**: your.email@example.com
- **Documentation**: [Wiki](https://github.com/yourusername/invoice-management-system/wiki)

---

## 🗺 Roadmap

- [ ] Export data to Excel/CSV
- [ ] PDF invoice generation
- [ ] Multi-user authentication
- [ ] Invoice templates
- [ ] Advanced search & filtering
- [ ] Analytics dashboard
- [ ] Bulk operations
- [ ] Email integration
- [ ] Mobile app

---

Made with ❤️ using React, FastAPI & Gemini AI