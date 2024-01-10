import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import environment from 'src/environments/environment';
import { AdCitiesResponse } from '../model/ad_cities';

@Injectable({
  providedIn: 'root'
})
export class CiudadService {
  private urlCiudad:string

  constructor(
    private http: HttpClient,
  ) { 
    this.urlCiudad=`${environment.url}/ciudad`
  }

  getCiudadProvincia():Observable<AdCitiesResponse> {
    return this.http.get<AdCitiesResponse>(`${this.urlCiudad}/ciudadesProvincia/`)
  }

}
