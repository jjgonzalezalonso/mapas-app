import { Component } from '@angular/core';
import { PlacesService, MapService } from '../../services';

@Component({
  selector: 'app-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrls: ['./btn-my-location.component.css']
})
export class BtnMyLocationComponent {
  constructor( private placesService: PlacesService,    private mapService: MapService) { }
 
  goToMyLocation(){
        //console.log('ir a mi ubicación');
        if ( !this.placesService.isUserLocationReady ) throw Error('No hay ubicación de usuario');
        if ( !this.mapService.isMapReady ) throw Error('No hay mapa disponible');
        this.mapService.flyTo( this.placesService.useLocation! );
    
 }
}
