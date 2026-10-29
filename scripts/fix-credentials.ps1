$ErrorActionPreference = "Stop"
$utf8 = New-Object System.Text.UTF8Encoding $false
$pages = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend\src\pages"
$comp = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend\src\components"

$targets = @(
  "$pages\Profile.tsx",
  "$pages\Login.tsx",
  "$comp\Header.tsx"
)

foreach ($t in $targets) {
  if (-not (Test-Path $t)) { Write-Host "  [skip] $t missing" -ForegroundColor DarkGray; continue }
  $c = [System.IO.File]::ReadAllText($t)
  $orig = $c

  # /api/auth/profile fetch - add credentials if missing
  $c = $c.Replace("fetch('/api/auth/profile').then(", "fetch('/api/auth/profile', { credentials: 'include' }).then(")
  $c = $c.Replace("fetch('/api/auth/profile', { credentials: 'include' }).then((r) => r.ok ? r.json() : null)", "fetch('/api/auth/profile', { credentials: 'include' }).then((r) => r.ok ? r.json() : null)")

  # login-password and other POSTs already have credentials in Login.tsx (add if not)
  $c = $c.Replace("fetch('/api/auth/login-password', { method: 'POST', headers:", "fetch('/api/auth/login-password', { method: 'POST', credentials: 'include', headers:")

  if ($c -ne $orig) {
    [System.IO.File]::WriteAllText($t, $c, $utf8)
    Write-Host "  [+] $([System.IO.Path]::GetFileName($t)) updated" -ForegroundColor Green
  } else {
    Write-Host "  [=] $([System.IO.Path]::GetFileName($t)) no change" -ForegroundColor DarkGray
  }
}

# Also check for double credentials issue
Write-Host "`n=== Verify ===" -ForegroundColor Cyan
Select-String -Path "$pages\Profile.tsx" -Pattern "credentials" | Select-Object -First 3
Select-String -Path "$pages\Login.tsx" -Pattern "credentials" | Select-Object -First 3
Select-String -Path "$comp\Header.tsx" -Pattern "credentials" | Select-Object -First 3