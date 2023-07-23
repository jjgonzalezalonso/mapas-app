import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
mapboxgl.accessToken = 'pk.eyJ1IjoiaW5mamdvbnphbGV6IiwiYSI6ImNsODcxandxOTBtanE0M3BzdnlyNXB0dDUifQ.OX4RPnBmaP5ffN7McAzmcA';


if ( !navigator.geolocation ) {
  // si la persona tiene un navegador que no soporta la geolocalización
  alert('Navegador no soporta la Geolocation');
  throw new Error('Navegador no soporta la Geolocation') //solo aparece en consola;
}


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
