import Cookies from 'js-cookie'

const TokenKey = 'jwt_token'
const UserInfoKey = 'user_info'
const ExpiresInKey = 'Expires_in'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserInfo() {
  return Cookies.get(UserInfoKey)
}

export function setUserInfo(user_info) {
  return Cookies.set(UserInfoKey, user_info)
}

export function getExpiresIn() {
  const timestamp = new Date().getTime() / 1000
  return Cookies.get(ExpiresInKey) * 60 + timestamp
}

export function setExpiresIn(expires_in) {
  return Cookies.set(ExpiresInKey, expires_in)
}
