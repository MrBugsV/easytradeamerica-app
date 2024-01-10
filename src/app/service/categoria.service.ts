import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import environment from 'src/environments/environment';
import { AdCategoryMainResponse } from '../model/ad_catagory_main';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private urlMainCategoria:string

  constructor(
    private http: HttpClient,
  ) { 
    this.urlMainCategoria=`${environment.url}/categoria`
  }

  getCategorias():Observable<AdCategoryMainResponse> {
    return this.http.get<AdCategoryMainResponse>(`${this.urlMainCategoria}`)
  }

  getCategoriaSubcategoria():Observable<AdCategoryMainResponse> {
    return this.http.get<AdCategoryMainResponse>(`${this.urlMainCategoria}/subcategorias/`)
  }

}
