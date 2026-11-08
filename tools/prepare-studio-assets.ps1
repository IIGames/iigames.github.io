$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = Split-Path $PSScriptRoot -Parent
$press = Join-Path $root 'assets/press-kit'
New-Item -ItemType Directory -Force $press, "$press/logos", "$press/screenshots", "$press/trailers" | Out-Null
$codec = [Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
function Save-Jpeg($source, $target, $width) {
  $im = [Drawing.Image]::FromFile((Join-Path $root $source))
  $w = [Math]::Min($width, $im.Width); $h = [int]($im.Height*$w/$im.Width)
  $bitmap = New-Object Drawing.Bitmap $w,$h
  $g = [Drawing.Graphics]::FromImage($bitmap)
  $g.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($im,0,0,$w,$h)
  $parameters = New-Object Drawing.Imaging.EncoderParameters 1
  $parameters.Param[0] = New-Object Drawing.Imaging.EncoderParameter ([Drawing.Imaging.Encoder]::Quality),([long]84)
  $bitmap.Save((Join-Path $root $target),$codec,$parameters)
  $parameters.Dispose(); $g.Dispose(); $bitmap.Dispose(); $im.Dispose()
}
$art = @(
  @('2.PNG','neon-platforms'),
  @('Screenshot 2026-11-08 120140.png','city-at-night'),
  @('Screenshot 2026-11-08 120307.png','red-room'),
  @('Screenshot 2026-11-08 120943.png','facility-corridor'),
  @('Screenshot 2026-11-08 120958.png','red-lit-stairwell'),
  @('Screenshot 2026-11-08 121043.png','creature-study'),
  @('Screenshot 2026-11-08 121130.png','light-in-the-dark')
)
foreach ($item in $art) {
  Save-Jpeg "assets/concepts/$($item[0])" "assets/optimized/$($item[1]).jpg" 1600
  Save-Jpeg "assets/concepts/$($item[0])" "assets/optimized/$($item[1])-small.jpg" 640
}
$names = @{
  'II Games Horizontal tp.png'='ii-games-wordmark-white-transparent.png'
  'II Games Horizontal.png'='ii-games-wordmark-white-on-black.png'
  'II Games Vertical.png'='ii-games-stacked-on-gradient.png'
  'II Logo Transparent.png'='ii-games-symbol-white-transparent.png'
  'II Logo.png'='ii-games-symbol-white-on-black.png'
  'II Small.png'='ii-games-symbol-thin-on-black.png'
  'II Transparent Logo TM.png'='ii-games-symbol-trademark-white-transparent.png'
}
foreach ($name in $names.Keys) {
  $source=Join-Path $root "assets/press kit/$name"
  $target=Join-Path $press "logos/$($names[$name])"
  if(Test-Path -LiteralPath $source) { Move-Item -LiteralPath $source -Destination $target }
}
foreach ($kind in @('wordmark','symbol')) {
  $source=Join-Path $press "logos/ii-games-$kind-white-transparent.png"
  $white=New-Object Drawing.Bitmap $source
  $black=New-Object Drawing.Bitmap $white.Width,$white.Height
  for($y=0;$y -lt $white.Height;$y++){for($x=0;$x -lt $white.Width;$x++){
    $c=$white.GetPixel($x,$y)
    $black.SetPixel($x,$y,[Drawing.Color]::FromArgb($c.A,0,0,0))
  }}
  $black.Save((Join-Path $press "logos/ii-games-$kind-black-transparent.png"),[Drawing.Imaging.ImageFormat]::Png)
  $black.Dispose();$white.Dispose()
}
$shots=@{
  'cubegame/1.PNG'='cubegame-01.png'; 'cubegame/2.PNG'='cubegame-02.png'
  'NoMansLand-screen1.png'='no-mans-land-01.png'; 'NoMansLand-screen2.png'='no-mans-land-02.png'
  'SCP173Simulator-screen1.png'='scp-173-simulator-01.png'; 'SCP173Simulator-screen2.png'='scp-173-simulator-02.png'
  'GamePage_SlowlyStrange_Pic_1.PNG'='slowly-strange-01.png'; 'GamePage_SlowlyStrange_Pic_2.PNG'='slowly-strange-02.png'
  'CrystalStealer-screen1.png'='crystal-stealer-01.png'; 'NeonShooterMayhem-screen1.png'='neon-shooter-mayhem-01.png'
  'StationInvasion-screen1.png'='station-invasion-01.png'
  'GamePage_CubeGameAlpha_Pic_1.jpg'='cubegame-alpha-01.jpg'
}
foreach($name in $shots.Keys){Copy-Item -LiteralPath (Join-Path $root "assets/$name") -Destination (Join-Path $press "screenshots/$($shots[$name])")}
Copy-Item -LiteralPath (Join-Path $root 'assets/cubegame/CubeGame Trailer Game Page.mp4') -Destination "$press/trailers/cubegame-trailer.mp4"
Copy-Item -LiteralPath (Join-Path $root 'assets/CubeGameVideo.mp4') -Destination "$press/trailers/cubegame-alpha-trailer.mp4"
Copy-Item -LiteralPath (Join-Path $root 'assets/Slowly Strange - Attack Clip.mp4') -Destination "$press/trailers/slowly-strange-gameplay.mp4"
# A purpose-made 1200 x 630 social card using the studio's own game artwork.
$banner=New-Object Drawing.Bitmap 1200,630
$g=[Drawing.Graphics]::FromImage($banner)
$g.Clear([Drawing.Color]::FromArgb(11,12,18))
$bg=[Drawing.Image]::FromFile((Join-Path $root 'assets/optimized/neon-platforms.jpg'))
$g.DrawImage($bg,0,0,1200,564)
$shade=New-Object Drawing.SolidBrush ([Drawing.Color]::FromArgb(175,11,12,18))
$g.FillRectangle($shade,0,0,1200,630)
$logo=[Drawing.Image]::FromFile((Join-Path $press 'logos/ii-games-symbol-white-transparent.png'))
$g.DrawImage($logo,80,80,105,103)
$title=New-Object Drawing.Font 'Arial',56,([Drawing.FontStyle]::Bold)
$body=New-Object Drawing.Font 'Arial',24
$g.DrawString('II Games Studio',$title,[Drawing.Brushes]::White,72,220)
$g.DrawString('Independent games. Driven by play.',$body,[Drawing.Brushes]::White,80,325)
$g.DrawString('iigames.github.io',$body,[Drawing.Brushes]::White,80,495)
$banner.Save((Join-Path $root 'assets/optimized/ii-games-social.jpg'),$codec,$null)
$g.Dispose();$banner.Dispose();$bg.Dispose();$logo.Dispose();$shade.Dispose();$title.Dispose();$body.Dispose()
& (Join-Path $PSScriptRoot 'prepare-light-logos.ps1')
Compress-Archive -Path "$press/logos", "$press/screenshots", "$press/trailers", "$press/studio-fact-sheet.txt" -DestinationPath "$press/ii-games-studio-press-kit.zip" -Force
Write-Output 'Prepared studio artwork, named logos, original-resolution screenshots, trailers and social banner.'
