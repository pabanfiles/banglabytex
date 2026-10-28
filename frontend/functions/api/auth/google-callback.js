export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  
  if (!code) return new Response('No code provided', { status: 400 });

  try {
    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: "https://ppmcreator.pages.dev/api/auth/google/callback",
        grant_type: 'authorization_code',
      }),
    });
    
    const tokens = await tokenRes.json();
    if (!tokens.access_token) throw new Error('Token exchange failed');

    // Get user info
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const user = await userRes.json();

    // Save to D1 Database
    const existing = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(user.email).first();
    if (!existing) {
      await env.DB.prepare(
        "INSERT INTO users (name, email, provider, provider_id, avatar_url) VALUES (?, ?, ?, ?, ?)"
      ).bind(user.name, user.email, 'google', user.id, user.picture).run();
    }

    // Set secure cookie and redirect to profile
    const headers = new Headers();
    headers.set('Set-Cookie', `user_email=${user.email}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`);
    headers.set('Location', '/profile');
    
    return new Response(null, { status: 302, headers });
  } catch (err) {
    return new Response('Auth failed: ' + err.message, { status: 500 });
  }
}