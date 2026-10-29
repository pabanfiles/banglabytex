$ErrorActionPreference = "Stop"
$utf8 = New-Object System.Text.UTF8Encoding $false
$pages = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend\src\pages"
$comp = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend\src\components"

$files = @("$pages\Profile.tsx", "$pages\Login.tsx", "$comp\Header.tsx")
foreach ($f in $files) {
  if (-not (Test-Path $f)) { continue }
  $c = [System.IO.File]::ReadAllText($f)
  $orig = $c

  # Remove any duplicate credentials
  $c = $c -replace "credentials:\s*'include',\s*credentials:\s*'include',", "credentials: 'include',"
  $c = $c -replace "credentials:\s*'include',\s*credentials:\s*'include'", "credentials: 'include'"

  # Fix bare fetch('/api/auth/profile') with no credentials
  $c = $c.Replace("fetch('/api/auth/profile').then", "fetch('/api/auth/profile', { credentials: 'include' }).then")
  $c = $c.Replace('fetch("/api/auth/profile").then', 'fetch("/api/auth/profile", { credentials: "include" }).then')

  # Fix fetch('/api/auth/profile').catch if exists
  $c = $c.Replace("fetch('/api/auth/profile').catch", "fetch('/api/auth/profile', { credentials: 'include' }).catch")

  # Add credentials to any /api/auth/ POST that lacks it
  # Pattern: fetch('/api/auth/...', { method: 'POST', headers:
  $pattern = "fetch\('(/api/auth/[^']+)',\s*\{\s*method:\s*'POST',\s*headers:"
  $c = [regex]::Replace($c, $pattern, { param($m) "fetch('$($m.Groups[1].Value)', { method: 'POST', credentials: 'include', headers:" })

  if ($c -ne $orig) {
    [System.IO.File]::WriteAllText($f, $c, $utf8)
    Write-Host "  [+] $([System.IO.Path]::GetFileName($f)) updated" -ForegroundColor Green
  } else {
    Write-Host "  [=] $([System.IO.Path]::GetFileName($f)) no change" -ForegroundColor DarkGray
  }
}

Write-Host "`n=== Verify ===" -ForegroundColor Cyan
Select-String -Path $files -Pattern "api/auth/profile" -Context 0,1