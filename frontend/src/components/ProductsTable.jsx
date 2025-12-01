import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProductName, updateProductField } from '../store/productsSlice';
import { updateInvoicesByProductName, updateInvoicesByProductPricing } from '../store/invoicesSlice';
import { recalculateCustomerTotals } from '../store/customersSlice';
import { isMissing, formatCurrency } from '../utils/helpers';

function ProductsTable() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.data);
  const invoices = useSelector((state) => state.invoices.data);
  const [editingName, setEditingName] = useState(null);
  const [tempName, setTempName] = useState('');

  // Calculate real-time aggregates from invoices
  const getProductAggregates = (productName) => {
    const productInvoices = invoices.filter(inv => inv.product_name === productName);
    
    const totalQuantity = productInvoices.reduce((sum, inv) => sum + (inv.quantity || 0), 0);
    const totalTax = productInvoices.reduce((sum, inv) => sum + (inv.tax || 0), 0);
    const totalWithTax = productInvoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
    
    return {
      quantity: totalQuantity,
      tax: totalTax,
      priceWithTax: totalWithTax
    };
  };

  const startEdit = (product) => {
    setEditingName(product.name);
    setTempName(product.name);
  };

  const saveEdit = (oldName) => {
    if (tempName && tempName !== oldName && tempName.trim() !== '') {
      // Update product name
      dispatch(updateProductName({ oldName, newName: tempName }));
      // Update all invoices with this product
      dispatch(updateInvoicesByProductName({ oldName, newName: tempName }));
    }
    setEditingName(null);
    setTempName('');
  };

  const cancelEdit = () => {
    setEditingName(null);
    setTempName('');
  };

  const handleFieldChange = (productName, field, value) => {
    const parsedValue = field === 'unit_price' || field === 'tax' || field === 'discount'
      ? parseFloat(value) || 0
      : value;

    // Update product field
    dispatch(updateProductField({ productName, field, value: parsedValue }));

    // If price or tax changed, update ALL invoices with this product
    if (field === 'unit_price' || field === 'tax') {
      const product = products.find(p => p.name === productName);
      if (product) {
        const unit_price = field === 'unit_price' ? parsedValue : product.unit_price;
        const totalTax = field === 'tax' ? parsedValue : product.tax;
        
        // Calculate per-unit tax for invoice recalculation
        const taxPerUnit = totalTax / (product.quantity || 1);
        
        // Update all invoices with this product
        setTimeout(() => {
          // Get current invoices for this product
          const updatedInvoices = invoices.map(invoice => {
            if (invoice.product_name === productName) {
              const invoiceQty = invoice.quantity || 1;
              const newInvoiceTax = taxPerUnit * invoiceQty;
              const newTotal = (unit_price * invoiceQty) + newInvoiceTax;
              
              return {
                ...invoice,
                tax: newInvoiceTax,
                total_amount: newTotal
              };
            }
            return invoice;
          });
          
          // Dispatch updates
          dispatch(updateInvoicesByProductPricing({ 
            productName, 
            unit_price, 
            taxPerUnit
          }));
          
          // Recalculate customer totals
          dispatch(recalculateCustomerTotals(updatedInvoices));
        }, 100);
      }
    }
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No products to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Total Quantity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Unit Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Total Tax
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Total with Tax
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Discount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                SKU
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product, index) => {
              // Get live aggregated data from invoices
              const aggregates = getProductAggregates(product.name);
              
              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className={`px-4 py-3 text-sm ${
                    isMissing(product.name) ? 'bg-yellow-50' : ''
                  }`}>
                    {editingName === product.name ? (
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onBlur={() => saveEdit(product.name)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(product.name);
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        className={`w-full border border-blue-500 focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 ${
                          isMissing(tempName) ? 'text-yellow-800' : ''
                        }`}
                        autoFocus
                        placeholder="Product Name"
                      />
                    ) : (
                      <div
                        onClick={() => startEdit(product)}
                        className={`cursor-pointer hover:bg-gray-100 px-2 py-1 rounded ${
                          isMissing(product.name) ? 'text-yellow-800' : ''
                        }`}
                        title="Click to edit - will update all invoices"
                      >
                        {product.name || 'MISSING'}
                      </div>
                    )}
                  </td>
                  
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-blue-600">
                        {aggregates.quantity}
                      </span>
                      <span className="text-xs text-gray-500">
                        (live aggregated)
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3 text-sm">
                    <input
                      type="number"
                      step="0.01"
                      value={product.unit_price.toFixed(2)}
                      onChange={(e) => handleFieldChange(product.name, 'unit_price', e.target.value)}
                      className="w-24 border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                      min="0"
                      title="⚡ Changes will update ALL invoices with this product"
                    />
                  </td>
                  
                  <td className="px-4 py-3 text-sm">
                    <input
                      type="number"
                      step="0.01"
                      value={product.tax.toFixed(2)}
                      onChange={(e) => handleFieldChange(product.name, 'tax', e.target.value)}
                      className="w-24 border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                      min="0"
                      title="⚡ Changes will update ALL invoices with this product"
                    />
                  </td>
                  
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {formatCurrency(aggregates.priceWithTax)}
                      </span>
                      <span className="text-xs text-gray-500">
                        (live total)
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3 text-sm">
                    <input
                      type="number"
                      step="0.01"
                      value={product.discount}
                      onChange={(e) => handleFieldChange(product.name, 'discount', e.target.value)}
                      className="w-24 border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                      min="0"
                    />
                  </td>
                  
                  <td className={`px-4 py-3 text-sm ${
                    isMissing(product.sku) ? 'bg-yellow-50 text-yellow-800' : ''
                  }`}>
                    <input
                      type="text"
                      value={product.sku}
                      onChange={(e) => handleFieldChange(product.name, 'sku', e.target.value)}
                      className={`w-full border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 ${
                        isMissing(product.sku) ? 'text-yellow-800' : ''
                      }`}
                      placeholder="SKU"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="bg-gray-50 px-4 py-3 border-t text-sm text-gray-600">
        <div className="flex justify-between items-center">
          <div>
            Total Products: <span className="font-medium">{products.length}</span>
          </div>
          <div className="text-xs text-gray-500 italic">
            💡 Quantities & totals calculated live from invoices | ⚡ Price/Tax changes sync to all invoices
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsTable;