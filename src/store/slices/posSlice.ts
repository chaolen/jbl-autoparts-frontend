import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ProductDetails } from 'types/inventory';
import { CartItem } from 'types/pos';
import { TransactionItem } from 'types/transaction';
import { User } from 'types/user';

export interface POSState {
  globalFilter: string;
  results?: ProductDetails[];
  cartItems: CartItem[];
  partsman?: User;
  discountAmount: number;
  transactionId?: string;
  activeTab?: string;
  transactionItems?: ProductDetails[];
}

const initialState: POSState = {
  globalFilter: "",
  results: [],
  cartItems: [],
  transactionItems: [],
  activeTab: 'invoicing',
  discountAmount: 0,
}

export const posSlice = createSlice({
  name: 'pos',
  initialState,
  reducers: {
    setGlobalFilter: (state, action: PayloadAction<string>) => {
      state.globalFilter = action.payload;
    },
    setResults: (state, action: PayloadAction<ProductDetails[]>) => {
      state.results = action.payload
      // const transactionItems= state?.transactionItems;
      // if (transactionItems && transactionItems.length > 0) {
      //   state.results = action.payload.map(item => {
      //     const reservedItem: any = transactionItems.find(i => i?._id === item._id);
      //     if (reservedItem?._id) {
      //       return {
      //         ...item,
      //         quantityRemaining: item.quantityRemaining + reservedItem?.count
      //       }
      //     }
      //     return item;
      //   })
      // }
      // return state;
    },
    setCartItems(state, action: PayloadAction<CartItem[]>) {
      state.cartItems = action.payload;
    },
    setPartsman(state, action: PayloadAction<User>) {
      state.partsman = action.payload;
    },
    setDiscountAmount(state, action: PayloadAction<number>) {
      state.discountAmount = action.payload;
    },
    setTransactionid(state, action: PayloadAction<string | undefined>) {
      state.transactionId = action.payload;
    },
    setActiveTab(state, action: PayloadAction<string>) {
      state.activeTab = action.payload;
    },
    setTransaction: (state, action: PayloadAction<POSState>) => {
      state = {
        ...state,
        ...action.payload,
        transactionItems: action.payload.cartItems,
      };
      return state;
    },
    clearCart: (state) => {
      state = {
        ...state,
        cartItems: [],
        discountAmount: 0,
        transactionId: undefined,
        partsman: undefined,
      }
      return state;
    },
    clearData: () => initialState,
  },
})

export const {
  clearData,
  setGlobalFilter,
  setResults,
  setCartItems,
  clearCart,
  setPartsman,
  setDiscountAmount,
  setTransactionid,
  setTransaction,
  setActiveTab,
} = posSlice.actions

export default posSlice.reducer