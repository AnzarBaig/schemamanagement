import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SchemamanagementState {
  value: number;
}

const initialState: SchemamanagementState = {
  value: 0,
};

const schemamanagementSlice = createSlice({
  name: 'schemamanagement',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = schemamanagementSlice.actions;
export default schemamanagementSlice.reducer;
