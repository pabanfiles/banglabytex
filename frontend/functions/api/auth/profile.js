export async function onRequestGet(context) {
  const { request, env } = context;
  const cookie = request.headers.get('Cookie');
  const email = cookie?.split('; ').find(row => row.startsWith('user_email='))?.split('=')[1];

  if (!email) return new Response(JSON.stringify({ error: 'Not logged in' }), { status: 401 });

  try {
    const user = await env.DB.prepare("SELECT name, email, provider, avatar_url, created_at FROM users WHERE email = ?").bind(email).first();
    if (!user) return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    return new Response(JSON.stringify(user), { status: 200, headers: {'Content-Type': 'application/json'} });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}