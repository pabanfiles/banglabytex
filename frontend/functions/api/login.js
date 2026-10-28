// HMAC-SHA1 এবং Base32 ডিকোডার (TOTP এর জন্য)
async function hmacSha1(key, message) {
  const cryptoKey = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(key),
    { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']
  );
  return await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message));
}

function base32Decode(base32) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = '';
  base32 = base32.toUpperCase().replace(/=+$/, '');
  for (const char of base32) bits += alphabet.indexOf(char).toString(2).padStart(5, '0');
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.substring(i, i + 8), 2));
  return new Uint8Array(bytes);
}

async function verifyTOTP(secret, token) {
  const key = base32Decode(secret);
  const epoch = Math.floor(Date.now() / 1000);
  const counter = Math.floor(epoch / 30);
  for (let i = -1; i <= 1; i++) { // Allow +/- 30 seconds
    const buf = new ArrayBuffer(8);
    new DataView(buf).setBigUint64(0, BigInt(counter + i));
    const hmac = new Uint8Array(await hmacSha1(key, buf));
    const offset = hmac[hmac.length - 1] & 0xf;
    const code = ((hmac[offset] & 0x7f) << 24 | hmac[offset + 1] << 16 | hmac[offset + 2] << 8 | hmac[offset + 3]) % 1000000;
    if (code.toString().padStart(6, '0') === token) return true;
  }
  return false;
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    const { username, password, totpCode } = body;
    
    // ডেমো অ্যাডমিনের জন্য সিক্রেট (প্রোডাকশনে ডাটাবেসে সেভ করবেন)
    const ADMIN_SECRET = 'JBSWY3DPEHPK3PXP'; // Google Authenticator এ এই সিক্রেটটি ব্যবহার করবেন

    if (username === 'hellowsai' && password === 'Ppm@Demo2026') {
      // ২এফএ চেক (যদি ক্লায়েন্ট 2FA রিকোয়েস্ট করে)
      if (totpCode) {
        const isValid = await verifyTOTP(ADMIN_SECRET, totpCode);
        if (!isValid) return new Response(JSON.stringify({ error: 'Invalid 2FA code' }), { status: 401, headers: {'Content-Type': 'application/json'} });
      }
      
      const headers = new Headers();
      headers.set('Set-Cookie', 'admin_session=authenticated; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=7200');
      headers.set('Content-Type', 'application/json');
      return new Response(JSON.stringify({ success: true }), { headers, status: 200 });
    }

    return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401, headers: {'Content-Type': 'application/json'} });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500, headers: {'Content-Type': 'application/json'} });
  }
}