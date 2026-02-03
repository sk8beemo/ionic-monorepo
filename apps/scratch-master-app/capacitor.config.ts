import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'sk8beemo.ionic.starter',
  appName: 'sk8beemo',
  webDir: '../../dist/scratch-master-app',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  }
}

export default config;
