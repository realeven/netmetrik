$ErrorActionPreference = "Continue"

# Environment configuration
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-21.0.13.102-hotspot"
$env:Path = "$env:JAVA_HOME\bin;" + $env:Path
$env:ANDROID_HOME = "C:\Users\burak\AppData\Local\Android\Sdk"

$appDir = "c:\Users\burak\.gemini\antigravity-ide\scratch\ekoc-clone\app"
Set-Location $appDir

Write-Host "--> 1. Web projesi derleniyor (npm run build)..." -ForegroundColor Cyan
& npm.cmd run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Web derlemesi basarisiz oldu!"
    exit 1
}

Write-Host "--> 2. Capacitor ile Android klasörüne aktarılıyor (npx cap sync android)..." -ForegroundColor Cyan
& npx.cmd cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Error "Capacitor senkronizasyonu basarisiz oldu!"
    exit 1
}

Write-Host "--> 3. Android APK derleniyor (gradlew assembleDebug)..." -ForegroundColor Cyan
Set-Location "$appDir\android"
& .\gradlew.bat assembleDebug
if ($LASTEXITCODE -ne 0) {
    Write-Error "Gradle APK derlemesi basarisiz oldu!"
    exit 1
}

$apkPath = "$appDir\android\app\build\outputs\apk\debug\app-debug.apk"
$namedApkPath = "$appDir\android\app\build\outputs\apk\debug\netmetrikv1.apk"
$rootNamedApk = "$appDir\netmetrikv1.apk"

if (Test-Path $apkPath) {
    Copy-Item -Path $apkPath -Destination $namedApkPath -Force
    Copy-Item -Path $apkPath -Destination $rootNamedApk -Force
    Write-Host "`n========================================================" -ForegroundColor Green
    Write-Host " [BASARILI] GUNCEL ANDROID APK DERLENDI!" -ForegroundColor Green
    Write-Host " APK Dosya Yolu: $namedApkPath" -ForegroundColor Yellow
    Write-Host " Proje Kokundeki APK: $rootNamedApk" -ForegroundColor Yellow
    Write-Host "========================================================`n" -ForegroundColor Green
    exit 0
} else {
    Write-Error "APK dosyasi olusturulamadi: $apkPath"
    exit 1
}
