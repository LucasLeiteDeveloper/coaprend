import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Coaprend',
  webDir: 'www',
  plugins: {
    Keyboard: {
        resizeOnFullScreen: false // Prevents bad resizing
      },
      EdgeToEdge: {
        backgroundColor: '#003366' // Optional UI polish
      }
    },
  android: {
    adjustMarginsForEdgeToEdge: 'force' // Helps layout compensate correctly
  }
};

export default config;
