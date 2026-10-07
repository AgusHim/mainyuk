import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { api, user_api } from "../api";
import {
  CartLine,
  CreateShopOrder,
  ProductSort,
  ProductView,
  ShopOrder,
  SubmitProof,
} from "@/types/shop";

// Keranjang disimpan di klien sebagai id varian + jumlah, TIDAK beserta
// harganya. Itu bukan penghematan, melainkan penegakan: harga yang tidak
// pernah disimpan tidak dapat dikirim, sehingga tidak ada harga klien yang
// bisa lolos ke checkout. Harga dihitung server dari varian saat itu.
//
// `cartMeta` hanya menambahkan nama untuk ditampilkan di halaman keranjang —
// keranjang tanpa nama sama tidak terbaca. Ia sengaja tidak memuat harga sama
// sekali, dan payload checkout dibangun dari `cart` saja, sehingga tidak ada
// jalan bagi isi `cartMeta` untuk ikut terkirim.
export type CartMeta = {
  product_name: string;
  variant_label: string;
  slug: string;
};

interface ShopState {
  products: ProductView[] | null;
  productsHasMore: boolean;
  product: ProductView | null;
  orders: ShopOrder[] | null;
  ordersHasMore: boolean;
  order: ShopOrder | null;
  cart: CartLine[];
  cartMeta: Record<string, CartMeta>;
  loading: boolean;
  error: string | null;
}

const initialState: ShopState = {
  products: null,
  productsHasMore: false,
  product: null,
  orders: null,
  ordersHasMore: false,
  order: null,
  cart: [],
  cartMeta: {},
  loading: false,
  error: null,
};

/* ---------- katalog publik ---------- */

export const getProducts = createAsyncThunk(
  "shop.list",
  async (params: { sort?: ProductSort; page?: number }) => {
    const res = await api.get("/shop/products", { params });
    return res.data as {
      products: ProductView[];
      page: number;
      per_page: number;
      has_more: boolean;
    };
  }
);

export const getProductDetail = createAsyncThunk(
  "shop.detail",
  async (slug: string) => {
    const res = await api.get(`/shop/products/${slug}`);
    return res.data.product as ProductView;
  }
);

/* ---------- pesanan anggota ---------- */

export const createShopOrder = createAsyncThunk(
  "shop.checkout",
  async (data: CreateShopOrder) => {
    const res = await user_api.post("/shop/orders", data);
    return res.data.order as ShopOrder;
  }
);

export const getMyShopOrders = createAsyncThunk(
  "shop.orders",
  async (params: { page?: number }) => {
    const res = await user_api.get("/shop/orders", { params });
    return res.data as {
      orders: ShopOrder[];
      page: number;
      per_page: number;
      has_more: boolean;
    };
  }
);

export const getMyShopOrder = createAsyncThunk(
  "shop.order",
  async (publicId: string) => {
    const res = await user_api.get(`/shop/orders/${publicId}`);
    return res.data.order as ShopOrder;
  }
);

export const submitShopOrderProof = createAsyncThunk(
  "shop.proof",
  async (params: { publicId: string; data: SubmitProof }) => {
    const res = await user_api.put(
      `/shop/orders/${params.publicId}/proof`,
      params.data
    );
    return res.data.order as ShopOrder;
  }
);

export const cancelShopOrder = createAsyncThunk(
  "shop.cancel",
  async (publicId: string) => {
    const res = await user_api.put(`/shop/orders/${publicId}/cancel`);
    return res.data.order as ShopOrder;
  }
);

// Menggabungkan baris varian yang sama, seperti NormalizeCart di server.
// Dilakukan juga di klien supaya angka di keranjang tidak pernah menampilkan
// dua baris varian identik yang sebenarnya satu.
const mergeLine = (cart: CartLine[], line: CartLine): CartLine[] => {
  const index = cart.findIndex((item) => item.variant_id === line.variant_id);
  if (index < 0) {
    return [...cart, line];
  }
  const next = [...cart];
  next[index] = {
    ...next[index],
    qty: Math.max(next[index].qty + line.qty, 0),
  };
  return next;
};

export const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    addToCart: (state, action: { payload: CartLine & { meta?: CartMeta } }) => {
      if (action.payload.qty <= 0) {
        return;
      }
      state.cart = mergeLine(state.cart, {
        variant_id: action.payload.variant_id,
        qty: action.payload.qty,
      });
      if (action.payload.meta) {
        state.cartMeta = {
          ...state.cartMeta,
          [action.payload.variant_id]: action.payload.meta,
        };
      }
    },
    updateCartQty: (
      state,
      action: { payload: { variant_id: string; qty: number } }
    ) => {
      if (action.payload.qty <= 0) {
        state.cart = state.cart.filter(
          (line) => line.variant_id !== action.payload.variant_id
        );
        delete state.cartMeta[action.payload.variant_id];
        return;
      }
      state.cart = state.cart.map((line) =>
        line.variant_id === action.payload.variant_id
          ? { ...line, qty: action.payload.qty }
          : line
      );
    },
    removeFromCart: (state, action: { payload: string }) => {
      state.cart = state.cart.filter(
        (line) => line.variant_id !== action.payload
      );
      delete state.cartMeta[action.payload];
    },
    clearCart: (state) => {
      state.cart = [];
      state.cartMeta = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.products =
        action.payload.page <= 1
          ? action.payload.products
          : [...(state.products ?? []), ...action.payload.products];
      state.productsHasMore = action.payload.has_more;
      state.loading = false;
    });
    builder.addCase(getProductDetail.fulfilled, (state, action) => {
      state.product = action.payload;
      state.loading = false;
    });
    builder.addCase(createShopOrder.fulfilled, (state, action) => {
      state.order = action.payload;
      // Keranjang dikosongkan hanya setelah pesanannya benar-benar terbentuk.
      state.cart = [];
      state.cartMeta = {};
      state.loading = false;
    });
    builder.addCase(getMyShopOrders.fulfilled, (state, action) => {
      state.orders =
        action.payload.page <= 1
          ? action.payload.orders
          : [...(state.orders ?? []), ...action.payload.orders];
      state.ordersHasMore = action.payload.has_more;
      state.loading = false;
    });
    builder.addCase(getMyShopOrder.fulfilled, (state, action) => {
      state.order = action.payload;
      state.loading = false;
    });
    builder.addCase(submitShopOrderProof.fulfilled, (state, action) => {
      state.order = action.payload;
      state.loading = false;
    });
    builder.addCase(cancelShopOrder.fulfilled, (state, action) => {
      state.order = action.payload;
      state.orders = (state.orders ?? []).map((order) =>
        order.public_id === action.payload.public_id ? action.payload : order
      );
      state.loading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getProducts.pending,
        getProductDetail.pending,
        createShopOrder.pending,
        getMyShopOrders.pending,
        getMyShopOrder.pending,
        submitShopOrderProof.pending,
        cancelShopOrder.pending
      ),
      (state, _) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getProducts.rejected,
        getProductDetail.rejected,
        createShopOrder.rejected,
        getMyShopOrders.rejected,
        getMyShopOrder.rejected,
        submitShopOrderProof.rejected,
        cancelShopOrder.rejected
      ),
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      }
    );
  },
});

export const { addToCart, updateCartQty, removeFromCart, clearCart } =
  shopSlice.actions;

// Satu-satunya jalan dari state keranjang menuju payload checkout. Ia menyalin
// hanya `variant_id` dan `qty`, sehingga `cartMeta` — apa pun isinya kelak —
// tidak punya cara untuk ikut terkirim.
export const cartLines = (cart: CartLine[]): CartLine[] =>
  cart.map((line) => ({ variant_id: line.variant_id, qty: line.qty }));

export default shopSlice.reducer;
