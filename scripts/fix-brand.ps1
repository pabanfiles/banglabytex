$ErrorActionPreference = "Stop"
$utf8 = New-Object System.Text.UTF8Encoding $false
$fe = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend"
$src = "$fe\src"

$count = 0

# Replace in all src files
$files = Get-ChildItem -Path $src -Recurse -Include *.tsx,*.ts,*.js,*.jsx,*.json,*.css -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notmatch "node_modules" }
foreach ($f in $files) {
  $c = [System.IO.File]::ReadAllText($f.FullName)
  $orig = $c
  $c = $c.Replace("BanglaByteX", "PPM Creator Tools")
  $c = $c.Replace("BanglaBytex", "PPM Creator Tools")
  $c = $c.Replace("Banglabytex", "PPM Creator Tools")
  $c = $c.Replace("banglabytex", "ppmcreator")
  $c = $c.Replace("Bangla Byte X", "PPM Creator Tools")
  $c = $c.Replace("BanglaByte", "PPM Creator Tools")
  if ($c -ne $orig) {
    [System.IO.File]::WriteAllText($f.FullName, $c, $utf8)
    Write-Host "  [+] $($f.FullName.Replace($src, ''))" -ForegroundColor Green
    $count++
  }
}

# Fix public + index.html
$publicFiles = @("$fe\index.html", "$fe\public\site.json", "$fe\public\robots.txt", "$fe\public\sitemap.xml", "$fe\public\_routes.json")
foreach ($f in $publicFiles) {
  if (Test-Path $f) {
    $c = [System.IO.File]::ReadAllText($f)
    $orig = $c
    $c = $c.Replace("BanglaByteX", "PPM Creator Tools")
    $c = $c.Replace("BanglaByte", "PPM Creator Tools")
    $c = $c.Replace("banglabytex", "ppmcreator")
    if ($c -ne $orig) {
      [System.IO.File]::WriteAllText($f, $c, $utf8)
      Write-Host "  [+] $($f.Replace($fe, ''))" -ForegroundColor Green
      $count++
    }
  }
}

Write-Host "`n=== Total files updated: $count ===" -ForegroundColor Cyan
Write-Host "`n=== Verify no BanglaByteX remains ===" -ForegroundColor Cyan
$remaining = Get-ChildItem -Path $src -Recurse -Include *.tsx,*.ts,*.js,*.jsx,*.json | Where-Object { $_.FullName -notmatch "node_modules" } | Select-String -Pattern "BanglaByteX|banglabytex|BanglaByte"
if ($remaining) {
  $remaining | Select-Object Path, LineNumber, Line | Format-Table -AutoSize
} else {
  Write-Host "  ✅ Clean - no BanglaByteX references found" -ForegroundColor Green
}