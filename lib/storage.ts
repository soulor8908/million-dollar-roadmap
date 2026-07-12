const STORAGE_KEY = "encrypted_token";
const KEY_ALG = "AES-GCM";

async function getKey(): Promise<CryptoKey> {
  const existing = sessionStorage.getItem("token_key");
  if (existing) {
    const raw = Uint8Array.from(atob(existing), (c) => c.charCodeAt(0));
    return crypto.subtle.importKey("raw", raw, KEY_ALG, false, [
      "encrypt",
      "decrypt",
    ]);
  }
  const key = await crypto.subtle.generateKey(
    { name: KEY_ALG, length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const raw = await crypto.subtle.exportKey("raw", key);
  const b64 = btoa(String.fromCharCode(...new Uint8Array(raw)));
  sessionStorage.setItem("token_key", b64);
  return key;
}

export async function saveToken(token: string): Promise<void> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(token);
  const encrypted = await crypto.subtle.encrypt(
    { name: KEY_ALG, iv },
    key,
    encoded
  );
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);
  sessionStorage.setItem(STORAGE_KEY, btoa(String.fromCharCode(...combined)));
}

export async function loadToken(): Promise<string | null> {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    const key = await getKey();
    const combined = Uint8Array.from(atob(stored), (c) => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    const decrypted = await crypto.subtle.decrypt(
      { name: KEY_ALG, iv },
      key,
      ciphertext
    );
    return new TextDecoder().decode(decrypted);
  } catch {
    return null;
  }
}

export function clearToken(): void {
  sessionStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem("token_key");
}
