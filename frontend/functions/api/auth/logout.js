export async function onRequestPost() {
  const headers = new Headers()
  headers.set('Set-Cookie', 'user_email=; Path=/; Max-Age=0')
  return new Response(JSON.stringify({ success: true }), { headers, status: 200 })
}