export async function onRequestGet(context) {
  const { request } = context;
  const cookie = request.headers.get('Cookie') || '';
  const authed = cookie.includes('admin_session=authenticated');
  return new Response(JSON.stringify({ authed }), { headers: { 'Content-Type': 'application/json' } });
}

export async function onRequestPost(context) {
  // logout
  const headers = new Headers();
  headers.set('Set-Cookie', 'admin_session=; Path=/; Max-Age=0');
  return new Response(JSON.stringify({ success: true }), { headers, status: 200 });
}