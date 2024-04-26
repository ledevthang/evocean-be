export const ENDPOINT = {
  THEME: {
    PREFIX: "themes",
    GET_THEMES: "/",
    GET_THEME: "/:theme_id",
    LIST_THEME: "/listing",
    BUY_THEME: "/buying",
    BUY_LICENSE: "/license-buying",
    UPLOAD_THEME: "/upload"
  }
} as const;
