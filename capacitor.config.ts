import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.netmetrik.app',
  appName: 'NetMetrik',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0B0D12',
      overlaysWebView: false
    },
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: '#0B0D12',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false
    }
  }
};

export default config;
