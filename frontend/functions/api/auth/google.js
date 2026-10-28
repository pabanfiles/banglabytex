export async function onRequestGet(context) {
  const { env } = context;
  const client_id = env.GOOGLE_CLIENT_ID;
  const redirect_uri = "https://ppmcreator.pages.dev/api/auth/google/callback";
  const scope = "openid email profile";
  
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}&access_type=offline`;
  
  return Response.redirect(url, 302);
}