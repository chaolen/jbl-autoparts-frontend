import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type Session = {
  id: string;
  token: string,
  username: string;
  role: string;
  customRole?: string;
  name?: string;
};

export interface UserState {
  id: string;
  token: string | undefined,
  username: string;
  role: string;
  customRole?: string;
  name?: string;
}

const initialState: UserState = {
  id: '',
  username: '',
  token: undefined,
  role: '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Session>) => {
      state = action.payload;
      return state;
    },
    clearSession: () => initialState,
  },
})

// Action creators are generated for each case reducer function
export const { clearSession, setSession } = userSlice.actions

export default userSlice.reducer