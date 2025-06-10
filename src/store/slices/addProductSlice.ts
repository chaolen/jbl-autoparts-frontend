import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ProductDetails } from 'types/inventory';

export interface AddProductState {
  product?: ProductDetails;
}

const initialState: AddProductState = {
}

export const addProductSlice = createSlice({
  name: 'addProduct',
  initialState,
  reducers: {
    setAddProduct: (state, action: PayloadAction<ProductDetails>) => {
      const payload = action.payload;
      state.product = payload;
    },
    clearData: () => initialState,
  },
})

// Action creators are generated for each case reducer function
export const { clearData, setAddProduct } = addProductSlice.actions

export default addProductSlice.reducer