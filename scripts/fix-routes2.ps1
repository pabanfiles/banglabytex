$fe = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend"
$utf8 = New-Object System.Text.UTF8Encoding $false
$routes = '{"version":1,"include":["/api/*","/sitemap.xml"],"exclude":[]}'
[System.IO.File]::WriteAllText("$fe\public\_routes.json", $routes, $utf8)
Write-Host "[+] _routes.json written" -ForegroundColor Green