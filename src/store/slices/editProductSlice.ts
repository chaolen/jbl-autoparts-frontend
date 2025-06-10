import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ProductDetails } from 'types/inventory';

export interface EditProductState {
  _id?: string;
  product?: ProductDetails;
}

const initialState: EditProductState = {
}

export const editProductSlice = createSlice({
  name: 'editProduct',
  initialState,
  reducers: {
    setEditProductId: (state, action: PayloadAction<string | undefined>) => {
      state._id = action.payload;
    },
    setEditProduct: (state, action: PayloadAction<ProductDetails>) => {
      const payload = action.payload;
      state.product = {
        ...payload,
        images: payload.images.map((url: any) => ({ url: url ?? '', file: null }))
      };
    },
    clearData: () => initialState,
  },
})

// Action creators are generated for each case reducer function
export const { clearData, setEditProduct, setEditProductId } = editProductSlice.actions

export default editProductSlice.reducer