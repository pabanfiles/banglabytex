$ErrorActionPreference = "Stop"
$utf8 = New-Object System.Text.UTF8Encoding $false
$fe = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend"
$wrong = "$fe\functions\functions"
$correct = "$fe\functions"

if (-not (Test-Path $wrong)) {
  Write-Host "No wrong folder found - nothing to move" -ForegroundColor Yellow
  exit
}

# Move api/auth files
$apiFiles = Get-ChildItem "$wrong\api\auth" -File -ErrorAction SilentlyContinue
foreach ($f in $apiFiles) {
  $dest = "$correct\api\auth\$($f.Name)"
  Copy-Item -LiteralPath $f.FullName -Destination $dest -Force
  Write-Host "  [+] moved api/auth/$($f.Name)" -ForegroundColor Green
}

# Move _lib to _shared
New-Item -ItemType Directory -Force -Path "$correct\_shared" | Out-Null
$libFiles = Get-ChildItem "$wrong\_lib" -File -ErrorAction SilentlyContinue
foreach ($f in $libFiles) {
  Copy-Item -LiteralPath $f.FullName -Destination "$correct\_shared\$($f.Name)" -Force
  Write-Host "  [+] moved _shared/$($f.Name)" -ForegroundColor Green
}

# Update imports in the moved files to use ../_shared (auth level) 
$targets = Get-ChildItem "$correct\api\auth" -File -Filter "*.js"
foreach ($f in $targets) {
  $c = [System.IO.File]::ReadAllText($f.FullName)
  $orig = $c
  $c = $c -replace "from '\.\./\.\./shared/", "from '../_shared/"
  $c = $c -replace "from '\.\./shared/", "from '../_shared/"
  $c = $c -replace "from '\.\./\.\./_lib/", "from '../_shared/"
  $c = $c -replace "from '\.\./_lib/", "from '../_shared/"
  if ($c -ne $orig) {
    [System.IO.File]::WriteAllText($f.FullName, $c, $utf8)
    Write-Host "  [~] fixed imports: $($f.Name)" -ForegroundColor Yellow
  }
}

# Remove wrong folder
Remove-Item -Recurse -Force $wrong
Write-Host "[+] Removed double-nested folder" -ForegroundColor Green

# Remove stale shared if exists
$staleShared = "$correct\shared"
if (Test-Path $staleShared) { Remove-Item -Recurse -Force $staleShared; Write-Host "[+] Removed stale shared/" -ForegroundColor Green }

# Verify
Write-Host "`n=== Verify ===" -ForegroundColor Cyan
Get-ChildItem "$correct\api\auth" -File | Select-Object Name | Format-Table -AutoSize
Get-ChildItem "$correct\_shared" -File | Select-Object Name | Format-Table -AutoSize
Write-Host "`n=== register.js first line ===" -ForegroundColor Cyan
Get-Content "$correct\api\auth\register.js" -TotalCount 2