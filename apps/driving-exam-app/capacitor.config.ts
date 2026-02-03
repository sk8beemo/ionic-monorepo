import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'sk8beemo.driving.exam',
  appName: 'Driving Exam',
  webDir: '../../dist/driving-exam-app',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  }
}

export default config;
