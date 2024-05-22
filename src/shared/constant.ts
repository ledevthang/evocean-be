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
    CREATE_THEME: "/creating",
    LIST_THEME: "/listing",
    BUY_THEME: "/buying",
    BUY_LICENSE: "/license-buying",
    UPLOAD_THEME: "/upload",
    DOWNLOAD: "/download"
  },
  MOONPAY: {
    PREFIX: "moonpay",
    WEBHOOK: "/webhook"
  },
  DASHBOARD: {
    PREFIX: "dashboard",
    GET_OVERVIEW: "/overview",
    GET_PRODUCTS: "/products",
    GET_SALES: "/sales"
  },
  CRYPTO_PRICE: {
    PREFIX: "crypto-price",
    GET_PRICE: "/:token_id"
  }
} as const;
