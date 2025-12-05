import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateInvoiceField } from '../store/invoicesSlice';
import { recalculateCustomerTotals } from '../store/customersSlice';
import { recalculateProductsFromInvoices } from '../store/productsSlice';
import { isMissing, formatCurrency } from '../utils/helpers';

function InvoicesTable() {
  const dispatch = useDispatch();
  const invoices = useSelector((state) => state.invoices.data);
  const products = useSelector((state) => state.products.data);
  const customers = useSelector((state) => state.customers.data);

  const handleFieldChange = (index, field, value) => {
    // Special handling for product_name changes - pull all product data
    if (field === 'product_name') {
      const selectedProduct = products.find(p => p.name === value);
      
      if (selectedProduct && value !== 'MISSING') {
        // Use the product's stored quantity
        const quantity = selectedProduct.quantity || 1;
        
        // Calculate per-unit values
        const taxPerUnit = selectedProduct.tax / (selectedProduct.quantity || 1);
        const totalTax = taxPerUnit * quantity;
        const newTotal = (selectedProduct.unit_price * quantity) + totalTax;
        
        // Update invoice with ALL product data (including quantity)
        dispatch(updateInvoiceField({ index, field: 'product_name', value }));
        dispatch(updateInvoiceField({ index, field: 'quantity', value: quantity }));
        dispatch(updateInvoiceField({ index, field: 'tax', value: totalTax }));
        dispatch(updateInvoiceField({ index, field: 'total_amount', value: newTotal }));
        
        // Recalculate everything after state updates
        setTimeout(() => {
          const updatedInvoices = [...invoices];
          updatedInvoices[index] = { 
            ...updatedInvoices[index], 
            product_name: value,
            quantity: quantity,
            tax: totalTax,
            total_amount: newTotal
          };
          
          dispatch(recalculateProductsFromInvoices(updatedInvoices));
          dispatch(recalculateCustomerTotals(updatedInvoices));
        }, 0);
      } else {
        dispatch(updateInvoiceField({ index, field, value }));
      }
      return;
    }
    
    // Handle quantity changes - recalculate total
    if (field === 'quantity') {
      const invoice = invoices[index];
      const newQuantity = parseInt(value) || 0;
      
      // Find product to get unit price
      const product = products.find(p => p.name === invoice.product_name);
      
      if (product && product.unit_price) {
        // Calculate per-unit tax
        const taxPerUnit = product.tax / (product.quantity || 1);
        const newTax = taxPerUnit * newQuantity;
        const newTotal = (product.unit_price * newQuantity) + newTax;
        
        // Update all affected fields
        dispatch(updateInvoiceField({ index, field: 'quantity', value: newQuantity }));
        dispatch(updateInvoiceField({ index, field: 'tax', value: newTax }));
        dispatch(updateInvoiceField({ index, field: 'total_amount', value: newTotal }));
        
        // Recalculate aggregates
        setTimeout(() => {
          const updatedInvoices = [...invoices];
          updatedInvoices[index] = { 
            ...updatedInvoices[index], 
            quantity: newQuantity,
            tax: newTax,
            total_amount: newTotal
          };
          
          dispatch(recalculateProductsFromInvoices(updatedInvoices));
          dispatch(recalculateCustomerTotals(updatedInvoices));
        }, 0);
      } else {
        // No product data, just update quantity
        dispatch(updateInvoiceField({ index, field, value: newQuantity }));
        
        setTimeout(() => {
          dispatch(recalculateProductsFromInvoices(invoices));
          dispatch(recalculateCustomerTotals(invoices));
        }, 0);
      }
      return;
    }
    
    // Handle tax changes - recalculate total
    if (field === 'tax') {
      const invoice = invoices[index];
      const newTax = parseFloat(value) || 0;
      const product = products.find(p => p.name === invoice.product_name);
      
      if (product && product.unit_price) {
        const newTotal = (product.unit_price * invoice.quantity) + newTax;
        
        dispatch(updateInvoiceField({ index, field: 'tax', value: newTax }));
        dispatch(updateInvoiceField({ index, field: 'total_amount', value: newTotal }));
        
        setTimeout(() => {
          const updatedInvoices = [...invoices];
          updatedInvoices[index] = { 
            ...updatedInvoices[index], 
            tax: newTax,
            total_amount: newTotal
          };
          
          dispatch(recalculateProductsFromInvoices(updatedInvoices));
          dispatch(recalculateCustomerTotals(updatedInvoices));
        }, 0);
      } else {
        dispatch(updateInvoiceField({ index, field, value: newTax }));
        
        setTimeout(() => {
          dispatch(recalculateProductsFromInvoices(invoices));
          dispatch(recalculateCustomerTotals(invoices));
        }, 0);
      }
      return;
    }
    
    // Handle total_amount changes
    if (field === 'total_amount') {
      const newTotal = parseFloat(value) || 0;
      
      dispatch(updateInvoiceField({ index, field, value: newTotal }));
      
      // Recalculate customer totals and product aggregates
      setTimeout(() => {
        const updatedInvoices = [...invoices];
        updatedInvoices[index] = { ...updatedInvoices[index], total_amount: newTotal };
        
        dispatch(recalculateProductsFromInvoices(updatedInvoices));
        dispatch(recalculateCustomerTotals(updatedInvoices));
      }, 0);
      return;
    }
    
    // Handle customer_name changes
    if (field === 'customer_name') {
      dispatch(updateInvoiceField({ index, field, value }));
      
      // Recalculate customer totals
      setTimeout(() => {
        dispatch(recalculateCustomerTotals(invoices));
      }, 0);
      return;
    }
    
    // For all other fields (serial_number, date, payment_mode, notes), just update
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
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
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
                    <option value="MISSING" className="dark:bg-gray-700">Select Customer</option>
                    {customers.map((customer, i) => (
                      <option key={i} value={customer.customer_name} className="dark:bg-gray-700">
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
                    title="Selecting a product will load its quantity, price, and tax"
                  >
                    <option value="MISSING" className="dark:bg-gray-700">Select Product</option>
                    {products.map((product, i) => (
                      <option key={i} value={product.name} className="dark:bg-gray-700">
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
                    title="Changes will update tax and total automatically"
                  />
                </td>
                
                <td className="px-4 py-3 text-sm">
                  <input
                    type="number"
                    step="0.01"
                    value={invoice.tax}
                    onChange={(e) => handleFieldChange(index, 'tax', e.target.value)}
                    className="w-20 border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 dark:text-gray-200"
                    min="0"
                    title="Changes will update total automatically"
                  />
                </td>
                
                <td className="px-4 py-3 text-sm">
                  <input
                    type="number"
                    step="0.01"
                    value={invoice.total_amount}
                    onChange={(e) => handleFieldChange(index, 'total_amount', e.target.value)}
                    className="w-24 border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 font-medium dark:text-gray-200"
                    min="0"
                    title="Changes will update customer totals"
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
                    placeholder="YYYY-MM-DD"
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