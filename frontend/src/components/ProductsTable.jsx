import React, { useState, useEffect } from 'react';
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

  // DEBUG: Log what we're getting
  useEffect(() => {
    console.log('=== PRODUCTS DATA ===', products);
    console.log('=== INVOICES DATA ===', invoices);
  }, [products, invoices]);

  // Calculate from invoices - BUT also show what backend sent
  const getProductDisplay = (product) => {
    // Get what backend sent us
    const backendQuantity = product.quantity || 0;
    const backendTax = product.tax || 0;
    const backendTotal = product.price_with_tax || 0;
    
    // Calculate from current invoices
    const productInvoices = invoices.filter(inv => inv.product_name === product.name);
    const liveQuantity = productInvoices.reduce((sum, inv) => sum + (inv.quantity || 0), 0);
    const liveTax = productInvoices.reduce((sum, inv) => sum + (inv.tax || 0), 0);
    const liveTotal = productInvoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
    
    console.log(`Product: ${product.name}`);
    console.log(`  Backend: qty=${backendQuantity}, tax=${backendTax}, total=${backendTotal}`);
    console.log(`  Live: qty=${liveQuantity}, tax=${liveTax}, total=${liveTotal}`);
    console.log(`  Matching invoices:`, productInvoices);
    
    // Use live if available, otherwise use backend
    return {
      quantity: liveQuantity > 0 ? liveQuantity : backendQuantity,
      tax: liveTax > 0 ? liveTax : backendTax,
      total: liveTotal > 0 ? liveTotal : backendTotal
    };
  };

  const startEdit = (product) => {
    setEditingName(product.name);
    setTempName(product.name);
  };

  const saveEdit = (oldName) => {
    if (tempName && tempName !== oldName && tempName.trim() !== '') {
      dispatch(updateProductName({ oldName, newName: tempName }));
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
    const parsedValue = field === 'unit_price' || field === 'discount'
      ? parseFloat(value) || 0
      : value;

    dispatch(updateProductField({ productName, field, value: parsedValue }));

    if (field === 'unit_price') {
      const product = products.find(p => p.name === productName);
      const display = getProductDisplay(product);
      
      if (display.quantity > 0) {
        const taxPerUnit = display.tax / display.quantity;
        
        setTimeout(() => {
          dispatch(updateInvoicesByProductPricing({ 
            productName, 
            unit_price: parsedValue, 
            taxPerUnit
          }));
          dispatch(recalculateCustomerTotals(invoices));
        }, 0);
      }
    }
  };

  if (products.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">No products to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Total Quantity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Unit Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Total Tax
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Total with Tax
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Discount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                SKU
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {products.map((product, index) => {
              const display = getProductDisplay(product);
              
              return (
                <tr key={`product-${index}-${product.name}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className={`px-4 py-3 text-sm ${
                    isMissing(product.name) ? 'bg-yellow-50 dark:bg-yellow-900/30' : ''
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
                        className={`w-full border border-blue-500 focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200 ${
                          isMissing(tempName) ? 'text-yellow-800 dark:text-yellow-400' : ''
                        }`}
                        autoFocus
                        placeholder="Product Name"
                      />
                    ) : (
                      <div
                        onClick={() => startEdit(product)}
                        className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 px-2 py-1 rounded dark:text-gray-200 ${
                          isMissing(product.name) ? 'text-yellow-800 dark:text-yellow-400' : ''
                        }`}
                        title="Click to edit"
                      >
                        {product.name || 'MISSING'}
                      </div>
                    )}
                  </td>
                  
                  <td className="px-4 py-3 text-sm">
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {display.quantity}
                    </span>
                  </td>
                  
                  <td className="px-4 py-3 text-sm">
                    <input
                      type="number"
                      step="0.01"
                      value={product.unit_price.toFixed(2)}
                      onChange={(e) => handleFieldChange(product.name, 'unit_price', e.target.value)}
                      className="w-24 border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 dark:text-gray-200"
                      min="0"
                    />
                  </td>
                  
                  <td className="px-4 py-3 text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(display.tax)}
                    </span>
                  </td>
                  
                  <td className="px-4 py-3 text-sm">
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {formatCurrency(display.total)}
                    </span>
                  </td>
                  
                  <td className="px-4 py-3 text-sm">
                    <input
                      type="number"
                      step="0.01"
                      value={product.discount}
                      onChange={(e) => handleFieldChange(product.name, 'discount', e.target.value)}
                      className="w-24 border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 dark:text-gray-200"
                      min="0"
                    />
                  </td>
                  
                  <td className={`px-4 py-3 text-sm ${
                    isMissing(product.sku) ? 'bg-yellow-50 dark:bg-yellow-900/30' : ''
                  }`}>
                    <input
                      type="text"
                      value={product.sku}
                      onChange={(e) => handleFieldChange(product.name, 'sku', e.target.value)}
                      className={`w-full border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 dark:text-gray-200 ${
                        isMissing(product.sku) ? 'text-yellow-800 dark:text-yellow-400' : ''
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
      
      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-t border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex justify-between items-center">
          <div>
            Total Products: <span className="font-medium">{products.length}</span>
          </div>
          <div>
            Grand Total: <span className="font-medium text-green-600 dark:text-green-400">
              {formatCurrency(products.reduce((sum, p) => {
                const display = getProductDisplay(p);
                return sum + display.total;
              }, 0))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsTable;