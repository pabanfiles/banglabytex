$ErrorActionPreference = "Stop"
$root = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend"
$utf8 = New-Object System.Text.UTF8Encoding $false
function WF($rel, $body) {
  $full = Join-Path $root $rel
  $dir = Split-Path $full -Parent
  if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  [System.IO.File]::WriteAllText($full, $body, $utf8)
  Write-Host "  [+] $rel" -ForegroundColor Green
}
Write-Host "=== Group 1 : Part C ===" -ForegroundColor Cyan

# Disclaimer page
WF "src/pages/legal/Disclaimer.tsx" @"
import Seo from '../../components/Seo'
export default function Disclaimer() {
  return (
    <>
      <Seo title='Disclaimer | PPM Creator' description='How PPM Creator tools work, what they do not guarantee, and how to use them responsibly.' path='/disclaimer' />
      <main style={{ maxWidth: 820, margin: '0 auto', padding: '32px 18px', lineHeight: 1.7 }}>
        <h1>Disclaimer</h1>
        <p>PPM Creator provides free online tools for images, PDFs, text and everyday calculations. The tools are provided as-is. We do not guarantee any specific result, file size or outcome.</p>
        <h2>No guarantee of outcome</h2>
        <p>Compression, conversion and calculation results depend on the input file and your device. Always check important output before using it for a form, submission or publication.</p>
        <h2>Not professional advice</h2>
        <p>Nothing on this site is legal, financial, medical or government advice. For official form sizes, fees or deadlines, always check the official instructions published by the relevant authority.</p>
        <h2>Third-party links</h2>
        <p>Some pages link to external sites. We are not responsible for their content or privacy practices.</p>
        <h2>Contact</h2>
        <p>Questions? Email hello@ppmcreator.com.</p>
      </main>
    </>
  )
}
"@

# Sitemap page
WF "src/pages/legal/SitemapPage.tsx" @"
import { Link } from 'react-router-dom'
import Seo from '../../components/Seo'
const groups = [
  { title: 'Main pages', items: [['Home','/'],['Blog','/blog'],['About','/about'],['Contact','/contact'],['Privacy','/privacy-policy'],['Terms','/terms'],['Disclaimer','/disclaimer']] },
  { title: 'Image tools', items: [['Image Compressor','/image-compress'],['Image Resizer','/image-resize'],['Image Converter','/image-convert'],['Image Cropper','/image-crop'],['Image Rotate','/image-rotate'],['Image to PDF','/image-to-pdf'],['Image to Base64','/image-to-base64'],['Meme Generator','/meme-generator'],['Image to Text','/image-to-text'],['Passport Photo','/passport-photo'],['Image Color Picker','/image-color-picker'],['Image Watermark','/image-watermark'],['Favicon Generator','/favicon-generator'],['Background Remover','/bg-remover']] },
  { title: 'PDF tools', items: [['Merge PDF','/pdf-merge'],['Split PDF','/pdf-split'],['Compress PDF','/pdf-compress'],['Protect PDF','/pdf-protect'],['Unlock PDF','/pdf-unlock'],['PDF to Word','/pdf-to-word'],['PDF to Excel','/pdf-to-excel'],['PDF to PPT','/pdf-to-ppt'],['PDF to CSV','/pdf-to-csv'],['PDF to HTML','/pdf-to-html']] },
  { title: 'Converters', items: [['Word to PDF','/word-to-pdf'],['Word to Excel','/word-to-excel'],['Word to PPT','/word-to-ppt'],['Word to HTML','/word-to-html'],['Excel to PDF','/excel-to-pdf'],['Excel to Word','/excel-to-word'],['Excel to CSV','/excel-to-csv'],['PPT to PDF','/ppt-to-pdf'],['CSV to PDF','/csv-to-pdf'],['CSV to JSON','/csv-to-json'],['Office to PDF','/office-to-pdf'],['HTML to Text','/html-to-text']] },
  { title: 'Calculators & text', items: [['Age Calculator','/age-calculator'],['Percentage Calculator','/percentage-calc'],['Unit Converter','/unit-converter'],['Word Counter','/word-counter'],['Text Case Converter','/text-case-converter'],['Password Generator','/password-generator'],['QR Code Generator','/qr-code-gen'],['CV Maker','/cv-maker'],['EXIF Viewer','/exif-viewer']] }
]
export default function SitemapPage() {
  return (
    <>
      <Seo title='Sitemap | PPM Creator' description='Browse every page and tool on PPM Creator.' path='/sitemap' />
      <main style={{ maxWidth: 820, margin: '0 auto', padding: '32px 18px' }}>
        <h1>Sitemap</h1>
        {groups.map((g) => (
          <section key={g.title} style={{ marginTop: 24 }}>
            <h2>{g.title}</h2>
            <ul style={{ paddingLeft: 22 }}>
              {g.items.map((it) => <li key={it[1]}><Link to={it[1]} style={{ color: '#1c1917' }}>{it[0]}</Link></li>)}
            </ul>
          </section>
        ))}
      </main>
    </>
  )
}
"@

# Fix site.json url
Write-Host "`n--- Fixing existing files ---" -ForegroundColor Cyan
$existing = Join-Path $root "src\data\site.json"
if (Test-Path -LiteralPath $existing) {
  $raw = [System.IO.File]::ReadAllText($existing)
  $raw2 = $raw.Replace('"url": "https://ppmcreator.com"', '"url": "https://ppmcreator.pages.dev"')
  if ($raw2 -ne $raw) {
    [System.IO.File]::WriteAllText($existing, $raw2, $utf8)
    Write-Host "  [~] src/data/site.json url fixed" -ForegroundColor Yellow
  } else { Write-Host "  [=] src/data/site.json no change" -ForegroundColor DarkGray }
}

# Home.tsx emoji fix - safe character replacement, no regex
$homePath = Join-Path $root "src\pages\Home.tsx"
if (Test-Path -LiteralPath $homePath) {
  $home = [System.IO.File]::ReadAllText($homePath)
  $before = $home
  # Replace the mojibake byte sequences with real emoji, using char codes to avoid any encoding issues in this script
  $map = @(
    @(0x00F0,0x0178,0x201C,0x201D, 0x1F4DD),  # not reliable -- skip, use string map instead
    @()
  )
  # Direct UTF-8 safe replacement table (mojibake string -> real emoji string)
  $pairs = [ordered]@{}
  $pairs['\u00f0\u0178\u201c\u2039'] = [char]0x1F4CB  # clipboard-ish
  # Simpler approach: replace known bad sequences via [char] codes
  $replacements = @{
    ('{0}{1}{2}{3}' -f [char]0x00F0,[char]0x0178,[char]0x201C,[char]0x2039) = [char]::ConvertFromUtf32(0x1F4DD)  # memo
    ('{0}{1}{2}{3}' -f [char]0x00F0,[char]0x0178,[char]0x201D,[char]0x2014) = [char]::ConvertFromUtf32(0x1F517)  # link
    ('{0}{1}{2}{3}' -f [char]0x00E2,[char]0x0153,[char]0x201A,[char]0x00EF) = [char]::ConvertFromUtf32(0x2702)   # scissors
    ('{0}{1}{2}{3}' -f [char]0x00F0,[char]0x0178,[char]0x201C,[char]0x2030) = [char]::ConvertFromUtf32(0x1F4C9)  # chart down
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x201D,[char]0x2019) = [char]::ConvertFromUtf32(0x1F512)     # lock
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x201D,[char]0x201C) = [char]::ConvertFromUtf32(0x1F513)     # unlock
    ('{0}{1}{2}{3}' -f [char]0x00F0,[char]0x0178,[char]0x2013,[char]0x00BC) = [char]::ConvertFromUtf32(0x1F5BC)  # picture
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x201C,[char]0x0090) = [char]::ConvertFromUtf32(0x1F4D0)     # triangle ruler
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x201D,[char]0x201E) = [char]::ConvertFromUtf32(0x1F504)     # refresh
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x017D,[char]0x00A8) = [char]::ConvertFromUtf32(0x1F3A8)     # palette
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x2019,[char]0x00A7) = [char]::ConvertFromUtf32(0x1F4A7)     # droplet
    ('{0}{1}{2}' -f [char]0x00E2,[char]0x00AD,[char]0x0090) = [char]::ConvertFromUtf32(0x2B50)                   # star
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x2018,[char]0x00A4) = [char]::ConvertFromUtf32(0x1F464)     # bust
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x2019,[char]0x00BB) = [char]::ConvertFromUtf32(0x1F4BB)     # laptop
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x02DC,[char]0x201A) = [char]::ConvertFromUtf32(0x1F602)     # joy
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x201D,[char]0x008D) = [char]::ConvertFromUtf32(0x1F50D)     # magnify
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x201D,[char]0x00A4) = [char]::ConvertFromUtf32(0x1F524)     # abc
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x201D,[char]0x2018) = [char]::ConvertFromUtf32(0x1F511)     # key
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x201C,[char]0x008F) = [char]::ConvertFromUtf32(0x1F4CF)     # ruler
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x201C,[char]0x00B7) = [char]::ConvertFromUtf32(0x1F4F7)     # camera
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x201C,[char]0x201E) = [char]::ConvertFromUtf32(0x1F4C4)     # page
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x201C,[char]0x0160) = [char]::ConvertFromUtf32(0x1F4CA)     # bar chart
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x201C,[char]0x02C6) = [char]::ConvertFromUtf32(0x1F4C8)     # chart up
    ('{0}{1}{2}{3}{4}' -f [char]0x00F0,[char]0x0178,[char]0x201C,[char]0x00BD,[char]0x00EF) = [char]::ConvertFromUtf32(0x1F4FD)  # film
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x201C,[char]0x00B1) = [char]::ConvertFromUtf32(0x1F4F1)     # phone
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x201C,[char]0x2039) = [char]::ConvertFromUtf32(0x1F4CB)     # clipboard
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x017D,[char]0x00AC) = [char]::ConvertFromUtf32(0x1F3AC)     # clapper
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x017D,[char]0x201A) = [char]::ConvertFromUtf32(0x1F382)     # cake
    ('{0}{1}{2}' -f [char]0x00F0,[char]0x0178,[char]0x00A7,[char]0x00AE) = [char]::ConvertFromUtf32(0x1F9EE)     # abacus
  }
  foreach ($k in $replacements.Keys) { $home = $home.Replace($k, $replacements[$k]) }
  if ($home -ne $before) {
    [System.IO.File]::WriteAllText($homePath, $home, $utf8)
    Write-Host "  [~] src/pages/Home.tsx emoji fixed" -ForegroundColor Yellow
  } else { Write-Host "  [=] src/pages/Home.tsx no mojibake matched (file may already be clean)" -ForegroundColor DarkGray }
}

# router.tsx - simple line insertion, no regex with < >
$routerPath = Join-Path $root "src\router.tsx"
if (Test-Path -LiteralPath $routerPath) {
  $rt = [System.IO.File]::ReadAllText($routerPath)
  $before = $rt
  if ($rt -notmatch "Disclaimer") {
    $rt = $rt.Replace("import Terms from './pages/legal/Terms'", "import Terms from './pages/legal/Terms'" + "`r`n" + "import Disclaimer from './pages/legal/Disclaimer'" + "`r`n" + "import SitemapPage from './pages/legal/SitemapPage'")
  }
  if ($rt -notmatch "path: 'disclaimer'") {
    $oldLine = "      { path: 'terms', element: <Terms /> },"
    $newLine = $oldLine + "`r`n" + "      { path: 'disclaimer', element: <Disclaimer /> }," + "`r`n" + "      { path: 'sitemap', element: <SitemapPage /> },"
    $rt = $rt.Replace($oldLine, $newLine)
  }
  if ($rt -ne $before) {
    [System.IO.File]::WriteAllText($routerPath, $rt, $utf8)
    Write-Host "  [~] src/router.tsx routes added" -ForegroundColor Yellow
  } else { Write-Host "  [=] src/router.tsx routes already present" -ForegroundColor DarkGray }
}

Write-Host "  Done part C" -ForegroundColor Green