export async function onRequestGet(context) {
  const { env, request } = context;
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (id) {
      const row = await env.DB.prepare('SELECT * FROM posts WHERE id = ?').bind(id).first();
      return new Response(JSON.stringify(row || {}), { headers: { 'Content-Type': 'application/json' } });
    }
    const admin = url.searchParams.get('admin');
    const q = admin
      ? 'SELECT id, title, slug, status, updated_at, thumbnail, meta_title, meta_description, length(content) AS content_len FROM posts ORDER BY updated_at DESC'
      : \"SELECT id, title, slug, excerpt, meta_title, meta_description, content, thumbnail, status, created_at FROM posts WHERE status = 'published' ORDER BY created_at DESC\";
    const { results } = await env.DB.prepare(q).all();
    return new Response(JSON.stringify(results || []), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const b = await request.json();
    if (!b.title || !b.slug) return new Response(JSON.stringify({ error: 'title and slug are required' }), { status: 400 });
    if (b.id) {
      await env.DB.prepare(
        'UPDATE posts SET title=?, slug=?, content=?, excerpt=?, thumbnail=?, meta_title=?, meta_description=?, status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?'
      ).bind(b.title, b.slug, b.content || '', b.excerpt || '', b.thumbnail || '', b.meta_title || '', b.meta_description || '', b.status || 'draft', b.id).run();
    } else {
      await env.DB.prepare(
        'INSERT INTO posts (title, slug, content, excerpt, thumbnail, meta_title, meta_description, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(b.title, b.slug, b.content || '', b.excerpt || '', b.thumbnail || '', b.meta_title || '', b.meta_description || '', b.status || 'draft').run();
    }
    return new Response(JSON.stringify({ success: true }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestDelete(context) {
  const { env, request } = context;
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400 });
    await env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(id).run();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}