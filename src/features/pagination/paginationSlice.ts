import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Pagination {
  page: number;
  limit: number;
  total: number;
}

interface PaginationState {
  pagination: Pagination;
  nestedPagination: Pagination;
  timestamp: number;
}

const initialState: PaginationState = {
  pagination: { page: 1, limit: 10, total: 0 },
  nestedPagination: { page: 1, limit: 10, total: 0 },
  timestamp: Date.now(),
};

const paginationSlice = createSlice({
  name: 'pagination',
  initialState,
  reducers: {
    // Increment the current page for the main pagination
    incrementPage: (state) => {
      state.pagination.page += 1;
    },
    // Decrement the current page for the main pagination
    decrementPage: (state) => {
      if (state.pagination.page > 1) {
        state.pagination.page -= 1;
      }
    },
    // Update pagination by a specific payload (e.g., for custom page increments)
    updatePageByAmount: (state, action: PayloadAction<number>) => {
      state.pagination.page += action.payload;
    },
    // Update nestedPagination
    updateNestedPagination: (
      state,
      action: PayloadAction<{ page?: number; limit?: number; total?: number }>
    ) => {
      const { page, limit, total } = action.payload;
      if (page !== undefined) state.nestedPagination.page = page;
      if (limit !== undefined) state.nestedPagination.limit = limit;
      if (total !== undefined) state.nestedPagination.total = total;
    },
    // Update timestamp
    updateTimestamp: (state) => {
      state.timestamp = Date.now();
    },
  },
});

export const {
  incrementPage,
  decrementPage,
  updatePageByAmount,
  updateNestedPagination,
  updateTimestamp,
} = paginationSlice.actions;

export default paginationSlice.reducer;
