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
    GET_PURCHASED_THEME: "/purchased",
    CREATE_THEME: "/creating",
    CREATE_THEME_COLLECTION: "/create-collection",
    LIST_THEME: "/listing",
    BUY_THEME: "/buying",
    BUY_LICENSE: "/license-buying",
    UPLOAD_THEME: "/upload",
    DOWNLOAD: "/download",
    PAYMENT: "/payment"
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
