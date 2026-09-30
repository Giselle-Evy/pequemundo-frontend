import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pequemundo.app',
  appName: 'PequeMundo',
  webDir: 'dist',
  server: {
    url: 'https://pequemundo-frontend-lime.vercel.app',
    cleartext: false,
    androidScheme: 'https',
  },
};

export default config;