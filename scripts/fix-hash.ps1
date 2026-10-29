$ErrorActionPreference = "Stop"
$utf8 = New-Object System.Text.UTF8Encoding $false
$auth = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend\functions\api\auth"

$files = @('register.js', 'login-password.js', 'reset-password.js')
foreach ($name in $files) {
  $p = Join-Path $auth $name
  if (-not (Test-Path $p)) { Write-Host "  [skip] $name missing" -ForegroundColor DarkGray; continue }
  $c = [System.IO.File]::ReadAllText($p)
  $orig = $c
  # Fix return line
  $c = $c.Replace("return 'pbkdf2\\`$' + saltHex + '\`$' + bytesToHex(new Uint8Array(bits));", "return ['pbkdf2', '100000', saltHex, bytesToHex(new Uint8Array(bits))].join('`$');")
  # Fix verify line if present
  $c = $c.Replace("const parts = (stored || '').split('\`$');", "const parts = (stored || '').split('`$');")
  if ($c -ne $orig) {
    [System.IO.File]::WriteAllText($p, $c, $utf8)
    Write-Host "  [+] $name fixed" -ForegroundColor Green
  } else {
    Write-Host "  [=] $name no pattern match - manual fix needed" -ForegroundColor Yellow
  }
}

Write-Host "`n=== Verify ===" -ForegroundColor Cyan
Select-String -Path "$auth\*.js" -Pattern "pbkdf2|split\(" | Select-Object -First 20