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

  // Group invoices by serial number
  const groupedInvoices = React.useMemo(() => {
    const map = {};
    invoices.forEach((inv, index) => {
      const entry = { ...inv, __index: index };
      if (!map[inv.serial_number]) {
        map[inv.serial_number] = [];
      }
      map[inv.serial_number].push(entry);
    });
    return map;
  }, [invoices]);

  // Handle field changes
  const handleFieldChange = (index, field, value) => {
    if (field === 'product_name') {
      const selectedProduct = products.find(p => p.name === value);
      
      if (selectedProduct && value !== 'MISSING') {
        const qty = 1;
        const storedQty = selectedProduct.quantity || 1;
        const taxPerUnit = selectedProduct.tax / storedQty;
        const tax = taxPerUnit * qty;
        const total = (selectedProduct.unit_price * qty) + tax;

        dispatch(updateInvoiceField({ index, field: 'product_name', value }));
        dispatch(updateInvoiceField({ index, field: 'quantity', value: qty }));
        dispatch(updateInvoiceField({ index, field: 'tax', value: tax }));
        dispatch(updateInvoiceField({ index, field: 'total_amount', value: total }));

        const updatedInvoices = invoices.map((inv, i) =>
          i === index ? { ...inv, product_name: value, quantity: qty, tax, total_amount: total } : inv
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

        dispatch(updateInvoiceField({ index, field: 'quantity', value: newQty }));
        dispatch(updateInvoiceField({ index, field: 'tax', value: newTax }));
        dispatch(updateInvoiceField({ index, field: 'total_amount', value: newTotal }));
        dispatch(updateProductField({ productName: product.name, field: 'quantity', value: newQty }));
        dispatch(updateProductField({ productName: product.name, field: 'tax', value: newTax }));
        dispatch(updateProductField({ productName: product.name, field: 'price_with_tax', value: newTotal }));

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

        dispatch(updateInvoiceField({ index, field: 'tax', value: newTax }));
        dispatch(updateInvoiceField({ index, field: 'total_amount', value: newTotal }));
        dispatch(updateProductField({ productName: product.name, field: 'tax', value: newTax }));
        dispatch(updateProductField({ productName: product.name, field: 'price_with_tax', value: newTotal }));

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

      const updatedInvoices = invoices.map((inv, i) =>
        i === index ? { ...inv, total_amount: newTotal } : inv
      );
      setTimeout(() => dispatch(recalculateCustomerTotals(updatedInvoices)), 0);
      return;
    }

    if (field === 'customer_name') {
      dispatch(updateInvoiceField({ index, field, value }));

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
            {Object.entries(groupedInvoices).map(([serial, list]) => {
              const invoice = list[0];
              const mainIndex = invoice.__index;

              return (
                <tr key={`group-${serial}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  {/* Serial Number */}
                  <td className={`px-4 py-3 text-sm font-medium ${
                    isMissing(serial) ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' : 'text-gray-900 dark:text-gray-200'
                  }`}>
                    {serial}
                  </td>

                  {/* Customer */}
                  <td className={`px-4 py-3 text-sm ${
                    isMissing(invoice.customer_name) ? 'bg-yellow-50 dark:bg-yellow-900/30' : ''
                  }`}>
                    <span className={`${
                      isMissing(invoice.customer_name) ? 'text-yellow-800 dark:text-yellow-400' : 'text-gray-900 dark:text-gray-200'
                    }`}>
                      {invoice.customer_name}
                    </span>
                  </td>

                  {/* Product Dropdown */}
                  <td className={`px-4 py-3 text-sm ${
                    isMissing(invoice.product_name) ? 'bg-yellow-50 dark:bg-yellow-900/30' : ''
                  }`}>
                    <select
                      value={invoice.product_name}
                      onChange={(e) => handleFieldChange(mainIndex, 'product_name', e.target.value)}
                      className={`w-full border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 cursor-pointer ${
                        isMissing(invoice.product_name) 
                          ? 'text-yellow-800 dark:text-yellow-400' 
                          : 'text-gray-900 dark:text-gray-200'
                      }`}
                    >
                      {list.map((inv, i) => (
                        <option key={i} value={inv.product_name}>
                          {inv.product_name}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Quantity */}
                  <td className="px-4 py-3 text-sm">
                    <input
                      type="number"
                      value={invoice.quantity}
                      onChange={(e) => handleFieldChange(mainIndex, 'quantity', e.target.value)}
                      className="w-20 border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 text-gray-900 dark:text-gray-200"
                      min="0"
                    />
                  </td>

                  {/* Tax */}
                  <td className="px-4 py-3 text-sm">
                    <input
                      type="number"
                      step="0.01"
                      value={invoice.tax.toFixed(2)}
                      onChange={(e) => handleFieldChange(mainIndex, 'tax', e.target.value)}
                      className="w-20 border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 text-gray-900 dark:text-gray-200"
                      min="0"
                    />
                  </td>

                  {/* Total */}
                  <td className="px-4 py-3 text-sm">
                    <input
                      type="number"
                      step="0.01"
                      value={invoice.total_amount.toFixed(2)}
                      onChange={(e) => handleFieldChange(mainIndex, 'total_amount', e.target.value)}
                      className="w-24 border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 font-medium text-gray-900 dark:text-gray-200"
                      min="0"
                    />
                  </td>

                  {/* Date */}
                  <td className={`px-4 py-3 text-sm ${
                    isMissing(invoice.date) ? 'bg-yellow-50 dark:bg-yellow-900/30' : ''
                  }`}>
                    <input
                      type="date"
                      value={invoice.date !== 'MISSING' ? invoice.date : ''}
                      onChange={(e) => handleFieldChange(mainIndex, 'date', e.target.value || 'MISSING')}
                      className={`w-full border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 ${
                        isMissing(invoice.date) 
                          ? 'text-yellow-800 dark:text-yellow-400' 
                          : 'text-gray-900 dark:text-gray-200'
                      }`}
                    />
                  </td>

                  {/* Payment Mode */}
                  <td className={`px-4 py-3 text-sm ${
                    isMissing(invoice.payment_mode) ? 'bg-yellow-50 dark:bg-yellow-900/30' : ''
                  }`}>
                    <input
                      type="text"
                      value={invoice.payment_mode}
                      onChange={(e) => handleFieldChange(mainIndex, 'payment_mode', e.target.value)}
                      className={`w-full border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 ${
                        isMissing(invoice.payment_mode) 
                          ? 'text-yellow-800 dark:text-yellow-400' 
                          : 'text-gray-900 dark:text-gray-200'
                      }`}
                      placeholder="Payment Mode"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-t border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 flex justify-between items-center">
        <div>
          Total Groups: <span className="font-medium">{Object.keys(groupedInvoices).length}</span>
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