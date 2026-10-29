$ErrorActionPreference = "Stop"
$root = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend"
$utf8 = New-Object System.Text.UTF8Encoding $false

Write-Host "=== Part C fix (Home.tsx emoji + router) ===" -ForegroundColor Cyan

# --- Home.tsx emoji fix, using $homeFile (NOT reserved $HOME) ---
$homePath = Join-Path $root "src\pages\Home.tsx"
if (Test-Path -LiteralPath $homePath) {
  $homeFile = [System.IO.File]::ReadAllText($homePath)
  $before = $homeFile
  $replacements = @{
    ('{0}{1}{2}{3}' -f [char]0x00F0,[char]0x0178,[char]0x201C,[char]0x2039) = [char]::ConvertFromUtf32(0x1F4DD)
    ('{0}{1}{2}{3}' -f [char]0x00F0,[char]0x0178,[char]0x201D,[char]0x2014) = [char]::ConvertFromUtf32(0x1F517)
    ('{0}{1}{2}{3}' -f [char]0x00E2,[char]0x0153,[char]0x201A,[char]0x00EF) = [char]::ConvertFromUtf32(0x2702)
    ('{0}{1}{2}{3}' -f [char]0x00F0,[char]0x0178,[char]0x201C,[char]0x2030) = [char]::ConvertFromUtf32(0x1F4C9)
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x201D,[char]0x2019) = [char]::ConvertFromUtf32(0x1F512)
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x201D,[char]0x201C) = [char]::ConvertFromUtf32(0x1F513)
    ('{0}{1}{2}{3}' -f [char]0x00F0,[char]0x0178,[char]0x2013,[char]0x00BC) = [char]::ConvertFromUtf32(0x1F5BC)
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x201C,[char]0x0090) = [char]::ConvertFromUtf32(0x1F4D0)
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x201D,[char]0x201E) = [char]::ConvertFromUtf32(0x1F504)
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x017D,[char]0x00A8) = [char]::ConvertFromUtf32(0x1F3A8)
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x2019,[char]0x00A7) = [char]::ConvertFromUtf32(0x1F4A7)
    ('{0}{1}{2}' -f [char]0x00E2,[char]0x00AD,[char]0x0090) = [char]::ConvertFromUtf32(0x2B50)
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x2018,[char]0x00A4) = [char]::ConvertFromUtf32(0x1F464)
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x2019,[char]0x00BB) = [char]::ConvertFromUtf32(0x1F4BB)
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x02DC,[char]0x201A) = [char]::ConvertFromUtf32(0x1F602)
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x201D,[char]0x008D) = [char]::ConvertFromUtf32(0x1F50D)
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x201D,[char]0x00A4) = [char]::ConvertFromUtf32(0x1F524)
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x201D,[char]0x2018) = [char]::ConvertFromUtf32(0x1F511)
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x201C,[char]0x008F) = [char]::ConvertFromUtf32(0x1F4CF)
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x201C,[char]0x00B7) = [char]::ConvertFromUtf32(0x1F4F7)
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x201C,[char]0x201E) = [char]::ConvertFromUtf32(0x1F4C4)
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x201C,[char]0x0160) = [char]::ConvertFromUtf32(0x1F4CA)
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x201C,[char]0x02C6) = [char]::ConvertFromUtf32(0x1F4C8)
    ('{0}{1}{2}{3}{4}' -f [char]0x00F0,[char]0x0178,[char]0x201C,[char]0x00BD,[char]0x00EF) = [char]::ConvertFromUtf32(0x1F4FD)
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x201C,[char]0x00B1) = [char]::ConvertFromUtf32(0x1F4F1)
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x201C,[char]0x2039) = [char]::ConvertFromUtf32(0x1F4CB)
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x017D,[char]0x00AC) = [char]::ConvertFromUtf32(0x1F3AC)
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x017D,[char]0x201A) = [char]::ConvertFromUtf32(0x1F382)
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x00A7,[char]0x00AE) = [char]::ConvertFromUtf32(0x1F9EE)
  }
  foreach ($k in $replacements.Keys) { $homeFile = $homeFile.Replace($k, $replacements[$k]) }
  if ($homeFile -ne $before) {
    [System.IO.File]::WriteAllText($homePath, $homeFile, $utf8)
    Write-Host "  [~] Home.tsx emoji fixed" -ForegroundColor Yellow
  } else {
    Write-Host "  [=] Home.tsx : no mojibake matched (may already be clean)" -ForegroundColor DarkGray
  }
}

# --- router.tsx ---
$routerPath = Join-Path $root "src\router.tsx"
if (Test-Path -LiteralPath $routerPath) {
  $rt = [System.IO.File]::ReadAllText($routerPath)
  $before = $rt
  if ($rt -notmatch "legal/Disclaimer") {
    $rt = $rt.Replace("import Terms from './pages/legal/Terms'", "import Terms from './pages/legal/Terms'" + "`r`n" + "import Disclaimer from './pages/legal/Disclaimer'" + "`r`n" + "import SitemapPage from './pages/legal/SitemapPage'")
  }
  if ($rt -notmatch "path: 'disclaimer'") {
    $oldLine = "      { path: 'terms', element: <Terms /> },"
    $newLine = $oldLine + "`r`n" + "      { path: 'disclaimer', element: <Disclaimer /> }," + "`r`n" + "      { path: 'sitemap', element: <SitemapPage /> },"
    $rt = $rt.Replace($oldLine, $newLine)
  }
  if ($rt -ne $before) {
    [System.IO.File]::WriteAllText($routerPath, $rt, $utf8)
    Write-Host "  [~] router.tsx routes added" -ForegroundColor Yellow
  } else {
    Write-Host "  [=] router.tsx no change" -ForegroundColor DarkGray
  }
}

Write-Host "=== Part C fix done ===" -ForegroundColor Green