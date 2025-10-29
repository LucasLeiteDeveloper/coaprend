// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// firebase config
export const firebaseConfig = {
  apiKey: "AIzaSyA434_HMqg_eKrt5I6RUbj-z4lATronsOg",
  authDomain: "coaprend-bb2ca.firebaseapp.com",
  projectId: "coaprend-bb2ca",
  storageBucket: "coaprend-bb2ca.firebasestorage.app",
  messagingSenderId: "691529444081",
  appId: "1:691529444081:web:8b93ede890a70c326a5750",
  measurementId: "G-GXG8VCF2RW"
}


export const environment = {
  production: false,
  firebase: firebaseConfig,
  apiUrl: 'http://localhost:8000/api' // ajuste conforme backend
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
