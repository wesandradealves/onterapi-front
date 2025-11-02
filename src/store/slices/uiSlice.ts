import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  pendingRequests: number;
}

const initialState: UiState = {
  pendingRequests: 0
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.pendingRequests = action.payload
        ? state.pendingRequests + 1
        : Math.max(0, state.pendingRequests - 1);
    },
    resetLoading(state) {
      state.pendingRequests = 0;
    }
  }
});

export const { setLoading, resetLoading } = uiSlice.actions;
export default uiSlice.reducer;