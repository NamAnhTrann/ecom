import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import 'preline/preline';

bootstrapApplication(App, appConfig)
  .then(() => {
    // Dispatch Angular ready event
    window.dispatchEvent(new Event('AngularReady'));

    // Extra fallback for dev mode
    const root = document.querySelector('[ng-cloak]');
    if (root) root.removeAttribute('ng-cloak');
  })
  .catch(err => console.error(err));
