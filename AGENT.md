# NetMetrik AI Agent Instructions & Rules

## 🤖 APK Güncelleme Kuralı (Kritik & Zorunlu)
Kullanıcı sohbet içinde ne zaman **"APK'yı güncelle"** (veya benzeri "apk güncelle", "güncel apk al" vb.) derse:
Kullanıcıya **asla ekstra soru sormadan** doğrudan şu adımları sırasıyla çalıştır:
1. `c:\Users\burak\.gemini\antigravity-ide\scratch\ekoc-clone\app\build-apk.ps1` script'ini çalıştır (veya `npm run build:apk`).
   Bu script:
   - Web build'ini alır (`npm run build`),
   - Capacitor ile Android klasörüne kopyalar (`npx cap sync android`),
   - Gradle ile debug APK'sını derler (`gradlew.bat assembleDebug`).
2. Derleme tamamlandığında oluşan güncel APK'nın tam dosya yolunu kullanıcıya net olarak ver:
   `c:\Users\burak\.gemini\antigravity-ide\scratch\ekoc-clone\app\android\app\build\outputs\apk\debug\app-debug.apk`

---

## ⚡ Proje Mimarisi & Prensipleri
- **Web & APK**: Tek bir React + Vite kod tabanı Capacitor ile Android'e paketlenir.
- **Offline-First**: Tüm veriler `localStorage`'da saklanır ve `syncEngine.ts` ile çevrimdışı kuyruğa alınır.
- **Real-Time Sync**: Supabase Realtime Listener ile Web ve APK arasında anlık veri senkronizasyonu çalışır.
- **Tasarım**: Obsidian Titanium Liquid Glass koyu tema (`#0B0D12`).
