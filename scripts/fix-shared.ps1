$ErrorActionPreference = "Stop"
$utf8 = New-Object System.Text.UTF8Encoding $false
$fe = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend"
$oldShared = "$fe\functions\shared"
$oldLib = "$fe\functions\_lib"
$newShared = "$fe\functions\_shared"

# 1. Ensure folder exists - prefer _lib content, else shared content
$source = $null
if (Test-Path $oldLib) { $source = $oldLib }
elseif (Test-Path $oldShared) { $source = $oldShared }

if ($source) {
  Write-Host "Using source folder: $source" -ForegroundColor Yellow
  if (Test-Path $newShared) { Remove-Item -Recurse -Force $newShared }
  New-Item -ItemType Directory -Force -Path $newShared | Out-Null
  Copy-Item "$source\*" $newShared -Recurse -Force
  Write-Host "[+] Copied to functions\_shared" -ForegroundColor Green
}

# 2. Update imports in all API files to use ../_shared (relative to functions/api/)
$apiFiles = Get-ChildItem -Path "$fe\functions\api" -Recurse -Filter "*.js"
foreach ($f in $apiFiles) {
  $content = [System.IO.File]::ReadAllText($f.FullName)
  $orig = $content
  $relDepth = ($f.FullName.Replace("$fe\functions\api\", "") -split '\\').Count - 1
  # auth/register.js => 1 level deep from api/ => ../_shared
  # auth/email/send.js => 2 levels => ../../_shared
  $prefix = ('../' * $relDepth) + '_shared'
  $content = $content -replace "from '\.\./\.\./shared/", "from '${prefix}/"
  $content = $content -replace "from '\.\./shared/", "from '${prefix}/"
  $content = $content -replace "from '\.\./\.\./_lib/", "from '${prefix}/"
  $content = $content -replace "from '\.\./_lib/", "from '${prefix}/"
  if ($content -ne $orig) {
    [System.IO.File]::WriteAllText($f.FullName, $content, $utf8)
    Write-Host "  [~] $($f.FullName.Replace($fe,''))" -ForegroundColor Yellow
  }
}

# 3. Cleanup old folders
if (Test-Path $oldLib) { Remove-Item -Recurse -Force $oldLib; Write-Host "[+] Removed _lib" -ForegroundColor Green }
if (Test-Path $oldShared) { Remove-Item -Recurse -Force $oldShared; Write-Host "[+] Removed shared" -ForegroundColor Green }

# 4. Verify
Write-Host "`n=== Current structure ===" -ForegroundColor Cyan
Get-ChildItem "$fe\functions" -Recurse -Filter "*.js" | Select-Object FullName, Length | Format-Table -AutoSize