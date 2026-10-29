export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const b = await request.json();
    if (!b.data_url || !b.data_url.startsWith('data:image/')) {
      return new Response(JSON.stringify({ error: 'data_url must be a data:image URL' }), { status: 400 });
    }
    if (b.data_url.length > 3 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'Image too large (max 2 MB after base64)' }), { status: 413 });
    }
    // Store as a post_images row, keyed by random id
    const id = crypto.randomUUID();
    await env.DB.prepare(
      'CREATE TABLE IF NOT EXISTS post_images (id TEXT PRIMARY KEY, data_url TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)'
    ).run();
    await env.DB.prepare('INSERT INTO post_images (id, data_url) VALUES (?, ?)').bind(id, b.data_url).run();
    return new Response(JSON.stringify({ url: b.data_url, id }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}