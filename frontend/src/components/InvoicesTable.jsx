import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateInvoiceField } from '../store/invoicesSlice';
import { isMissing, formatCurrency } from '../utils/helpers';

function InvoicesTable() {
  const dispatch = useDispatch();
  const invoices = useSelector((state) => state.invoices.data);

  const handleFieldChange = (index, field, value) => {
    dispatch(updateInvoiceField({ index, field, value }));
  };

  if (invoices.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No invoices to display</p>
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
                Serial No
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Tax
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Total
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Payment
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoices.map((invoice, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className={`px-4 py-3 text-sm ${
                  isMissing(invoice.serial_number) ? 'bg-yellow-50' : ''
                }`}>
                  <input
                    type="text"
                    value={invoice.serial_number}
                    onChange={(e) => handleFieldChange(index, 'serial_number', e.target.value)}
                    className={`w-full border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 ${
                      isMissing(invoice.serial_number) ? 'text-yellow-800' : ''
                    }`}
                    placeholder="Serial No"
                  />
                </td>
                
                <td className={`px-4 py-3 text-sm ${
                  isMissing(invoice.customer_name) ? 'bg-yellow-50 text-yellow-800' : ''
                }`}>
                  {invoice.customer_name}
                </td>
                
                <td className={`px-4 py-3 text-sm ${
                  isMissing(invoice.product_name) ? 'bg-yellow-50 text-yellow-800' : ''
                }`}>
                  {invoice.product_name}
                </td>
                
                <td className="px-4 py-3 text-sm">
                  <input
                    type="number"
                    value={invoice.quantity}
                    onChange={(e) => handleFieldChange(index, 'quantity', parseInt(e.target.value) || 0)}
                    className="w-20 border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                    min="0"
                  />
                </td>
                
                <td className="px-4 py-3 text-sm text-gray-700">
                  {formatCurrency(invoice.tax)}
                </td>
                
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {formatCurrency(invoice.total_amount)}
                </td>
                
                <td className={`px-4 py-3 text-sm ${
                  isMissing(invoice.date) ? 'bg-yellow-50 text-yellow-800' : ''
                }`}>
                  <input
                    type="text"
                    value={invoice.date}
                    onChange={(e) => handleFieldChange(index, 'date', e.target.value)}
                    className={`w-full border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 ${
                      isMissing(invoice.date) ? 'text-yellow-800' : ''
                    }`}
                    placeholder="YYYY-MM-DD"
                  />
                </td>
                
                <td className={`px-4 py-3 text-sm ${
                  isMissing(invoice.payment_mode) ? 'bg-yellow-50 text-yellow-800' : ''
                }`}>
                  <input
                    type="text"
                    value={invoice.payment_mode}
                    onChange={(e) => handleFieldChange(index, 'payment_mode', e.target.value)}
                    className={`w-full border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 ${
                      isMissing(invoice.payment_mode) ? 'text-yellow-800' : ''
                    }`}
                    placeholder="Payment Mode"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-gray-50 px-4 py-3 border-t text-sm text-gray-600">
        Total Invoices: <span className="font-medium">{invoices.length}</span>
      </div>
    </div>
  );
}

export default InvoicesTable;