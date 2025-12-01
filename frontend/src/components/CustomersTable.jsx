import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateCustomerName, updateCustomerField } from '../store/customersSlice';
import { updateInvoicesByCustomerName } from '../store/invoicesSlice';
import { isMissing, formatCurrency } from '../utils/helpers';

function CustomersTable() {
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customers.data);
  const [editingName, setEditingName] = useState(null);
  const [tempName, setTempName] = useState('');

  const startEdit = (customer) => {
    setEditingName(customer.customer_name);
    setTempName(customer.customer_name);
  };

  const saveEdit = (oldName) => {
    if (tempName && tempName !== oldName && tempName.trim() !== '') {
      // Update customer name
      dispatch(updateCustomerName({ oldName, newName: tempName }));
      // Update all invoices with this customer
      dispatch(updateInvoicesByCustomerName({ oldName, newName: tempName }));
    }
    setEditingName(null);
    setTempName('');
  };

  const cancelEdit = () => {
    setEditingName(null);
    setTempName('');
  };

  const handleFieldChange = (customerName, field, value) => {
    const parsedValue = field === 'total_purchase_amount'
      ? parseFloat(value) || 0
      : value;

    dispatch(updateCustomerField({ customerName, field, value: parsedValue }));
  };

  if (customers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No customers to display</p>
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
                Customer Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Phone Number
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Total Purchase
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Address
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customers.map((customer, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className={`px-4 py-3 text-sm ${
                  isMissing(customer.customer_name) ? 'bg-yellow-50' : ''
                }`}>
                  {editingName === customer.customer_name ? (
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onBlur={() => saveEdit(customer.customer_name)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(customer.customer_name);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      className={`w-full border border-blue-500 focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 ${
                        isMissing(tempName) ? 'text-yellow-800' : ''
                      }`}
                      autoFocus
                      placeholder="Customer Name"
                    />
                  ) : (
                    <div
                      onClick={() => startEdit(customer)}
                      className={`cursor-pointer hover:bg-gray-100 px-2 py-1 rounded ${
                        isMissing(customer.customer_name) ? 'text-yellow-800' : ''
                      }`}
                      title="Click to edit - will update all invoices"
                    >
                      {customer.customer_name || 'MISSING'}
                    </div>
                  )}
                </td>
                
                <td className={`px-4 py-3 text-sm ${
                  isMissing(customer.phone_number) ? 'bg-yellow-50' : ''
                }`}>
                  <input
                    type="text"
                    value={customer.phone_number}
                    onChange={(e) => handleFieldChange(customer.customer_name, 'phone_number', e.target.value)}
                    className={`w-full border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 ${
                      isMissing(customer.phone_number) ? 'text-yellow-800' : ''
                    }`}
                    placeholder="Phone Number"
                  />
                </td>
                
                <td className="px-4 py-3 text-sm font-medium text-green-600">
                  {formatCurrency(customer.total_purchase_amount)}
                  <span className="text-xs text-gray-500 ml-1">(auto-calculated)</span>
                </td>
                
                <td className={`px-4 py-3 text-sm ${
                  isMissing(customer.email) ? 'bg-yellow-50' : ''
                }`}>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => handleFieldChange(customer.customer_name, 'email', e.target.value)}
                    className={`w-full border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 ${
                      isMissing(customer.email) ? 'text-yellow-800' : ''
                    }`}
                    placeholder="Email"
                  />
                </td>
                
                <td className={`px-4 py-3 text-sm ${
                  isMissing(customer.address) ? 'bg-yellow-50' : ''
                }`}>
                  <input
                    type="text"
                    value={customer.address}
                    onChange={(e) => handleFieldChange(customer.customer_name, 'address', e.target.value)}
                    className={`w-full border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 ${
                      isMissing(customer.address) ? 'text-yellow-800' : ''
                    }`}
                    placeholder="Address"
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
            Total Customers: <span className="font-medium">{customers.length}</span>
          </div>
          <div className="text-xs text-gray-500 italic">
            💡 Purchase amounts are auto-calculated from invoices
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomersTable;