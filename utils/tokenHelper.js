import * as SecureStore from "expo-secure-store";

async function setToken(token) {
  return await SecureStore.setItemAsync("token", token);
}

async function getToken() {
  return await SecureStore.getItemAsync("token");
}

async function clearToken() {
  return await SecureStore.deleteItemAsync("token");
}

export { getToken, setToken, clearToken };
