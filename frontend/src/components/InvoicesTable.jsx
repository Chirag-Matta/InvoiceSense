import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateInvoiceField } from '../store/invoicesSlice';
import { updateProductField } from '../store/productsSlice';
import { recalculateCustomerTotals } from '../store/customersSlice';
import { isMissing, formatCurrency } from '../utils/helpers';

function InvoicesTable() {
  const dispatch = useDispatch();
  const invoices = useSelector((state) => state.invoices.data);
  const products = useSelector((state) => state.products.data);
  const customers = useSelector((state) => state.customers.data);

  const handleFieldChange = (index, field, value) => {
    if (field === 'product_name') {
      const selectedProduct = products.find(p => p.name === value);
      
      if (selectedProduct && value !== 'MISSING') {
        // Default quantity = 1 for new selection
        const qty = 1;
        
        // Calculate tax per unit from product's stored total
        const storedQty = selectedProduct.quantity || 1;
        const taxPerUnit = selectedProduct.tax / storedQty;
        const tax = taxPerUnit * qty;
        const total = (selectedProduct.unit_price * qty) + tax;
        
        // Update ONLY this invoice
        dispatch(updateInvoiceField({ index, field: 'product_name', value }));
        dispatch(updateInvoiceField({ index, field: 'quantity', value: qty }));
        dispatch(updateInvoiceField({ index, field: 'tax', value: tax }));
        dispatch(updateInvoiceField({ index, field: 'total_amount', value: total }));
        
        // Recalculate customer totals with updated invoice
        const updatedInvoices = invoices.map((inv, i) => 
          i === index ? { ...inv, product_name: value, quantity: qty, tax: tax, total_amount: total } : inv
        );
        setTimeout(() => dispatch(recalculateCustomerTotals(updatedInvoices)), 0);
      } else {
        dispatch(updateInvoiceField({ index, field, value }));
      }
      return;
    }
    
    if (field === 'quantity') {
      const invoice = invoices[index];
      const newQty = parseInt(value) || 0;
      const product = products.find(p => p.name === invoice.product_name);
      
      if (product && product.unit_price) {
        const storedQty = product.quantity || 1;
        const taxPerUnit = product.tax / storedQty;
        const newTax = taxPerUnit * newQty;
        const newTotal = (product.unit_price * newQty) + newTax;
        
        // Update the invoice
        dispatch(updateInvoiceField({ index, field: 'quantity', value: newQty }));
        dispatch(updateInvoiceField({ index, field: 'tax', value: newTax }));
        dispatch(updateInvoiceField({ index, field: 'total_amount', value: newTotal }));
        
        // ALSO update the product's quantity, tax, and price_with_tax
        dispatch(updateProductField({ productName: product.name, field: 'quantity', value: newQty }));
        dispatch(updateProductField({ productName: product.name, field: 'tax', value: newTax }));
        dispatch(updateProductField({ productName: product.name, field: 'price_with_tax', value: newTotal }));
        
        // Recalculate customer totals with updated invoice
        const updatedInvoices = invoices.map((inv, i) => 
          i === index ? { ...inv, quantity: newQty, tax: newTax, total_amount: newTotal } : inv
        );
        setTimeout(() => dispatch(recalculateCustomerTotals(updatedInvoices)), 0);
      } else {
        dispatch(updateInvoiceField({ index, field, value: newQty }));
      }
      return;
    }
    
    if (field === 'tax') {
      const invoice = invoices[index];
      const newTax = parseFloat(value) || 0;
      const product = products.find(p => p.name === invoice.product_name);
      
      if (product && product.unit_price) {
        const newTotal = (product.unit_price * invoice.quantity) + newTax;
        
        // Update the invoice
        dispatch(updateInvoiceField({ index, field: 'tax', value: newTax }));
        dispatch(updateInvoiceField({ index, field: 'total_amount', value: newTotal }));
        
        // ALSO update the product's tax and price_with_tax
        dispatch(updateProductField({ productName: product.name, field: 'tax', value: newTax }));
        dispatch(updateProductField({ productName: product.name, field: 'price_with_tax', value: newTotal }));
        
        // Recalculate customer totals with updated invoice
        const updatedInvoices = invoices.map((inv, i) => 
          i === index ? { ...inv, tax: newTax, total_amount: newTotal } : inv
        );
        setTimeout(() => dispatch(recalculateCustomerTotals(updatedInvoices)), 0);
      } else {
        dispatch(updateInvoiceField({ index, field, value: newTax }));
      }
      return;
    }
    
    if (field === 'total_amount') {
      const newTotal = parseFloat(value) || 0;
      dispatch(updateInvoiceField({ index, field, value: newTotal }));
      
      // Recalculate customer totals with updated invoice
      const updatedInvoices = invoices.map((inv, i) => 
        i === index ? { ...inv, total_amount: newTotal } : inv
      );
      setTimeout(() => dispatch(recalculateCustomerTotals(updatedInvoices)), 0);
      return;
    }
    
    if (field === 'customer_name') {
      dispatch(updateInvoiceField({ index, field, value }));
      
      // Recalculate customer totals with updated invoice
      const updatedInvoices = invoices.map((inv, i) => 
        i === index ? { ...inv, customer_name: value } : inv
      );
      setTimeout(() => dispatch(recalculateCustomerTotals(updatedInvoices)), 0);
      return;
    }
    
    dispatch(updateInvoiceField({ index, field, value }));
  };

  if (invoices.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">No invoices to display</p>
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
                Serial No
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Tax
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Total
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Payment
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {invoices.map((invoice, index) => (
              <tr key={`invoice-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className={`px-4 py-3 text-sm ${
                  isMissing(invoice.serial_number) ? 'bg-yellow-50 dark:bg-yellow-900/30' : ''
                }`}>
                  <input
                    type="text"
                    value={invoice.serial_number}
                    onChange={(e) => handleFieldChange(index, 'serial_number', e.target.value)}
                    className={`w-full border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 dark:text-gray-200 ${
                      isMissing(invoice.serial_number) ? 'text-yellow-800 dark:text-yellow-400' : ''
                    }`}
                    placeholder="Serial No"
                  />
                </td>
                
                <td className={`px-4 py-3 text-sm ${
                  isMissing(invoice.customer_name) ? 'bg-yellow-50 dark:bg-yellow-900/30' : ''
                }`}>
                  <select
                    value={invoice.customer_name}
                    onChange={(e) => handleFieldChange(index, 'customer_name', e.target.value)}
                    className={`w-full border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 cursor-pointer dark:text-gray-200 ${
                      isMissing(invoice.customer_name) ? 'text-yellow-800 dark:text-yellow-400' : ''
                    }`}
                  >
                    <option value="MISSING">Select Customer</option>
                    {customers.map((customer, i) => (
                      <option key={`customer-${i}`} value={customer.customer_name}>
                        {customer.customer_name}
                      </option>
                    ))}
                  </select>
                </td>
                
                <td className={`px-4 py-3 text-sm ${
                  isMissing(invoice.product_name) ? 'bg-yellow-50 dark:bg-yellow-900/30' : ''
                }`}>
                  <select
                    value={invoice.product_name}
                    onChange={(e) => handleFieldChange(index, 'product_name', e.target.value)}
                    className={`w-full border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 cursor-pointer dark:text-gray-200 ${
                      isMissing(invoice.product_name) ? 'text-yellow-800 dark:text-yellow-400' : ''
                    }`}
                  >
                    <option value="MISSING">Select Product</option>
                    {products.map((product, i) => (
                      <option key={`product-${i}`} value={product.name}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </td>
                
                <td className="px-4 py-3 text-sm">
                  <input
                    type="number"
                    value={invoice.quantity}
                    onChange={(e) => handleFieldChange(index, 'quantity', e.target.value)}
                    className="w-20 border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 dark:text-gray-200"
                    min="0"
                  />
                </td>
                
                <td className="px-4 py-3 text-sm">
                  <input
                    type="number"
                    step="0.01"
                    value={invoice.tax.toFixed(2)}
                    onChange={(e) => handleFieldChange(index, 'tax', e.target.value)}
                    className="w-20 border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 dark:text-gray-200"
                    min="0"
                  />
                </td>
                
                <td className="px-4 py-3 text-sm">
                  <input
                    type="number"
                    step="0.01"
                    value={invoice.total_amount.toFixed(2)}
                    onChange={(e) => handleFieldChange(index, 'total_amount', e.target.value)}
                    className="w-24 border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 font-medium dark:text-gray-200"
                    min="0"
                  />
                </td>
                
                <td className={`px-4 py-3 text-sm ${
                  isMissing(invoice.date) ? 'bg-yellow-50 dark:bg-yellow-900/30' : ''
                }`}>
                  <input
                    type="date"
                    value={invoice.date !== 'MISSING' ? invoice.date : ''}
                    onChange={(e) => handleFieldChange(index, 'date', e.target.value || 'MISSING')}
                    className={`w-full border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 dark:text-gray-200 ${
                      isMissing(invoice.date) ? 'text-yellow-800 dark:text-yellow-400' : ''
                    }`}
                  />
                </td>
                
                <td className={`px-4 py-3 text-sm ${
                  isMissing(invoice.payment_mode) ? 'bg-yellow-50 dark:bg-yellow-900/30' : ''
                }`}>
                  <input
                    type="text"
                    value={invoice.payment_mode}
                    onChange={(e) => handleFieldChange(index, 'payment_mode', e.target.value)}
                    className={`w-full border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 dark:text-gray-200 ${
                      isMissing(invoice.payment_mode) ? 'text-yellow-800 dark:text-yellow-400' : ''
                    }`}
                    placeholder="Payment Mode"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-t border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 flex justify-between items-center">
        <div>
          Total Invoices: <span className="font-medium">{invoices.length}</span>
        </div>
        <div>
          Grand Total: <span className="font-medium">
            {formatCurrency(invoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0))}
          </span>
        </div>
      </div>
    </div>
  );
}

export default InvoicesTable;