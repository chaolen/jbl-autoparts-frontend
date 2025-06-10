import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type Status = {
  label: string;
  value: string;
};

export interface InventoryState {
  pageIndex: number;
  pageSize: number;
  globalFilter: string;
  status: Status;
  total: number;
}

const initialState: InventoryState = {
  globalFilter: "",
  pageIndex: 0,
  pageSize: 10,
  status: {
    label: "All Status",
    value: ""
  },
  total: 0,
}

export const inventorySlice = createSlice({
  name: 'inventory',
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
    setStatus: (state, action: PayloadAction<Status>) => {
      state.status = action.payload;
    },
    clearData: () => initialState,
  },
})

export const {
  clearData,
  setGlobalFilter,
  setPageIndex,
  setPageSize,
  setStatus,
  setTotal,
 } = inventorySlice.actions

export default inventorySlice.reducer