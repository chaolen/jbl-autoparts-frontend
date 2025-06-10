import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ProductDetails } from 'types/inventory';

export interface ViewProductState {
  _id?: string;
  product?: ProductDetails;
}

const initialState: ViewProductState = {}

export const viewProductSlice = createSlice({
  name: 'viewProduct',
  initialState,
  reducers: {
    setViewProductId: (state, action: PayloadAction<string | undefined>) => {
      state._id = action.payload;
    },
    setViewProduct: (state, action: PayloadAction<ProductDetails>) => {
      state.product = action.payload;
    },
    clearData: () => initialState,
  },
})

// Action creators are generated for each case reducer function
export const { clearData, setViewProduct, setViewProductId } = viewProductSlice.actions

export default viewProductSlice.reducer