export const ENDPOINT = {
  AUTH: {
    PREFIX: "auth",
    SIGN_IN_GOOGLE: "/sign-in-google",
    SIGN_IN: "/sign-in"
  },
  USER: {
    PREFIX: "users",
    ME: "/me"
  },
  THEME: {
    PREFIX: "themes",
    GET_THEMES: "/",
    GET_THEME: "/:theme_id",
    GET_ALL_THEME: "/all",
    GET_PURCHASED_THEME: "/purchased",
    CREATE_THEME: "/creating",
    LIST_THEME: "/listing",
    BUY_THEME: "/buying",
    UPDATE_THEME: "/updating/:theme_id",
    DELETE_THEME: "/deleting/:theme_id",
    GET_CATEGORY: "/categories",
    GET_ALL_TAGS: "/tags",
    BUY_LICENSE: "/license-buying",
    UPLOAD_THEME: "/upload-theme",
    UPLOAD_THEME_DETAIL: "/upload",
    DOWNLOAD: "/download",
    PAYMENT: "/payment",
    CREATE_THEME_COLLECTION: "/collections",
    GET_ALL_COLLECTION: "/collections",
    GET_A_THEME_COLLECTION: "/collections/:collection_id",
    UPDATE_A_THEME_COLLECTION: "/collections/:collection_id",
    DELETE_A_THEME_COLLECTION: "/collections/:collection_id"
  },
  MOONPAY: {
    PREFIX: "moonpay",
    WEBHOOK: "/webhook"
  },
  DASHBOARD: {
    PREFIX: "dashboard",
    GET_OVERVIEW: "/overview",
    GET_PRODUCTS: "/products",
    GET_SALES: "/sales",
    GET_PAYOUT: "/payout"
  },
  CRYPTO_PRICE: {
    PREFIX: "crypto-price",
    GET_PRICE: "/:token_id"
  }
} as const;
