export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    // ডেমো পাসওয়ার্ড আপডেট (প্রোডাকশনে bcrypt ব্যবহার করতে হবে)
    if (body.newPassword && body.newPassword.length > 5) {
      return new Response(JSON.stringify({ success: true, message: 'Password updated' }), { status: 200 });
    }
    return new Response(JSON.stringify({ error: 'Password too short' }), { status: 400 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}