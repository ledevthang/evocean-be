import { readConfigOrDie } from "@root/helpers/read-config";

export const JWT_ACCESS_SECRET = readConfigOrDie("JWT_ACCESS_SECRET");

export const JWT_RENEW_SECRET = readConfigOrDie("JWT_RENEW_SECRET");

export const SECRET_KEY_MOONPAY = readConfigOrDie("SECRET_KEY_MOONPAY");

export const COINGEKO_API_KEY = readConfigOrDie("COINGEKO_API_KEY");

export const COINGEKO_URL = readConfigOrDie("COINGEKO_URL");
