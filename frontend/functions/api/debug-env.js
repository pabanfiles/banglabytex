export async function onRequestGet(context) {
  const { env } = context;
  const token = env.MAILTRAP_API_TOKEN || '';
  return new Response(JSON.stringify({
    hasToken: token.length > 0,
    tokenLength: token.length,
    tokenPrefix: token.slice(0, 10),
    tokenSuffix: token.slice(-4),
    hasFrom: !!env.MAILTRAP_FROM_EMAIL,
    from: env.MAILTRAP_FROM_EMAIL,
    allEnvKeys: Object.keys(env).filter((k) => k.startsWith('MAILTRAP')),
  }), { headers: { 'Content-Type': 'application/json' } });
}