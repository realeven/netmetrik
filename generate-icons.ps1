Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\burak\.gemini\antigravity-ide\scratch\ekoc-clone\app\public\logo.jpg"
$resDir = "C:\Users\burak\.gemini\antigravity-ide\scratch\ekoc-clone\app\android\app\src\main\res"

if (-not (Test-Path $srcPath)) {
    Write-Error "Logo not found at $srcPath"
    exit 1
}

$source = [System.Drawing.Image]::FromFile($srcPath)

$densities = @(
    @{ Name = "mipmap-mdpi"; Size = 48; FgSize = 108 },
    @{ Name = "mipmap-hdpi"; Size = 72; FgSize = 162 },
    @{ Name = "mipmap-xhdpi"; Size = 96; FgSize = 216 },
    @{ Name = "mipmap-xxhdpi"; Size = 144; FgSize = 324 },
    @{ Name = "mipmap-xxxhdpi"; Size = 192; FgSize = 432 }
)

function Save-ResizedImage($src, $destPath, $w, $h, $isForeground = $false) {
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    if ($isForeground) {
        $pad = [int]($w * 0.16)
        $innerW = $w - ($pad * 2)
        $innerH = $h - ($pad * 2)
        $g.Clear([System.Drawing.Color]::Transparent)
        $g.DrawImage($src, $pad, $pad, $innerW, $innerH)
    } else {
        $g.Clear([System.Drawing.Color]::FromArgb(7, 8, 11))
        $g.DrawImage($src, 0, 0, $w, $h)
    }

    $g.Dispose()
    if (Test-Path $destPath) { Remove-Item $destPath -Force }
    $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Generated: $destPath ($w x $h)"
}

foreach ($d in $densities) {
    $targetDir = Join-Path $resDir $d.Name
    if (-not (Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force | Out-Null }

    Save-ResizedImage $source (Join-Path $targetDir "ic_launcher.png") $d.Size $d.Size $false
    Save-ResizedImage $source (Join-Path $targetDir "ic_launcher_round.png") $d.Size $d.Size $false
    Save-ResizedImage $source (Join-Path $targetDir "ic_launcher_foreground.png") $d.FgSize $d.FgSize $true
}

$source.Dispose()

# Also update values/ic_launcher_background.xml
$bgXmlPath = Join-Path $resDir "values\ic_launcher_background.xml"
$bgXmlContent = '<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#07080B</color>
</resources>'
Set-Content -Path $bgXmlPath -Value $bgXmlContent -Encoding UTF8
Write-Host "Updated $bgXmlPath with #07080B"
