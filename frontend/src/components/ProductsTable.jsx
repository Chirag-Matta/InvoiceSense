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
    const parsedValue = field === 'unit_price' || field === 'tax' || field === 'price_with_tax' || field === 'discount'
      ? parseFloat(value) || 0
      : field === 'quantity'
      ? parseInt(value) || 0
      : value;

    // Update product field
    dispatch(updateProductField({ productName, field, value: parsedValue }));

    // If price or tax changed, update all invoices with this product
    if (field === 'unit_price' || field === 'tax') {
      const product = products.find(p => p.name === productName);
      if (product) {
        const unit_price = field === 'unit_price' ? parsedValue : product.unit_price;
        const tax = field === 'tax' ? parsedValue : product.tax;
        
        // Update all invoices with this product
        dispatch(updateInvoicesByProductPricing({ 
          productName, 
          unit_price, 
          tax 
        }));
        
        // Recalculate customer totals after invoice amounts change
        setTimeout(() => {
          dispatch(recalculateCustomerTotals(invoices));
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
            {products.map((product, index) => (
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
                
                <td className="px-4 py-3 text-sm font-medium text-blue-600">
                  {product.quantity}
                  <span className="text-xs text-gray-500 ml-1">(aggregated)</span>
                </td>
                
                <td className="px-4 py-3 text-sm">
                  <input
                    type="number"
                    step="0.01"
                    value={product.unit_price.toFixed(2)}
                    onChange={(e) => handleFieldChange(product.name, 'unit_price', e.target.value)}
                    className="w-24 border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                    min="0"
                    title="Changes will update all invoices with this product"
                  />
                </td>
                
                <td className="px-4 py-3 text-sm font-medium text-gray-700">
                  {formatCurrency(product.tax)}
                  <span className="text-xs text-gray-500 ml-1">(total)</span>
                </td>
                
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {formatCurrency(product.price_with_tax)}
                  <span className="text-xs text-gray-500 ml-1">(total)</span>
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
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-gray-50 px-4 py-3 border-t text-sm text-gray-600">
        <div className="flex justify-between items-center">
          <div>
            Total Products: <span className="font-medium">{products.length}</span>
          </div>
          <div className="text-xs text-gray-500 italic">
            💡 Quantities shown are aggregated from all invoices
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsTable;