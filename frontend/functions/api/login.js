export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    const { username, password } = body;

    if (username === 'admin' && password === 'Ppm@Demo2026') {
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