import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import 'preline/preline';


bootstrapApplication(App, appConfig)
  .then(() => {
    window.dispatchEvent(new Event('AngularReady'));
  })
  .catch((err) => console.error(err));

