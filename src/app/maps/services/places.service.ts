import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Feature, PlacesResponse } from '../interfaces/places';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  public useLocation?: [number, number]; // ? es opcional
  private _isLoadingPlaces: boolean = false;
  public places: Feature[] = [];

  constructor(private http: HttpClient, private mapService:MapService) {
    this.getUserLocation();
  }
  
  deletePlaces(){
    this.places=[];
  }

  public async getUserLocation(): Promise<[number, number]> {
    // lo vamos a hacer en base a promesas
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.useLocation = [coords.longitude, coords.latitude];
          resolve(this.useLocation);
        },
        (err) => {
          alert('No se pudo obtener la geolocalización')
          console.log(err);
          reject();
        }
      );
    });
  }
  
  get isLoadingPlaces(): boolean{
      return this._isLoadingPlaces;
  }

  get isUserLocationReady(): boolean {   // regresa un valor booleano
    return !!this.useLocation;
    // cuando tengamos un valor devolverá true
    // ! es negacion, !! es afirmación que tenga
  }

  getPlacesByQuery(query: string = '') {
    if (query.length=== 0){
      this.places=[];
      this._isLoadingPlaces=false;
      return;
    }
    this._isLoadingPlaces = true;
    if (!this.useLocation) throw Error ('No hay userLocation');

    this.http.get<PlacesResponse>(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?limit=5&proximity=-2.9643470690782294%2C43.28368993611775&types=place%2Cpostcode%2Caddress&language=es&access_token=pk.eyJ1IjoiaW5mamdvbnphbGV6IiwiYSI6ImNsODcxandxOTBtanE0M3BzdnlyNXB0dDUifQ.OX4RPnBmaP5ffN7McAzmcA`)
      .subscribe(resp => {
        console.log(resp.features);
        this._isLoadingPlaces = false;
        this.places = resp.features;
        this.mapService.createMarkersFromPlaces(this.places, this.useLocation!);
      });
  }

}
