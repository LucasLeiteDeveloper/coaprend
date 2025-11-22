// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// firebase config
export const firebaseConfig = {
  apiKey: "AIzaSyCBa0KnJmPbnEZW7QfmerGmgG-Hr5rO0oY",
  authDomain: "coaprend-desenvolvimento.firebaseapp.com",
  projectId: "coaprend-desenvolvimento",
  storageBucket: "coaprend-desenvolvimento.firebasestorage.app",
  messagingSenderId: "433352263753",
  appId: "1:433352263753:web:23ec20c97bc8f786d61798"
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
