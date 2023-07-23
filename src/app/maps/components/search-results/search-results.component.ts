import { Component } from '@angular/core';
import { PlacesService, MapService } from '../../services';
import { Feature } from '../../interfaces/places';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent {
  constructor( private placesService: PlacesService, private mapService: MapService) { }
  public selectedId: string = '';
  
  get isLoadingPlaces(): boolean {
    return this.placesService.isLoadingPlaces;
  }

  get places(): Feature[] {
    return this.placesService.places;
  }

  flyTo( place: Feature ) {
    this.selectedId = place.id; 
    // asi se que id han seleccionado entre las 5 opciones que se muestran
    const [ lng, lat ] = place.center; // Extraigo long y lat
    this.mapService.flyTo([ lng, lat ]);
  }

  getDirections( place: Feature ) {
    if ( !this.placesService.useLocation ) throw Error('No hay userLocation');
    this.placesService.deletePlaces();
    
    const start = this.placesService.useLocation;
    const end = place.center as [number, number];
    this.mapService.getRouteBetweenPoints(start, end);
  }
}
