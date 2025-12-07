// frontend/src/store/saveSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  savedState: {
    invoices: [],
    products: [],
    customers: [],
  },
  lastSaved: null,
  hasUnsavedChanges: {
    invoices: false,
    products: false,
    customers: false,
  },
};

const saveSlice = createSlice({
  name: 'save',
  initialState,
  reducers: {
    saveTab: (state, action) => {
      const { tabName, data } = action.payload;
      state.savedState[tabName] = JSON.parse(JSON.stringify(data));
      state.hasUnsavedChanges[tabName] = false;
      state.lastSaved = new Date().toISOString();
    },
    saveAll: (state, action) => {
      const { invoices, products, customers } = action.payload;
      state.savedState.invoices = JSON.parse(JSON.stringify(invoices));
      state.savedState.products = JSON.parse(JSON.stringify(products));
      state.savedState.customers = JSON.parse(JSON.stringify(customers));
      state.hasUnsavedChanges.invoices = false;
      state.hasUnsavedChanges.products = false;
      state.hasUnsavedChanges.customers = false;
      state.lastSaved = new Date().toISOString();
    },
    markUnsavedChanges: (state, action) => {
      const { tabName } = action.payload;
      state.hasUnsavedChanges[tabName] = true;
    },
    initializeSavedState: (state, action) => {
      const { invoices, products, customers } = action.payload;
      state.savedState.invoices = JSON.parse(JSON.stringify(invoices));
      state.savedState.products = JSON.parse(JSON.stringify(products));
      state.savedState.customers = JSON.parse(JSON.stringify(customers));
      state.lastSaved = new Date().toISOString();
      state.hasUnsavedChanges.invoices = false;
      state.hasUnsavedChanges.products = false;
      state.hasUnsavedChanges.customers = false;
    },
  },
});

export const {
  saveTab,
  saveAll,
  markUnsavedChanges,
  initializeSavedState,
} = saveSlice.actions;

export default saveSlice.reducer;