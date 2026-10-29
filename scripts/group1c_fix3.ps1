$ErrorActionPreference = "Stop"
$root = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend"
$utf8 = New-Object System.Text.UTF8Encoding $false

Write-Host "=== Home.tsx emoji fix v3 (byte-level) ===" -ForegroundColor Cyan

$homePath = Join-Path $root "src\pages\Home.tsx"

# Step 1: read as UTF-8 (no BOM) explicitly so PowerShell does not misdecode
$reader = New-Object System.IO.StreamReader($homePath, $utf8, $true)
$homeFile = $reader.ReadToEnd()
$reader.Close()

$before = $homeFile
Write-Host ("  original length: " + $homeFile.Length)

# Show the first 300 chars around ALL_TOOLS so we can see what the icons really are
$idx = $homeFile.IndexOf("ALL_TOOLS")
if ($idx -ge 0) {
  $snippet = $homeFile.Substring($idx, [Math]::Min(400, $homeFile.Length - $idx))
  Write-Host "  sample: $snippet"
}

# Step 2: byte-level replacement using UTF-8 bytes for both sides
# The mojibake was written as UTF-8 bytes of the UTF-8 bytes of emoji.
# We rebuild each pair's OLD bytes by encoding a marker string, and NEW bytes by encoding the emoji.
function Repl($text, $oldStr, $newStr) {
  if ($text.Contains($oldStr)) { return $text.Replace($oldStr, $newStr) }
  return $text
}

# Try direct real-emoji replacements by matching what actually appears
# Common CP437/CP1252 misreads of UTF-8 emoji bytes:
# U+00F0 U+0178 U+201C ... etc. We will detect via byte signature.

# Build a byte array from the file, then replace byte patterns.
$bytes = [System.IO.File]::ReadAllBytes($homePath)

# Each entry: 8-byte UTF-8 sequence from the mojibake  ->  UTF-8 bytes of real emoji
# This is fragile; safer approach: use .NET Regex on the decoded string.
# Decode file as UTF-8 string (correct):
$text = [System.Text.Encoding]::UTF8.GetString($bytes)
Write-Host ("  decoded length: " + $text.Length)
Write-Host ("  contains U+00F0? " + $text.Contains([char]0x00F0))
Write-Host ("  contains U+201C? " + $text.Contains([char]0x201C))

# Detect actual code points after ALL_TOOLS
if ($idx -ge 0) {
  $sample = $text.Substring($idx, [Math]::Min(200, $text.Length - $idx))
  $codes = @()
  foreach ($ch in $sample.ToCharArray()) {
    $code = [int][char]$ch
    if ($code -gt 127) { $codes += ("U+{0:X4}" -f $code) }
  }
  Write-Host ("  non-ASCII codes after ALL_TOOLS: " + ($codes -join " "))
}

# If we do not see expected U+00F0/U+201C, the file may already be clean or in a different mojibake form.
# Report honestly instead of guessing.
if (-not $text.Contains([char]0x00F0)) {
  Write-Host "  No U+00F0 found. Emoji may already be correct or in a different form." -ForegroundColor Yellow
  Write-Host "  Skipping Home.tsx edit. Open the file to verify." -ForegroundColor Yellow
} else {
  # Build map: for each emoji we want, we know the mojibake sequence is:
  # mojibake = the emoji's UTF-8 bytes interpreted as CP1252 then re-saved as UTF-8.
  # Since we already have the file decoded as UTF-8, each mojibake CHAR corresponds to one CP1252 char.
  # We map the mojibake STRING to the real emoji STRING.
  $map = @(
    ,@([char]0x00F0 + [char]0x0178 + [char]0x201C + [char]0x2039, [char]::ConvertFromUtf32(0x1F4DD))
    ,@([char]0x00F0 + [char]0x0178 + [char]0x201D + [char]0x2014, [char]::ConvertFromUtf32(0x1F517))
    ,@([char]0x00E2 + [char]0x0153 + [char]0x201A + [char]0x00EF + [char]0x00B8 + [char]0x008F, [char]::ConvertFromUtf32(0x2702))
    ,@([char]0x00F0 + [char]0x0178 + [char]0x201C + [char]0x2030, [char]::ConvertFromUtf32(0x1F4C9))
    ,@([char]0x00F0 + [char]0x0178 + [char]0x201D + [char]0x2019, [char]::ConvertFromUtf32(0x1F512))
    ,@([char]0x00F0 + [char]0x0178 + [char]0x201D + [char]0x201C, [char]::ConvertFromUtf32(0x1F513))
    ,@([char]0x00F0 + [char]0x0178 + [char]0x2013 + [char]0x00BC + [char]0x00EF + [char]0x00B8 + [char]0x008F, [char]::ConvertFromUtf32(0x1F5BC))
    ,@([char]0x00F0 + [char]0x0178 + [char]0x201C + [char]0x0090, [char]::ConvertFromUtf32(0x1F4D0))
    ,@([char]0x00F0 + [char]0x0178 + [char]0x201D + [char]0x201E, [char]::ConvertFromUtf32(0x1F504))
    ,@([char]0x00F0 + [char]0x0178 + [char]0x017D + [char]0x00A8, [char]::ConvertFromUtf32(0x1F3A8))
    ,@([char]0x00F0 + [char]0x0178 + [char]0x2019 + [char]0x00A7, [char]::ConvertFromUtf32(0x1F4A7))
    ,@([char]0x00E2 + [char]0x00AD + [char]0x0090 + [char]0x00A0, [char]::ConvertFromUtf32(0x2B50))
    ,@([char]0x00F0 + [char]0x0178 + [char]0x2018 + [char]0x00A4, [char]::ConvertFromUtf32(0x1F464))
    ,@([char]0x00F0 + [char]0x0178 + [char]0x2019 + [char]0x00BB, [char]::ConvertFromUtf32(0x1F4BB))
    ,@([char]0x00F0 + [char]0x0178 + [char]0x02DC + [char]0x201A, [char]::ConvertFromUtf32(0x1F602))
    ,@([char]0x00F0 + [char]0x0178 + [char]0x201D + [char]0x008D, [char]::ConvertFromUtf32(0x1F50D))
    ,@([char]0x00F0 + [char]0x0178 + [char]0x201D + [char]0x00A4, [char]::ConvertFromUtf32(0x1F524))
    ,@([char]0x00F0 + [char]0x0178 + [char]0x201C + [char]0x008F, [char]::ConvertFromUtf32(0x1F4CF))
    ,@([char]0x00F0 + [char]0x0178 + [char]0x201C + [char]0x00B7, [char]::ConvertFromUtf32(0x1F4F7))
    ,@([char]0x00F0 + [char]0x0178 + [char]0x201C + [char]0x0160, [char]::ConvertFromUtf32(0x1F4CA))
    ,@([char]0x00F0 + [char]0x0178 + [char]0x201C + [char]0x02C6, [char]::ConvertFromUtf32(0x1F4C8))
    ,@([char]0x00F0 + [char]0x0178 + [char]0x201C + [char]0x00B1, [char]::ConvertFromUtf32(0x1F4F1))
    ,@([char]0x00F0 + [char]0x0178 + [char]0x201C + [char]0x00BD + [char]0x00EF + [char]0x00B8 + [char]0x008F, [char]::ConvertFromUtf32(0x1F4FD))
    ,@([char]0x00F0 + [char]0x0178 + [char]0x017D + [char]0x00AC, [char]::ConvertFromUtf32(0x1F3AC))
    ,@([char]0x00F0 + [char]0x0178 + [char]0x017D + [char]0x201A, [char]::ConvertFromUtf32(0x1F382))
    ,@([char]0x00F0 + [char]0x0178 + [char]0x00A7 + [char]0x00AE, [char]::ConvertFromUtf32(0x1F9EE))
  )
  $count = 0
  foreach ($p in $map) {
    if ($text.Contains($p[0])) { $text = $text.Replace($p[0], $p[1]); $count++ }
  }
  if ($text -ne $before -and $text -ne [System.Text.Encoding]::UTF8.GetString($bytes)) {
    [System.IO.File]::WriteAllText($homePath, $text, $utf8)
    Write-Host "  [~] Home.tsx edited, $count patterns replaced" -ForegroundColor Yellow
  } else {
    Write-Host "  [=] No patterns matched; file left unchanged" -ForegroundColor DarkGray
  }
}

Write-Host "=== done ===" -ForegroundColor Green