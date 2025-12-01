import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.data = action.payload;
    },
    updateProductName: (state, action) => {
      const { oldName, newName } = action.payload;
      const product = state.data.find(p => p.name === oldName);
      if (product) {
        product.name = newName;
      }
    },
    updateProductField: (state, action) => {
      const { productName, field, value } = action.payload;
      const product = state.data.find(p => p.name === productName);
      if (product) {
        product[field] = value;
      }
    },
  },
});

export const {
  setProducts,
  updateProductName,
  updateProductField,
} = productsSlice.actions;

export default productsSlice.reducer;