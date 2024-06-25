import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import * as timeago from 'timeago.js';
import * as timeagoEs from 'timeago.js/lib/lang/es';

timeago.register('es', timeagoEs.default)

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
