$ErrorActionPreference = "Stop"
$utf8 = New-Object System.Text.UTF8Encoding $false
$auth = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend\functions\api\auth"

$files = Get-ChildItem $auth -File -Filter "*.js"
foreach ($f in $files) {
  $c = [System.IO.File]::ReadAllText($f.FullName)
  $orig = $c
  # Replace /...[^@\s]+\$/ with /...[^@\s]+$/
  $c = $c.Replace("[^@\s]+\$/", "[^@\s]+$/")
  # Fix any other \$ left in regex contexts
  $c = $c.Replace("/\$/", "/$/")
  if ($c -ne $orig) {
    [System.IO.File]::WriteAllText($f.FullName, $c, $utf8)
    Write-Host "  [+] $($f.Name) fixed" -ForegroundColor Green
  } else {
    Write-Host "  [=] $($f.Name) no change" -ForegroundColor DarkGray
  }
}

Write-Host "`n=== Verify ===" -ForegroundColor Cyan
Select-String -Path "$auth\*.js" -Pattern "function validEmail"