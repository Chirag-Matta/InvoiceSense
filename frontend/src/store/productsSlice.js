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
        
        // Recalculate price_with_tax when unit_price or tax changes
        if (field === 'unit_price' || field === 'tax') {
          const unitPrice = field === 'unit_price' ? value : product.unit_price;
          const tax = field === 'tax' ? value : product.tax;
          product.price_with_tax = (unitPrice * product.quantity) + tax;
        }
      }
    },
    // NEW: Recalculate product aggregates from invoices
    recalculateProductsFromInvoices: (state, action) => {
      const invoices = action.payload;
      
      // Create a map to aggregate product data
      const productAggregates = {};
      
      invoices.forEach(invoice => {
        const productName = invoice.product_name;
        if (productName && productName !== 'MISSING') {
          if (!productAggregates[productName]) {
            productAggregates[productName] = {
              quantity: 0,
              tax: 0,
              price_with_tax: 0,
            };
          }
          productAggregates[productName].quantity += invoice.quantity || 0;
          productAggregates[productName].tax += invoice.tax || 0;
          productAggregates[productName].price_with_tax += invoice.total_amount || 0;
        }
      });
      
      // Update products with aggregated values
      state.data.forEach(product => {
        if (productAggregates[product.name]) {
          product.quantity = productAggregates[product.name].quantity;
          product.tax = productAggregates[product.name].tax;
          product.price_with_tax = productAggregates[product.name].price_with_tax;
          
          // Recalculate unit price if quantity is valid
          if (product.quantity > 0 && productAggregates[product.name].price_with_tax > 0) {
            product.unit_price = (productAggregates[product.name].price_with_tax - productAggregates[product.name].tax) / product.quantity;
          }
        }
      });
    },
  },
});

export const {
  setProducts,
  updateProductName,
  updateProductField,
  recalculateProductsFromInvoices,
} = productsSlice.actions;

export default productsSlice.reducer;