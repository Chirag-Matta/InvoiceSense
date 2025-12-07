// frontend/src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import invoicesReducer from './invoicesSlice';
import productsReducer from './productsSlice';
import customersReducer from './customersSlice';
import saveReducer from './saveSlice';

export const store = configureStore({
  reducer: {
    invoices: invoicesReducer,
    products: productsReducer,
    customers: customersReducer,
    save: saveReducer,
  },
});

export default store;