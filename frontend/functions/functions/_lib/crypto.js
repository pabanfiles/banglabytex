export function bytesToHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}
export async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return bytesToHex(new Uint8Array(buf));
}
export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = bytesToHex(salt);
  const keyMaterial = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, keyMaterial, 256);
  return 'pbkdf2\\$' + saltHex + '\$' + bytesToHex(new Uint8Array(bits));
}
export async function verifyPassword(password, stored) {
  const parts = (stored || '').split('\$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;
  const salt = new Uint8Array(parts[2].match(/.{2}/g).map((h) => parseInt(h, 16)));
  const keyMaterial = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: parseInt(parts[1]), hash: 'SHA-256' }, keyMaterial, 256);
  return bytesToHex(new Uint8Array(bits)) === parts[3];
}
export function randomToken(len = 32) {
  const arr = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(arr).map((b) => b.toString(16).padStart(2, '0')).join('');
}
export function validEmail(e) { return /^[^@\s]+@[^@\s]+\.[^@\s]+\$/.test(e || ''); }