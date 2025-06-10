import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AppState {
  isMobile?: boolean;
  isThresholdResponsive?: boolean;
  isAddSKUsModalVisible: boolean;
  isAppLoading?: boolean;
}

const initialState: AppState = {
  isMobile: false,
  isThresholdResponsive: false,
  isAddSKUsModalVisible: false,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
      return state;
    },
    setIsThresholdResponsive: (state, action: PayloadAction<boolean>) => {
      state.isThresholdResponsive = action.payload;
      return state;
    },
    setIsAddSKUsModalVisible: (state, action: PayloadAction<boolean>) => {
      state.isAddSKUsModalVisible = action.payload;
      return state;
    },
    setIsAppLoading: (state, action: PayloadAction<boolean>) => {
      state.isAppLoading = action.payload;
      return state;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setIsMobile, setIsAddSKUsModalVisible, setIsThresholdResponsive, setIsAppLoading } = appSlice.actions

export default appSlice.reducer