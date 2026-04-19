import {
  createAsyncThunk,
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { Product, LoadingStatus } from "@/types";
import type { RootState } from "@store";
import type { ProductCategoryLabel } from "@/constants/categories";

import { DEFAULT_CATEGORY } from "@/constants/categories";
import { getProducts } from "@/services/productsService";

type ProductsState = {
  items: Product[];
  status: LoadingStatus;
  error: string | null;
  activeCategory: ProductCategoryLabel;
};

const initialState: ProductsState = {
  items: [],
  status: "idle",
  error: null,
  activeCategory: DEFAULT_CATEGORY,
};

export const fetchProducts = createAsyncThunk<
  Product[],
  ProductCategoryLabel | undefined,
  { rejectValue: string }
>("products/fetchProducts", async (category, thunkApi) => {
  try {
    const response = await getProducts(category ? { category } : undefined);
    return response.data;
  } catch {
    return thunkApi.rejectWithValue("Failed to load products.");
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setActiveCategory(state, action: PayloadAction<ProductCategoryLabel>) {
      state.activeCategory = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to load products.";
      }),
});

export const { setActiveCategory } = productsSlice.actions;

export default productsSlice.reducer;

const selectProductsState = (state: RootState) => state.products;

export const selectProducts = createSelector(
  [selectProductsState],
  (productsState) => productsState.items,
);

export const selectProductsStatus = createSelector(
  [selectProductsState],
  (productsState) => productsState.status,
);

export const selectProductsError = createSelector(
  [selectProductsState],
  (productsState) => productsState.error,
);

export const selectActiveCategory = createSelector(
  [selectProductsState],
  (productsState) => productsState.activeCategory,
);
