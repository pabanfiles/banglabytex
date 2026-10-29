$ErrorActionPreference = "Stop"
$fe = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend"
$utf8 = New-Object System.Text.UTF8Encoding $false

# 1. Rename _lib folder to shared
$oldLib = "$fe\functions\_lib"
$newLib = "$fe\functions\shared"
if (Test-Path $oldLib) {
  if (Test-Path $newLib) { Remove-Item -Recurse -Force $newLib }
  Rename-Item -Path $oldLib -NewName "shared"
  Write-Host "[+] Renamed _lib -> shared" -ForegroundColor Green
}

# 2. Update import paths in all .js files that use ../../_lib or ../_lib
$files = Get-ChildItem -Path "$fe\functions" -Recurse -Filter "*.js"
foreach ($f in $files) {
  $content = [System.IO.File]::ReadAllText($f.FullName)
  $orig = $content
  $content = $content -replace "from '../../_lib/", "from '../../shared/"
  $content = $content -replace "from '../_lib/", "from '../shared/"
  $content = $content -replace "from './_lib/", "from './shared/"
  if ($content -ne $orig) {
    [System.IO.File]::WriteAllText($f.FullName, $content, $utf8)
    Write-Host "  [~] $($f.Name) import fixed" -ForegroundColor Yellow
  }
}

Write-Host "[+] All imports updated" -ForegroundColor Green