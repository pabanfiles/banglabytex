export async function onRequestGet(context) {
  const { env } = context;
  try {
    const { results } = await env.DB.prepare("SELECT * FROM posts WHERE status = 'published' ORDER BY created_at DESC").all();
    return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    const { title, slug, content, excerpt, meta_title, meta_description, status } = body;

    const stmt = env.DB.prepare(
      "INSERT INTO posts (title, slug, content, excerpt, meta_title, meta_description, status) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind(title, slug, content, excerpt, meta_title, meta_description, status || 'published');

    await stmt.run();
    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}