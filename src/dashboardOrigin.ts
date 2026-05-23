/**
 * Origine du dashboard (schéma + host + port), sans chemin ni slash final.
 * Injectée au build via DASHBOARD_ORIGIN (.env / .env.development / .env.production).
 * La session admin (cookie) est envoyée en navigation de premier niveau (GET).
 */
declare const __DASHBOARD_ORIGIN__: string;
export const DASHBOARD_ORIGIN = __DASHBOARD_ORIGIN__;
