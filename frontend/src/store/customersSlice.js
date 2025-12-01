import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
};

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setCustomers: (state, action) => {
      state.data = action.payload;
    },
    updateCustomerName: (state, action) => {
      const { oldName, newName } = action.payload;
      const customer = state.data.find(c => c.customer_name === oldName);
      if (customer) {
        customer.customer_name = newName;
      }
    },
    updateCustomerField: (state, action) => {
      const { customerName, field, value } = action.payload;
      const customer = state.data.find(c => c.customer_name === customerName);
      if (customer) {
        customer[field] = value;
      }
    },
    // NEW: Update customer total when invoice amounts change
    updateCustomerTotal: (state, action) => {
      const { customerName, totalAmount } = action.payload;
      const customer = state.data.find(c => c.customer_name === customerName);
      if (customer) {
        customer.total_purchase_amount = totalAmount;
      }
    },
    // NEW: Recalculate all customer totals from invoices
    recalculateCustomerTotals: (state, action) => {
      const invoices = action.payload;
      
      // Create a map of customer totals
      const customerTotals = {};
      invoices.forEach(invoice => {
        const customerName = invoice.customer_name;
        if (customerName && customerName !== 'MISSING') {
          customerTotals[customerName] = (customerTotals[customerName] || 0) + (invoice.total_amount || 0);
        }
      });
      
      // Update each customer's total
      state.data.forEach(customer => {
        if (customerTotals[customer.customer_name] !== undefined) {
          customer.total_purchase_amount = customerTotals[customer.customer_name];
        }
      });
    },
  },
});

export const {
  setCustomers,
  updateCustomerName,
  updateCustomerField,
  updateCustomerTotal,
  recalculateCustomerTotals,
} = customersSlice.actions;

export default customersSlice.reducer;