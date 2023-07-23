import { Injectable } from '@angular/core';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Feature } from '../interfaces/places';
import { HttpClient } from '@angular/common/http';
import { DirectionsResponse, Route } from '../interfaces/direction';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map?: Map;
  // he tenido que escribir el import {Map} ...
  get isMapReady() {
    return !!this.map;
    // Si tiene algun valor es true
    // Si no tiene nada es false
  }

  setMap(map: Map) {
    this.map = map;
    //recibe un map y inicializamos private map
  }
  // flyTo( coords: [number,number] ) 
  flyTo(coords: LngLatLike) {
    if (!this.isMapReady) throw Error('El mapa no esta inicializado');

    this.map?.flyTo({
      // .flyTo es un método del mapbox (no es el nuestro método)
      zoom: 14,
      center: coords
    });
  }

  private markers: Marker[] = [];

  createMarkersFromPlaces(places: Feature[], userLocation: [number, number]) {
    if (!this.map) throw Error('Mapa no inicializado');
    this.markers.forEach(marker => marker.remove());
    // borramos fisicamente del mapa todos los marcadores
    // pero todavía existen el el array markers
    this.markers = [];

    for (const place of places) {
      const [lng, lat] = place.center;
      const popup = new Popup()
        .setHTML(`
          <h6>${place.text}</h6>
          <span>${place.place_name}</span>
        `);

      const newMarker = new Marker()
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(this.map);

      this.markers.push(newMarker);
    }
    if (places.length === 0) return;
    // Limites del mapa
    const bounds = new LngLatBounds();// Ctrl + Pto, Solo tenemos el primer place
    this.markers.forEach(marker => bounds.extend(marker.getLngLat()));
    bounds.extend(userLocation);
    this.map.fitBounds(bounds, { padding: 350 });
  }

  constructor(private http: HttpClient) { }
  getRouteBetweenPoints(start: [number, number], end: [number, number]) {
    //this.http.get<DirectionsResponse>(`https://api.mapbox.com/directions/v5/mapbox/driving/-73.984406%2C40.770643%3B-73.946817%2C40.784089?alternatives=true&geometries=geojson&language=en&overview=simplified&steps=true&access_token=pk.eyJ1IjoiaW5mamdvbnphbGV6IiwiYSI6ImNsODcxandxOTBtanE0M3BzdnlyNXB0dDUifQ.OX4RPnBmaP5ffN7McAzmcA`)
    this.http.get<DirectionsResponse>(`https://api.mapbox.com/directions/v5/mapbox/driving/${start}%3B${end}?alternatives=true&geometries=geojson&language=en&overview=simplified&steps=true&access_token=pk.eyJ1IjoiaW5mamdvbnphbGV6IiwiYSI6ImNsODcxandxOTBtanE0M3BzdnlyNXB0dDUifQ.OX4RPnBmaP5ffN7McAzmcA`)
      .subscribe(resp => console.log(this.drawPolyline(resp.routes[0])))
  }

  private drawPolyline(route: Route) {
    console.log({ kms: route.distance / 1000, minutos: route.duration / 60 });
    if (!this.map) throw Error('Mapa no inicializado');

    const coords = route.geometry.coordinates; // todas las coordenadas de la ruta

    const bounds = new LngLatBounds();
    // lo desestructuro con corchetes []
    coords.forEach(([lng, lat]) => {
      bounds.extend([lng, lat]);
    });

    this.map?.fitBounds(bounds, {
      padding: 200
    });

        // Polyline, sacado de la documentacion de mapbox
        const sourceData: AnySourceData ={
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: coords
                }
              }
            ]
          }
        }
        if ( this.map.getLayer('miRouteString') ) {
          this.map.removeLayer('miRouteString');
          this.map.removeSource('miRouteString');
        }
    
        // Todo: limpiar ruta previa
        this.map.addSource('miRouteString', sourceData );
        this.map.addLayer({
          id: 'miRouteString',
          type: 'line',
          source: 'miRouteString',
          layout: {
            'line-cap': 'round',
            'line-join':'round'
          },
          paint: {
            'line-color': 'black',
            'line-width': 3
          }
      } );
    
    
  }


}
