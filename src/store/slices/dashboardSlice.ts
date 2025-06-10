import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { SalesStatistics, Transaction } from 'types/transaction';

export interface DashboardState {
  pageIndex: number;
  pageSize: number;
  globalFilter: string;
  total: number;
  results?: Transaction[];
  statistics?: SalesStatistics;
}

const initialState: DashboardState = {
  globalFilter: "",
  pageIndex: 0,
  pageSize: 10,
  total: 0,
}

export const dashboardSlice = createSlice({
  name: 'dashboard',
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
    setSalesStatistics: (state, action: PayloadAction<SalesStatistics | undefined>) => {
      state.statistics = action.payload;
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
  setSalesStatistics,
 } = dashboardSlice.actions

export default dashboardSlice.reducer