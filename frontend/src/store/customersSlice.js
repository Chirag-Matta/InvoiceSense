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
  },
});

export const {
  setCustomers,
  updateCustomerName,
  updateCustomerField,
} = customersSlice.actions;

export default customersSlice.reducer;