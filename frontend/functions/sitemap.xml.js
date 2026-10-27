export async function onRequestGet(context) {
  const { env } = context;
  try {
    const { results } = await env.DB.prepare("SELECT slug, created_at FROM posts WHERE status = 'published'").all();
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://ppmcreator.pages.dev/</loc><priority>1.0</priority></url>
  <url><loc>https://ppmcreator.pages.dev/pdf-tools</loc><priority>0.9</priority></url>
  <url><loc>https://ppmcreator.pages.dev/image-tools</loc><priority>0.9</priority></url>
  <url><loc>https://ppmcreator.pages.dev/word-tools</loc><priority>0.9</priority></url>
  <url><loc>https://ppmcreator.pages.dev/blog</loc><priority>0.8</priority></url>`;
    results.forEach(post => {
      sitemap += `\n  <url><loc>https://ppmcreator.pages.dev/blog/${post.slug}</loc><lastmod>${new Date(post.created_at).toISOString().split('T')[0]}</lastmod><priority>0.7</priority></url>`;
    });
    sitemap += '\n</urlset>';
    return new Response(sitemap, {
      headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=3600' }
    });
  } catch (err) {
    return new Response('Error generating sitemap', { status: 500 });
  }
}