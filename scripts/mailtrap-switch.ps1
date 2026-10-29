$ErrorActionPreference = "Stop"
$utf8 = New-Object System.Text.UTF8Encoding $false
$auth = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend\functions\api\auth"

$mailtrapSend = @"
async function sendEmail(env, to, subject, html) {
  const token = env.MAILTRAP_API_TOKEN;
  if (!token) return { ok: false, error: 'MAILTRAP_API_TOKEN is not set. Add it in Cloudflare Pages env vars.' };
  const fromEmail = env.MAILTRAP_FROM_EMAIL || 'hello@demomailtrap.com';
  const fromName = env.MAILTRAP_FROM_NAME || 'PPM Creator';
  const res = await fetch('https://send.api.mailtrap.io/api/send', {
    method: 'POST',
    headers: { 'Api-Token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: { email: fromEmail, name: fromName },
      to: [{ email: to }],
      subject,
      html,
    }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    return { ok: false, error: 'Mailtrap error: ' + res.status + ' ' + t.slice(0, 300) };
  }
  return { ok: true };
}
"@

$files = @('register.js', 'forgot-password.js')
foreach ($name in $files) {
  $p = Join-Path $auth $name
  if (-not (Test-Path $p)) { continue }
  $c = [System.IO.File]::ReadAllText($p)
  $orig = $c
  if ($c -match "async function sendEmail\(env, to, subject, html\) \{[\s\S]*?\n\}") {
    $c = [regex]::Replace($c, "async function sendEmail\(env, to, subject, html\) \{[\s\S]*?\n\}", $mailtrapSend.Trim())
  } else {
    $c = $mailtrapSend + "`r`n" + $c
  }
  if ($c -ne $orig) {
    [System.IO.File]::WriteAllText($p, $c, $utf8)
    Write-Host "  [+] $name -> Mailtrap" -ForegroundColor Green
  }
}
Select-String -Path "$auth\register.js" -Pattern "mailtrap" -SimpleMatch | Select-Object -First 2