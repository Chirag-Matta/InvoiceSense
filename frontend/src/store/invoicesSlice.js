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
  setLoading,
  setError,
  setSuccess,
  clearMessages,
} = invoicesSlice.actions;

export default invoicesSlice.reducer;