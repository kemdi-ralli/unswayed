import Cookies from "js-cookie";

export const getCookieConsent = () => {
  return Cookies.get("cookieConsent");
}

export const setCookieConsent = (value) => {
  Cookies.set("cookieConsent", value, { expires: 365 });
}

export const clearCookieConsent = () => {
  Cookies.remove("cookieConsent");
}