$ErrorActionPreference = "Stop"
$filePath = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend\src\pages\tools\ImageCompress\index.tsx"
$utf8 = New-Object System.Text.UTF8Encoding $false
$text = [System.IO.File]::ReadAllText($filePath)
$before = $text
$text = $text.Replace("from '../../components/ToolShell'", "from '../../../components/ToolShell'")
$text = $text.Replace("from '../../components/UploadBox'", "from '../../../components/UploadBox'")
$text = $text.Replace("from '../../components/LiveSizeSlider'", "from '../../../components/LiveSizeSlider'")
$text = $text.Replace("from '../../components/DownloadButton'", "from '../../../components/DownloadButton'")
if ($text -ne $before) {
  [System.IO.File]::WriteAllText($filePath, $text, $utf8)
  Write-Host "  [~] import paths fixed" -ForegroundColor Yellow
} else {
  Write-Host "  [=] no changes" -ForegroundColor DarkGray
}