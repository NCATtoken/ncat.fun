// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { environment as env } from './environment.prod';

export const environment = Object.assign(env, {
  production: false,
  // apiBaseurl: 'http://localhost:1337',
  daoBaseurl: 'http://localhost:3000',
  paypalClientId: 'ASQqNJ0g03V7qUmUsrGxnnU5iB82B7DgJCKu_3daa5aqLtSYsyL_xcv_oo8fSfyigYYfUJ0ByQwmakCK',
});


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
