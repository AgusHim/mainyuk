import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { admin_api } from "../api";
import {
  AdjustStock,
  ConfirmShopOrder,
  CreateProduct,
  DecideShopOrder,
  FulfillShopOrder,
  PaymentStatus,
  FulfillmentStatus,
  ProductStatus,
  ProductView,
  ProductVariant,
  SetProductStatus,
  SetShopShipping,
  ShopAuditLog,
  ShopOrder,
  UpdateProduct,
  VariantInput,
} from "@/types/shop";

// Slice terpisah dari `shopSlice` supaya bentuk state-nya tidak tercampur:
// yang satu melayani pembeli, yang satu melayani pengurus, dan keduanya
// menyimpan daftar produk yang berbeda (katalog terbit vs seluruh katalog).
interface ShopAdminState {
  products: ProductView[] | null;
  productsHasMore: boolean;
  orders: ShopOrder[] | null;
  ordersHasMore: boolean;
  order: ShopOrder | null;
  auditLogs: ShopAuditLog[];
  auditHasMore: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: ShopAdminState = {
  products: null,
  productsHasMore: false,
  orders: null,
  ordersHasMore: false,
  order: null,
  auditLogs: [],
  auditHasMore: false,
  loading: false,
  error: null,
};

/* ---------- katalog ---------- */

export const getAdminProducts = createAsyncThunk(
  "shopAdmin.products",
  async (params: { status?: ProductStatus | ""; page?: number }) => {
    const res = await admin_api.get("/shop/products", {
      params: {
        page: params.page,
        status: params.status ? params.status : undefined,
      },
    });
    return res.data as {
      products: ProductView[];
      page: number;
      per_page: number;
      has_more: boolean;
    };
  }
);

export const createProduct = createAsyncThunk(
  "shopAdmin.createProduct",
  async (data: CreateProduct) => {
    const res = await admin_api.post("/shop/products", data);
    return res.data.product as ProductView;
  }
);

export const updateProduct = createAsyncThunk(
  "shopAdmin.updateProduct",
  async (params: { id: string; data: UpdateProduct }) => {
    const res = await admin_api.put(`/shop/products/${params.id}`, params.data);
    return res.data.product as ProductView;
  }
);

export const setProductStatus = createAsyncThunk(
  "shopAdmin.setProductStatus",
  async (params: { id: string; data: SetProductStatus }) => {
    const res = await admin_api.put(
      `/shop/products/${params.id}/status`,
      params.data
    );
    return res.data.product as ProductView;
  }
);

export const deleteProduct = createAsyncThunk(
  "shopAdmin.deleteProduct",
  async (id: string) => {
    await admin_api.delete(`/shop/products/${id}`);
    return id;
  }
);

/* ---------- varian ---------- */

export const createVariant = createAsyncThunk(
  "shopAdmin.createVariant",
  async (params: { productId: string; data: VariantInput }) => {
    const res = await admin_api.post(
      `/shop/products/${params.productId}/variants`,
      params.data
    );
    return res.data.variant as ProductVariant;
  }
);

export const updateVariant = createAsyncThunk(
  "shopAdmin.updateVariant",
  async (params: { id: string; data: VariantInput }) => {
    const res = await admin_api.put(`/shop/variants/${params.id}`, params.data);
    return res.data.variant as ProductVariant;
  }
);

export const deleteVariant = createAsyncThunk(
  "shopAdmin.deleteVariant",
  async (id: string) => {
    await admin_api.delete(`/shop/variants/${id}`);
    return id;
  }
);

export const adjustVariantStock = createAsyncThunk(
  "shopAdmin.adjustStock",
  async (params: { id: string; data: AdjustStock }) => {
    const res = await admin_api.post(
      `/shop/variants/${params.id}/stock`,
      params.data
    );
    return res.data.variant as ProductVariant;
  }
);

/* ---------- pesanan ---------- */

export const getAdminShopOrders = createAsyncThunk(
  "shopAdmin.orders",
  async (params: {
    payment_status?: PaymentStatus | "";
    fulfillment_status?: FulfillmentStatus | "";
    page?: number;
  }) => {
    const res = await admin_api.get("/shop/orders", {
      params: {
        page: params.page,
        payment_status: params.payment_status ? params.payment_status : undefined,
        fulfillment_status: params.fulfillment_status
          ? params.fulfillment_status
          : undefined,
      },
    });
    return res.data as {
      orders: ShopOrder[];
      page: number;
      per_page: number;
      has_more: boolean;
    };
  }
);

export const confirmShopOrder = createAsyncThunk(
  "shopAdmin.confirm",
  async (params: { id: string; data: ConfirmShopOrder }) => {
    const res = await admin_api.put(
      `/shop/orders/${params.id}/confirm`,
      params.data
    );
    return res.data.order as ShopOrder;
  }
);

export const rejectShopOrder = createAsyncThunk(
  "shopAdmin.reject",
  async (params: { id: string; data: DecideShopOrder }) => {
    const res = await admin_api.put(
      `/shop/orders/${params.id}/reject`,
      params.data
    );
    return res.data.order as ShopOrder;
  }
);

export const refundShopOrder = createAsyncThunk(
  "shopAdmin.refund",
  async (params: { id: string; data: DecideShopOrder }) => {
    const res = await admin_api.put(
      `/shop/orders/${params.id}/refund`,
      params.data
    );
    return res.data.order as ShopOrder;
  }
);

export const fulfillShopOrder = createAsyncThunk(
  "shopAdmin.fulfill",
  async (params: { id: string; data: FulfillShopOrder }) => {
    const res = await admin_api.put(
      `/shop/orders/${params.id}/fulfill`,
      params.data
    );
    return res.data.order as ShopOrder;
  }
);

export const setShopOrderShipping = createAsyncThunk(
  "shopAdmin.shipping",
  async (params: { id: string; data: SetShopShipping }) => {
    const res = await admin_api.put(
      `/shop/orders/${params.id}/shipping`,
      params.data
    );
    return res.data.order as ShopOrder;
  }
);

export const getShopAuditLogs = createAsyncThunk(
  "shopAdmin.auditLogs",
  async (params: { page?: number } | undefined) => {
    const res = await admin_api.get("/shop/audit_logs", {
      params: { page: params?.page },
    });
    return res.data as {
      audit_logs: ShopAuditLog[];
      page: number;
      per_page: number;
      has_more: boolean;
    };
  }
);

// Menyisipkan produk ke daftar tanpa memuat ulang halaman, dan menggantinya
// bila sudah ada — dipakai oleh semua aksi katalog yang mengembalikan produk
// utuh.
const upsertProduct = (state: ShopAdminState, product: ProductView) => {
  const list = state.products ?? [];
  const index = list.findIndex((item) => item.id === product.id);
  state.products =
    index < 0
      ? [product, ...list]
      : list.map((item) => (item.id === product.id ? product : item));
};

const upsertOrder = (state: ShopAdminState, order: ShopOrder) => {
  state.order = order;
  state.orders = (state.orders ?? []).map((item) =>
    item.id === order.id ? order : item
  );
};

export const shopAdminSlice = createSlice({
  name: "shopAdmin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAdminProducts.fulfilled, (state, action) => {
      state.products =
        action.payload.page <= 1
          ? action.payload.products
          : [...(state.products ?? []), ...action.payload.products];
      state.productsHasMore = action.payload.has_more;
      state.loading = false;
    });
    builder.addCase(createProduct.fulfilled, (state, action) => {
      upsertProduct(state, action.payload);
      state.loading = false;
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      upsertProduct(state, action.payload);
      state.loading = false;
    });
    builder.addCase(setProductStatus.fulfilled, (state, action) => {
      upsertProduct(state, action.payload);
      state.loading = false;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.products = (state.products ?? []).filter(
        (product) => product.id !== action.payload
      );
      state.loading = false;
    });
    // Aksi varian mengembalikan satu varian, bukan produk utuh, sedangkan
    // `ProductView.variants` memuat `label` dan `available` yang hanya dapat
    // dihitung server. Karena itu state tidak ditambal di sini: tabelnya yang
    // memuat ulang. Yang penting, `loading` tetap ditutup — tanpa ini tombol
    // akan tersangkut nonaktif setelah aksi varian yang berhasil.
    builder.addCase(createVariant.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(updateVariant.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(deleteVariant.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(adjustVariantStock.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(getAdminShopOrders.fulfilled, (state, action) => {
      state.orders =
        action.payload.page <= 1
          ? action.payload.orders
          : [...(state.orders ?? []), ...action.payload.orders];
      state.ordersHasMore = action.payload.has_more;
      state.loading = false;
    });
    builder.addCase(confirmShopOrder.fulfilled, (state, action) => {
      upsertOrder(state, action.payload);
      state.loading = false;
    });
    builder.addCase(rejectShopOrder.fulfilled, (state, action) => {
      upsertOrder(state, action.payload);
      state.loading = false;
    });
    builder.addCase(refundShopOrder.fulfilled, (state, action) => {
      upsertOrder(state, action.payload);
      state.loading = false;
    });
    builder.addCase(fulfillShopOrder.fulfilled, (state, action) => {
      upsertOrder(state, action.payload);
      state.loading = false;
    });
    builder.addCase(setShopOrderShipping.fulfilled, (state, action) => {
      upsertOrder(state, action.payload);
      state.loading = false;
    });
    builder.addCase(getShopAuditLogs.fulfilled, (state, action) => {
      state.auditLogs =
        action.payload.page <= 1
          ? action.payload.audit_logs
          : [...state.auditLogs, ...action.payload.audit_logs];
      state.auditHasMore = action.payload.has_more;
      state.loading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getAdminProducts.pending,
        createProduct.pending,
        updateProduct.pending,
        setProductStatus.pending,
        deleteProduct.pending,
        createVariant.pending,
        updateVariant.pending,
        deleteVariant.pending,
        adjustVariantStock.pending,
        getAdminShopOrders.pending,
        confirmShopOrder.pending,
        rejectShopOrder.pending,
        refundShopOrder.pending,
        fulfillShopOrder.pending,
        setShopOrderShipping.pending,
        getShopAuditLogs.pending
      ),
      (state, _) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getAdminProducts.rejected,
        createProduct.rejected,
        updateProduct.rejected,
        setProductStatus.rejected,
        deleteProduct.rejected,
        createVariant.rejected,
        updateVariant.rejected,
        deleteVariant.rejected,
        adjustVariantStock.rejected,
        getAdminShopOrders.rejected,
        confirmShopOrder.rejected,
        rejectShopOrder.rejected,
        refundShopOrder.rejected,
        fulfillShopOrder.rejected,
        setShopOrderShipping.rejected,
        getShopAuditLogs.rejected
      ),
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      }
    );
  },
});

export default shopAdminSlice.reducer;
