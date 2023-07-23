import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapService, PlacesService } from '../../services';
import {Map, Marker, Popup} from 'mapbox-gl';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit {
  @ViewChild('mapDiv') mapDivElement!: ElementRef

  constructor(private placesService:PlacesService, private mapService:MapService){}
  ngOnInit(): void {
   console.log(this.placesService.useLocation);
  }

  ngAfterViewInit(): void {
    if(!this.placesService.useLocation) throw  Error('No hay placesService.useLocation');
    const map = new Map({
      container: this.mapDivElement.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.placesService.useLocation, // starting position [lng, lat]
      zoom: 12, // starting zoom
      });
      const popup = new Popup()
      .setHTML(`
        <h6>Aquí estoy</h6>
        <span>Estoy en este lugar del mundo</span>
      `);
      // ` para configurar un string multilinea 
      new Marker({ color: 'red' })
      .setLngLat( this.placesService.useLocation )
      .setPopup( popup )
      .addTo( map )
      
      this.mapService.setMap(map);
  }

  
}
