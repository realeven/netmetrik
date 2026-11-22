$ErrorActionPreference = "Stop"

# Environment configuration
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-21.0.13.102-hotspot"
$env:Path = "$env:JAVA_HOME\bin;" + $env:Path
$env:ANDROID_HOME = "C:\Users\burak\AppData\Local\Android\Sdk"

$appDir = "c:\Users\burak\.gemini\antigravity-ide\scratch\ekoc-clone\app"
Set-Location $appDir

Write-Host "--> 1. Web projesi derleniyor (npm run build)..." -ForegroundColor Cyan
& npm.cmd run build
if ($LASTEXITCODE -ne 0) { throw "Web build basarisiz oldu!" }

Write-Host "--> 2. Capacitor ile Android klasörüne aktarılıyor (npx cap sync android)..." -ForegroundColor Cyan
& npx.cmd cap sync android
if ($LASTEXITCODE -ne 0) { throw "Capacitor sync basarisiz oldu!" }

Write-Host "--> 3. Android APK derleniyor (gradlew clean assembleDebug)..." -ForegroundColor Cyan
Set-Location "$appDir\android"
& .\gradlew.bat clean assembleDebug
if ($LASTEXITCODE -ne 0) { throw "Gradle APK derlemesi basarisiz oldu!" }

$apkPath = "$appDir\android\app\build\outputs\apk\debug\app-debug.apk"
$namedApkPath = "$appDir\android\app\build\outputs\apk\debug\netmetrikv1.apk"
$namedApkV2 = "$appDir\android\app\build\outputs\apk\debug\netmetrik-v2.apk"
$namedApkV3 = "$appDir\android\app\build\outputs\apk\debug\netmetrik-v3.apk"
$rootNamedApk = "$appDir\netmetrikv1.apk"
$rootNamedApkV2 = "$appDir\netmetrik-v2.apk"
$rootNamedApkV3 = "$appDir\netmetrik-v3.apk"

if (Test-Path $apkPath) {
    Copy-Item -Path $apkPath -Destination $namedApkPath -Force
    Copy-Item -Path $apkPath -Destination $namedApkV2 -Force
    Copy-Item -Path $apkPath -Destination $namedApkV3 -Force
    Copy-Item -Path $apkPath -Destination $rootNamedApk -Force
    Copy-Item -Path $apkPath -Destination $rootNamedApkV2 -Force
    Copy-Item -Path $apkPath -Destination $rootNamedApkV3 -Force
    Write-Host "`n========================================================" -ForegroundColor Green
    Write-Host " [BASARILI] GUNCEL ANDROID APK DERLENDI (v1.3)!" -ForegroundColor Green
    Write-Host " APK Dosya Yolu: $namedApkPath" -ForegroundColor Yellow
    Write-Host " Yeni Surum v3: $namedApkV3" -ForegroundColor Yellow
    Write-Host " Proje Kokundeki APK: $rootNamedApk" -ForegroundColor Yellow
    Write-Host " Proje Kokundeki v3: $rootNamedApkV3" -ForegroundColor Yellow
    Write-Host "========================================================`n" -ForegroundColor Green
    exit 0
} else {
    Write-Error "APK dosyasi olusturulamadi: $apkPath"
    exit 1
}
