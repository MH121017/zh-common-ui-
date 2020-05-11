const Cookies = window.Cookies;
const TokenKey = "Admin-Token";

export function getToken() {
  return Cookies.get(TokenKey);
}
export function getValue(key) {
  return Cookies.get(key);
}

export function setValue(key, value) {
  Cookies.set(key, value)
}