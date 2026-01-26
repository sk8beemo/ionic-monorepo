import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'sk8beemo.ionic.starter',
  appName: 'sk8beemo',
  webDir: '../dist/ionic-app',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  }
}

export default config;
