import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ProductDetails } from 'types/inventory';

const apiURL = process.env.REACT_APP_API_BASE_URL;

export interface SearchState {
  pageIndex: number;
  pageSize: number;
  globalFilter: string;
  total: number;
  results?: ProductDetails[];
}

const initialState: SearchState = {
  globalFilter: "",
  pageIndex: 0,
  pageSize: 20,
  total: 0,
  results: [],
}

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setPageIndex: (state, action: PayloadAction<number>) => {
      state.pageIndex = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    setTotal: (state, action: PayloadAction<number>) => {
      state.total = action.payload;
    },
    setGlobalFilter: (state, action: PayloadAction<string>) => {
      state.globalFilter = action.payload;
    },
    setResults: (state, action: PayloadAction<ProductDetails[]>) => {
      state.results = action.payload;
    },
    clearData: () => initialState,
  },
})

export const {
  clearData,
  setGlobalFilter,
  setPageIndex,
  setPageSize,
  setTotal,
  setResults,
 } = searchSlice.actions

export default searchSlice.reducer