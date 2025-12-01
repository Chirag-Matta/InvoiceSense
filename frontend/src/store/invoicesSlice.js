import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  loading: false,
  error: null,
  success: null,
};

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    setInvoices: (state, action) => {
      state.data = action.payload;
      state.error = null;
    },
    updateInvoiceField: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.data[index]) {
        state.data[index][field] = value;
      }
    },
    updateInvoicesByProductName: (state, action) => {
      const { oldName, newName } = action.payload;
      state.data = state.data.map(invoice =>
        invoice.product_name === oldName
          ? { ...invoice, product_name: newName }
          : invoice
      );
    },
    updateInvoicesByCustomerName: (state, action) => {
      const { oldName, newName } = action.payload;
      state.data = state.data.map(invoice =>
        invoice.customer_name === oldName
          ? { ...invoice, customer_name: newName }
          : invoice
      );
    },
    // Updated: Use per-unit tax calculation
    updateInvoicesByProductPricing: (state, action) => {
      const { productName, unit_price, taxPerUnit } = action.payload;
      state.data = state.data.map(invoice => {
        if (invoice.product_name === productName) {
          const quantity = invoice.quantity || 1;
          const newTax = taxPerUnit * quantity;
          const newTotal = (unit_price * quantity) + newTax;
          
          return {
            ...invoice,
            tax: newTax,
            total_amount: newTotal
          };
        }
        return invoice;
      });
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
      state.loading = false;
    },
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
});

export const {
  setInvoices,
  updateInvoiceField,
  updateInvoicesByProductName,
  updateInvoicesByCustomerName,
  updateInvoicesByProductPricing,
  setLoading,
  setError,
  setSuccess,
  clearMessages,
} = invoicesSlice.actions;

export default invoicesSlice.reducer;