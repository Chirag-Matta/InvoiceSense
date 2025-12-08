# 🧾 InvoiceSense - AI-Powered Invoice Management System

> **Automated Data Extraction & Real-Time Invoice Management Platform**

A full-stack web application that leverages Google Gemini AI to automatically extract invoice data from Excel files, PDFs, and images. Features an intuitive interface with dark mode support, real-time data synchronization, and seamless management of invoices, products, and customers.

![Tech Stack](https://img.shields.io/badge/React-18.2-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.11-purple)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-2.5_Flash-orange)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan)

---

## 📋 Table of Contents

- [Features](#-features)
- [Live Demo](#-live-demo)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Deployment](#-deployment)
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
- **Google Gemini AI**: Automatically extracts invoice data using advanced vision AI
- **Intelligent Parsing**: Handles various invoice formats and layouts
- **Error Recovery**: Graceful fallback for missing or malformed data

### 📊 Real-Time Data Management
- **Three Synchronized Tables**: Invoices, Products, and Customers
- **Live Calculations**: All totals and aggregates update automatically
- **Bidirectional Sync**: Changes in one table cascade to related tables
- **Inline Editing**: Click-to-edit interface for all fields
- **Smart Dropdowns**: Select from existing products/customers or add new ones

### 🔄 Smart Synchronization
- **Product Changes → Invoice Updates**: Changing product price updates all related invoices
- **Invoice Changes → Aggregate Updates**: Quantity changes update product totals
- **Customer Tracking**: Live calculation of total purchases per customer
- **Name Propagation**: Renaming products/customers updates all references

### 🎨 Modern UI/UX
- **Dark Mode**: Full dark mode support with smooth transitions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Drag & Drop Upload**: Intuitive file upload interface
- **Missing Data Highlighting**: Yellow highlights for incomplete fields
- **Tab Navigation**: Organized view of invoices, products, and customers
- **Real-time Feedback**: Success/error messages with animations
- **Export Functionality**: Download data as JSON for backup or sharing

---

## 🌐 Live Demo

**Frontend**: [https://invoicesense.netlify.app](https://invoicesense.netlify.app)  
**Backend API**: [https://invoicesense.up.railway.app](https://invoicesense.up.railway.app)

Try uploading a sample invoice to see the AI extraction in action!

---

## 🛠 Tech Stack

### Frontend
- **React** 18.2 - UI library with hooks
- **Redux Toolkit** 2.11 - State management with slices
- **Tailwind CSS** 3.4 - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **Axios** - Promise-based HTTP client

### Backend
- **FastAPI** - High-performance Python web framework
- **Google Gemini AI** 2.5 Flash - Vision-based data extraction
- **OpenPyXL** - Excel file parsing
- **PyMuPDF** - PDF processing and conversion
- **Pillow** - Image processing
- **Pydantic** - Data validation and serialization

### Development & Deployment
- **Uvicorn** - Lightning-fast ASGI server
- **Python-dotenv** - Environment variable management
- **CORS Middleware** - Cross-origin resource sharing
- **Railway** - Backend deployment platform
- **Netlify** - Frontend deployment platform

---

## 📁 Project Structure

```
invoice-management-system/
│
├── backend/
│   ├── main.py                    # FastAPI application entry point
│   ├── Procfile                   # Railway deployment config
│   ├── nixpacks.toml              # Build configuration
│   ├── runtime.txt                # Python version specification
│   ├── schemas/
│   │   ├── models.py              # Pydantic data models
│   │   └── response.py            # Response schemas
│   ├── services/
│   │   ├── __init__.py
│   │   ├── extract.py             # Main extraction pipeline
│   │   ├── excel_parser.py        # Excel parsing logic
│   │   └── ai_extractor.py        # Gemini AI integration
│   ├── requirements.txt           # Python dependencies
│   └── .env                       # Environment variables (not in repo)
│
├── frontend/
│   ├── public/
│   │   ├── index.html             # HTML template
│   │   ├── manifest.json          # PWA manifest
│   │   └── robots.txt             # SEO configuration
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.jsx     # Drag & drop file upload
│   │   │   ├── InvoicesTable.jsx  # Invoice management table
│   │   │   ├── ProductsTable.jsx  # Product management table
│   │   │   ├── CustomersTable.jsx # Customer management table
│   │   │   ├── TabButton.jsx      # Tab navigation component
│   │   │   ├── StatusMessage.jsx  # Success/error messages
│   │   │   ├── ThemeToggle.jsx    # Dark mode toggle
│   │   │   └── SaveButton.jsx     # Save functionality button
│   │   ├── context/
│   │   │   └── ThemeContext.jsx   # Dark mode context provider
│   │   ├── pages/
│   │   │   └── Dashboard.jsx      # Main dashboard page
│   │   ├── services/
│   │   │   └── api.js             # API client configuration
│   │   ├── store/
│   │   │   ├── store.js           # Redux store configuration
│   │   │   ├── invoicesSlice.js   # Invoice state management
│   │   │   ├── productsSlice.js   # Product state management
│   │   │   ├── customersSlice.js  # Customer state management
│   │   │   └── saveSlice.js       # Save state tracking
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
fastapi==0.109.0
uvicorn[standard]==0.27.0
python-multipart==0.0.6
python-dotenv==1.0.0
openpyxl==3.1.2
Pillow==11.0.0
google-generativeai==0.3.2
PyMuPDF==1.23.26
pydantic==2.5.3
pydantic-settings==2.1.0
starlette==0.35.1
aiofiles==23.2.1
python-json-logger==2.0.7
httpx==0.26.0
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

Create a `.env` file in the `frontend/` directory:

```env
# Backend API URL
# For local development:
REACT_APP_API_URL=http://localhost:8000

# For production (update with your deployed backend URL):
# REACT_APP_API_URL=https://your-backend-url.com
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

### Option 2: Run with Custom Ports

```bash
# Backend on port 8001
cd backend
uvicorn main:app --reload --port 8001

# Frontend on port 3001
cd frontend
PORT=3001 npm start
```

Don't forget to update the API URL in `frontend/src/services/api.js`

---

## 🌍 Deployment

### Backend Deployment (Railway)

1. **Create Railway Account**: Sign up at [railway.app](https://railway.app)

2. **Deploy Backend**:
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Initialize project
   cd backend
   railway init
   
   # Add environment variables
   railway variables set GEMINI_API_KEY=your_api_key_here
   
   # Deploy
   railway up
   ```

3. **Configuration Files**:
   - `Procfile`: Specifies the web server command
   - `nixpacks.toml`: Defines build phases and dependencies
   - `runtime.txt`: Specifies Python version

### Frontend Deployment (Netlify)

1. **Build the Frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify**:
   - Install Netlify CLI: `npm install -g netlify-cli`
   - Login: `netlify login`
   - Deploy: `netlify deploy --prod --dir=build`

3. **Or use the Netlify Dashboard**:
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Add environment variable: `REACT_APP_API_URL=https://your-backend-url.railway.app`

---

## 📖 Usage Guide

### Step 1: Upload Invoice File

1. Open the application
2. Drag and drop a file or click "Choose File"
3. Supported formats:
   - **Excel**: `.xlsx`, `.xls`
   - **PDF**: `.pdf`
   - **Images**: `.png`, `.jpg`, `.jpeg`
4. Wait for AI processing (typically 3-10 seconds)

### Step 2: View Extracted Data

After successful upload, you'll see three tabs:

#### 📄 Invoices Tab
- View all extracted invoice line items
- **Editable Fields**: Serial number, customer, product, quantity, tax, total, date, payment mode
- **Smart Product Selection**: Selecting a product auto-fills quantity, price, and tax
- **Auto-Calculations**: Changing quantity automatically updates tax and total
- **Missing Data**: Yellow-highlighted fields indicate missing data

#### 📦 Products Tab
- View aggregated product data
- **Live Totals**: Quantity and totals calculated from all invoices
- **Editable Fields**: Unit price, tax, discount, SKU
- **Cascade Updates**: Changing unit price updates all invoices with this product
- **Name Editing**: Click product name to edit (updates all related invoices)

#### 👥 Customers Tab
- View aggregated customer data
- **Live Purchase Totals**: Calculated from all customer invoices
- **Editable Fields**: Phone number, email, address
- **Name Editing**: Click customer name to edit (updates all related invoices)

### Step 3: Edit & Sync

All tables are fully synchronized:

```
Change in Invoices → Updates Products & Customers
Change in Products → Updates All Related Invoices → Updates Customers
Change in Customers → Updates All Related Invoices
```

### Step 4: Dark Mode

Toggle between light and dark mode using the sun/moon icon in the header.

### Step 5: Export Data

Click "Download JSON" to export all your data for backup or sharing.

### Missing Data Handling

- Fields with missing data are highlighted in **yellow**
- Click to edit and fill in missing information
- Default value for missing fields: `"MISSING"`

---

## 🔌 API Documentation

### Base URL

**Production**: `https://invoicesense.up.railway.app`  
**Development**: `http://localhost:8000`

### Endpoints

#### `GET /`
Health check endpoint

**Response:**
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

**Response:**
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

#### "ModuleNotFoundError: No module named 'X'"
**Solution:** Install missing dependencies:
```bash
pip install -r requirements.txt
```

#### "Port 8000 already in use"
**Solution:** Kill the process or use a different port:
```bash
# Find process on port 8000
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Or use different port
uvicorn main:app --reload --port 8001
```

#### PDF Processing Fails
**Solution:** Ensure PyMuPDF is installed:
```bash
pip install PyMuPDF==1.23.26
```

### Frontend Issues

#### "Network Error" or "Cannot connect to backend"
**Solution:**
1. Verify backend is running: Visit `http://localhost:8000`
2. Check API URL in `frontend/src/services/api.js`
3. Ensure CORS is properly configured in `backend/main.py`

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

#### Dark mode not persisting
**Solution:** Check browser's localStorage permissions

### Data Issues

#### Tables not syncing
**Solution:**
1. Check browser console for errors
2. Verify Redux DevTools shows state updates
3. Clear browser cache and reload

#### Missing data not highlighted
**Solution:** Verify the field value is exactly `"MISSING"` (case-sensitive)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Coding Standards

- **Backend**: Follow PEP 8 Python style guide
- **Frontend**: Use ESLint and Prettier
- **Commits**: Use conventional commit messages
- **Testing**: Add tests for new features

### Development Workflow

```bash
# Backend development
cd backend
python -m pytest  # Run tests

# Frontend development
cd frontend
npm test  # Run tests
npm run lint  # Check code style
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini AI** - For powerful vision-based data extraction
- **FastAPI** - For the excellent Python web framework
- **React Team** - For the amazing UI library
- **Tailwind CSS** - For rapid UI development
- **Railway & Netlify** - For seamless deployment platforms

---

## 📧 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/invoice-management-system/issues)
- **Live Demo**: [https://invoicesense.netlify.app](https://invoicesense.netlify.app)
- **API**: [https://invoicesense.up.railway.app](https://invoicesense.up.railway.app)

---

## 🗺 Roadmap

### Phase 1 - Core Features ✅
- [x] AI-powered data extraction
- [x] Excel/PDF/Image support
- [x] Real-time synchronization
- [x] Dark mode
- [x] JSON export

### Phase 2 - Enhancements 🚧
- [ ] CSV import/export
- [ ] PDF invoice generation
- [ ] Advanced search & filtering
- [ ] Bulk operations
- [ ] Invoice templates

### Phase 3 - Advanced Features 📋
- [ ] Multi-user authentication
- [ ] Role-based access control
- [ ] Analytics dashboard
- [ ] Email integration
- [ ] API rate limiting
- [ ] Webhook support

### Phase 4 - Scale 🚀
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)
- [ ] Offline mode
- [ ] Multi-language support
- [ ] Cloud storage integration

---

## 📊 Project Stats

- **Total Files**: 40+
- **Backend Lines**: ~1,500
- **Frontend Lines**: ~2,500
- **API Endpoints**: 3
- **Components**: 10+
- **Build Time**: < 2 minutes

---

## 🔒 Security

- API keys stored in environment variables
- CORS properly configured
- Input validation with Pydantic
- File type validation
- No sensitive data in version control

---

## 🎯 Key Features Showcase

### 1. AI-Powered Extraction
Upload any invoice format and watch AI automatically extract all data with high accuracy.

### 2. Real-Time Sync
Change a product price once, and all related invoices update instantly.

### 3. Dark Mode
Beautiful dark mode that respects system preferences and persists across sessions.

### 4. Smart Calculations
All totals, taxes, and aggregates calculate automatically as you edit.

### 5. Data Export
Download your complete dataset as JSON for backup or integration with other systems.

---


**Version**: 1.0.0  
**Last Updated**: December 2024