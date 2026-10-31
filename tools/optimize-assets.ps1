$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$projectRoot = Split-Path $PSScriptRoot -Parent
$outputDir = Join-Path $projectRoot 'assets/optimized'
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
$catalog = Get-Content (Join-Path $projectRoot 'games/catalog.json') -Raw | ConvertFrom-Json
$codec = [Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
function Save-Image($source, $destination, $maxWidth, $jpeg) {
  $image = [Drawing.Image]::FromFile((Join-Path $projectRoot $source))
  try {
    $width = [Math]::Min($maxWidth, $image.Width)
    $height = [Math]::Max(1, [int]($image.Height * $width / $image.Width))
    $bitmap = New-Object Drawing.Bitmap $width, $height
    $graphics = [Drawing.Graphics]::FromImage($bitmap)
    try {
      $graphics.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $graphics.DrawImage($image, 0, 0, $width, $height)
      if ($jpeg) {
        $parameters = New-Object Drawing.Imaging.EncoderParameters 1
        $parameters.Param[0] = New-Object Drawing.Imaging.EncoderParameter ([Drawing.Imaging.Encoder]::Quality), ([long]84)
        try { $bitmap.Save((Join-Path $projectRoot $destination), $codec, $parameters) } finally { $parameters.Dispose() }
      } else { $bitmap.Save((Join-Path $projectRoot $destination), [Drawing.Imaging.ImageFormat]::Png) }
    } finally { $graphics.Dispose(); $bitmap.Dispose() }
  } finally { $image.Dispose() }
}
foreach ($game in $catalog) {
  if ($game.cover -and $game.cover -notlike 'assets/optimized/*') {
    $destination = "assets/optimized/$($game.slug)-cover.jpg"
    Save-Image $game.cover $destination 1440 $true
    Save-Image $game.cover "assets/optimized/$($game.slug)-cover-small.jpg" 640 $true
    $game.cover = $destination
  }
  $shots = @()
  $index = 0
  foreach ($shot in $game.screenshots) {
    $index++
    if ($shot -like 'assets/optimized/*') { $shots += $shot; continue }
    $destination = "assets/optimized/$($game.slug)-shot-$index.jpg"
    Save-Image $shot $destination 1440 $true
    $shots += $destination
  }
  if ($shots.Count) { $game.screenshots = $shots }
}
Save-Image 'assets/logos/II Games Logo Horizontal_FullTransparent.png' 'assets/optimized/ii-games-logo.png' 460 $false
Save-Image 'assets/II Games _ Profile Transparent.png' 'assets/optimized/favicon.png' 32 $false
$catalog | ConvertTo-Json -Depth 30 | Set-Content (Join-Path $projectRoot 'games/catalog.json') -Encoding utf8
Write-Output 'Optimized catalog artwork and logo; original assets preserved.'
