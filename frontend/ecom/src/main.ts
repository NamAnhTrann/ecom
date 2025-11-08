import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import 'preline/preline';

// Wait until Tailwind CSS finishes loading before starting Angular
async function waitForTailwind(): Promise<void> {
  return new Promise((resolve) => {
    if ((window as any).tailwindReady) return resolve();
    const check = setInterval(() => {
      if ((window as any).tailwindReady) {
        clearInterval(check);
        resolve();
      }
    }, 10); // check every 10ms
  });
}

waitForTailwind()
  .then(() => bootstrapApplication(App, appConfig))
  .then(() => window.dispatchEvent(new Event('AngularReady')))
  .catch((err) => console.error(err));
