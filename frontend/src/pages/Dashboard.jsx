// frontend/src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FileText, Package, Users, Download } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import TabButton from '../components/TabButton';
import StatusMessage from '../components/StatusMessage';
import InvoicesTable from '../components/InvoicesTable';
import ProductsTable from '../components/ProductsTable';
import CustomersTable from '../components/CustomersTable';
import ThemeToggle from '../components/ThemeToggle';
import { setInvoices, setLoading, setError, setSuccess, clearMessages } from '../store/invoicesSlice';
import { setProducts } from '../store/productsSlice';
import { setCustomers } from '../store/customersSlice';
import { uploadFile } from '../services/api';

function Dashboard() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('invoices');
  
  const invoices = useSelector((state) => state.invoices.data);
  const products = useSelector((state) => state.products.data);
  const customers = useSelector((state) => state.customers.data);
  const loading = useSelector((state) => state.invoices.loading);
  const error = useSelector((state) => state.invoices.error);
  const success = useSelector((state) => state.invoices.success);

  const handleFileUpload = async (file) => {
    dispatch(setLoading(true));
    dispatch(clearMessages());

    try {
      const data = await uploadFile(file);

      if (data.success) {
        dispatch(setInvoices(data.invoices || []));
        dispatch(setProducts(data.products || []));
        dispatch(setCustomers(data.customers || []));
        dispatch(setSuccess(`✓ Successfully extracted ${data.invoices?.length || 0} invoices`));
        setActiveTab('invoices');
      } else {
        dispatch(setError(data.message || 'Extraction failed'));
      }
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDownload = () => {
    const savedState = {
      invoices,
      products,
      customers,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(savedState, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-data-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCloseError = () => {
    dispatch(clearMessages());
  };

  const handleCloseSuccess = () => {
    dispatch(clearMessages());
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Invoice Management System
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                AI-Powered Data Extraction & Management Platform
              </p>
            </div>
            <div className="flex items-start gap-3">
              {invoices.length > 0 && (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download JSON
                </button>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* File Upload Section */}
        <FileUpload onUpload={handleFileUpload} loading={loading} />

        {/* Status Messages */}
        {error && (
          <StatusMessage type="error" message={error} onClose={handleCloseError} />
        )}
        
        {success && (
          <StatusMessage type="success" message={success} onClose={handleCloseSuccess} />
        )}



        {/* Tabs and Tables */}
        {invoices.length > 0 && (
          <div className="mt-8">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <nav className="flex gap-4">
                <TabButton
                  active={activeTab === 'invoices'}
                  onClick={() => setActiveTab('invoices')}
                  icon={<FileText className="w-4 h-4" />}
                  label="Invoices"
                  count={invoices.length}
                />
                <TabButton
                  active={activeTab === 'products'}
                  onClick={() => setActiveTab('products')}
                  icon={<Package className="w-4 h-4" />}
                  label="Products"
                  count={products.length}
                />
                <TabButton
                  active={activeTab === 'customers'}
                  onClick={() => setActiveTab('customers')}
                  icon={<Users className="w-4 h-4" />}
                  label="Customers"
                  count={customers.length}
                />
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mb-8">
              {activeTab === 'invoices' && <InvoicesTable />}
              {activeTab === 'products' && <ProductsTable />}
              {activeTab === 'customers' && <CustomersTable />}
            </div>

            {/* Info Panel */}
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">💡 Pro Tips:</h3>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li>• Yellow highlighted fields indicate missing data - click to edit</li>
                <li>• Edit product/customer names to auto-update all related invoices</li>
                <li>• Use "Download JSON" to export your data</li>
              </ul>
            </div>
          </div>
        )}

        {/* Empty State */}
        {invoices.length === 0 && !loading && (
          <div className="mt-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
              <FileText className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Data Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Upload an invoice file (Excel, PDF, or Image) to get started with automated data extraction
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 font-semibold">1</span>
                </div>
                <span>Upload File</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 font-semibold">2</span>
                </div>
                <span>AI Extracts Data</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 font-semibold">3</span>
                </div>
                <span>View & Edit</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Built with React, Redux Toolkit, FastAPI & Gemini AI</p>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;