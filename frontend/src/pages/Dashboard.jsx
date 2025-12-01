import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FileText, Package, Users } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import TabButton from '../components/TabButton';
import StatusMessage from '../components/StatusMessage';
import InvoicesTable from '../components/InvoicesTable';
import ProductsTable from '../components/ProductsTable';
import CustomersTable from '../components/CustomersTable';
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
        
        // Auto switch to invoices tab
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

  const handleCloseError = () => {
    dispatch(clearMessages());
  };

  const handleCloseSuccess = () => {
    dispatch(clearMessages());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Invoice Management System
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            AI-Powered Data Extraction & Management Platform
          </p>
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
            <div className="border-b border-gray-200 mb-6">
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Pro Tips:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Yellow highlighted fields indicate missing data - click to edit</li>
                <li>• Edit product/customer names to auto-update all related invoices</li>
                <li>• All changes are synchronized in real-time across tabs</li>
                <li>• Press Enter to save, Escape to cancel when editing names</li>
              </ul>
            </div>
          </div>
        )}

        {/* Empty State */}
        {invoices.length === 0 && !loading && (
          <div className="mt-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Data Yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Upload an invoice file (Excel, PDF, or Image) to get started with automated data extraction
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-semibold">1</span>
                </div>
                <span>Upload File</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-semibold">2</span>
                </div>
                <span>AI Extracts Data</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-semibold">3</span>
                </div>
                <span>View & Edit</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>Built with React, Redux Toolkit, FastAPI & Gemini AI</p>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;