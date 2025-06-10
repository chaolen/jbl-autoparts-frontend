import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type SKU = {
  _id: string;
  sku: string;
  created_at: string;
};

export interface SKUSState {
  skus: SKU[];
}

const initialState: SKUSState = {
  skus: [],
}

type SKUID = {
  _id: string;
}

export const skusSlice = createSlice({
  name: 'skus',
  initialState,
  reducers: {
    setSKUs: (state, action: PayloadAction<SKU[]>) => {
      state.skus = action.payload;
    },
    addSKU: (state, action: PayloadAction<SKU>) => {
      state.skus = state.skus.concat(action.payload);
    },
    removeSKU: (state, action: PayloadAction<SKUID>) => {
      state.skus = state.skus.filter(sku => sku._id !== action.payload._id);
    },
  },
})

// Action creators are generated for each case reducer function
export const { setSKUs } = skusSlice.actions

export default skusSlice.reducer