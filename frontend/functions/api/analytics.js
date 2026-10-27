export async function onRequestGet(context) {
  const { env } = context;
  try {
    const { results } = await env.DB.prepare("SELECT COUNT(*) as total FROM analytics").all();
    const toolUsage = await env.DB.prepare("SELECT COUNT(*) as total FROM analytics WHERE page_url LIKE '%tool%'").all();
    return new Response(JSON.stringify({ visitors: results[0]?.total || 0, toolUsage: toolUsage[0]?.total || 0 }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    await env.DB.prepare("INSERT INTO analytics (page_url, visitor_ip) VALUES (?, ?)").bind(body.url, 'ip-masked').run();
    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}