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
        
        // Recalculate total_amount if quantity changes
        if (field === 'quantity') {
          const invoice = state.data[index];
          // Assuming total = (unit_price * quantity) + tax
          // If we don't have unit_price, we keep the existing total
          if (invoice.unit_price) {
            invoice.total_amount = (invoice.unit_price * value) + (invoice.tax || 0);
          }
        }
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
    // NEW: Update invoices when product pricing changes
    updateInvoicesByProductPricing: (state, action) => {
      const { productName, unit_price, tax } = action.payload;
      state.data = state.data.map(invoice => {
        if (invoice.product_name === productName) {
          const newTotal = (unit_price * invoice.quantity) + tax;
          return {
            ...invoice,
            tax: tax,
            total_amount: newTotal,
            unit_price: unit_price // Store unit_price for future calculations
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