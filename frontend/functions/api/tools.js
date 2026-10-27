export async function onRequestGet(context) {
  const { env } = context;
  try {
    const { results } = await env.DB.prepare("SELECT * FROM tool_pages").all();
    return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestPut(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    await env.DB.prepare(
      "UPDATE tool_pages SET h1_title = ?, meta_desc = ?, intro_text = ?, faq_json = ?, is_active = ? WHERE slug = ?"
    ).bind(body.h1_title, body.meta_desc, body.intro_text, body.faq_json, body.is_active, body.slug).run();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}