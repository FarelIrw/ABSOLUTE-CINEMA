import { secureStoreAdapter } from './secureStoreAdapter';

const DEMO_TOKEN_KEY = 'absolute-cinema.demo-license-token';

/** Saves the sample token used to demonstrate persistent secure storage. */
export function saveDemoToken(token: string) {
  return secureStoreAdapter.setItem(DEMO_TOKEN_KEY, token);
}

/** Reads the saved sample token, or null when no token has been saved. */
export function getDemoToken() {
  return secureStoreAdapter.getItem(DEMO_TOKEN_KEY);
}

/** Removes the sample token from SecureStore. */
export function deleteDemoToken() {
  return secureStoreAdapter.removeItem(DEMO_TOKEN_KEY);
}
