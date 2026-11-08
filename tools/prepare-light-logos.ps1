$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$projectRoot = Split-Path $PSScriptRoot -Parent
$pressRoot = Join-Path $projectRoot 'assets/press-kit'
$logoRoot = Join-Path $pressRoot 'logos'
$lightRoot = Join-Path $logoRoot 'light'
New-Item -ItemType Directory -Force -Path $lightRoot | Out-Null

# Extend the existing logo system by changing colors only. Keep each source's
# pixel geometry, resolution, antialiasing and alpha; never redraw the mark.
$invert = New-Object Drawing.Imaging.ColorMatrix
$invert.Matrix00 = -1
$invert.Matrix11 = -1
$invert.Matrix22 = -1
$invert.Matrix40 = 1
$invert.Matrix41 = 1
$invert.Matrix42 = 1
$attributes = New-Object Drawing.Imaging.ImageAttributes
$attributes.SetColorMatrix($invert)
try {
  foreach ($source in Get-ChildItem -LiteralPath $logoRoot -Filter '*.png' -File) {
    $destination = Join-Path $lightRoot ($source.BaseName + '-light.png')
    if ($source.BaseName -like '*-black-transparent') {
      Copy-Item -LiteralPath $source.FullName -Destination $destination -Force
      continue
    }
    $image = [Drawing.Bitmap]::new($source.FullName)
    $result = [Drawing.Bitmap]::new($image.Width, $image.Height, [Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [Drawing.Graphics]::FromImage($result)
    try {
      $graphics.CompositingMode = [Drawing.Drawing2D.CompositingMode]::SourceCopy
      $rectangle = [Drawing.Rectangle]::new(0, 0, $image.Width, $image.Height)
      $graphics.DrawImage($image, $rectangle, 0, 0, $image.Width, $image.Height, [Drawing.GraphicsUnit]::Pixel, $attributes)
      $result.Save($destination, [Drawing.Imaging.ImageFormat]::Png)
    } finally {
      $graphics.Dispose()
      $result.Dispose()
      $image.Dispose()
    }
  }
} finally { $attributes.Dispose() }
Write-Output 'Prepared light-background versions of all press-kit logos in logos/light.'
