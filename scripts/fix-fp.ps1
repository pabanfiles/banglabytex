$ErrorActionPreference = "Stop"
$utf8 = New-Object System.Text.UTF8Encoding $false
$p = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend\functions\api\auth\forgot-password.js"
$c = [System.IO.File]::ReadAllText($p)
$orig = $c
$c = $c.Replace("return 'pbkdf2\\`$' + saltHex + '\`$' + bytesToHex(new Uint8Array(bits));", "return ['pbkdf2', '100000', saltHex, bytesToHex(new Uint8Array(bits))].join('`$');")
$c = $c.Replace("const parts = (stored || '').split('\`$');", "const parts = (stored || '').split('`$');")
if ($c -ne $orig) {
  [System.IO.File]::WriteAllText($p, $c, $utf8)
  Write-Host "[+] forgot-password.js fixed" -ForegroundColor Green
} else {
  Write-Host "[!] no match - manual check needed" -ForegroundColor Yellow
}

# Also check reset-password.js
$rp = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend\functions\api\auth\reset-password.js"
$rc = [System.IO.File]::ReadAllText($rp)
$rorig = $rc
$rc = $rc.Replace("return 'pbkdf2\\`$' + saltHex + '\`$' + bytesToHex(new Uint8Array(bits));", "return ['pbkdf2', '100000', saltHex, bytesToHex(new Uint8Array(bits))].join('`$');")
if ($rc -ne $rorig) {
  [System.IO.File]::WriteAllText($rp, $rc, $utf8)
  Write-Host "[+] reset-password.js fixed" -ForegroundColor Green
}

Write-Host "`n=== Verify ===" -ForegroundColor Cyan
Select-String -Path "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend\functions\api\auth\*.js" -Pattern "pbkdf2.*join|split\('\\" | Select-Object -First 10