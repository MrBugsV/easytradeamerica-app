import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import environment from 'src/environments/environment';
import { AdCategorySubResponse } from '../model/ad_catagory_sub';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriaService {
  private urlSubCategoria:string

  constructor(
    private http: HttpClient,
  ) { 
    this.urlSubCategoria=`${environment.url}/subcategoria`
  }

  getSubcategorias(idCat:string=""):Observable<AdCategorySubResponse> {
    return this.http.get<AdCategorySubResponse>(`${this.urlSubCategoria}/${idCat!=""?'?idCat='+idCat:''}`)
  }

  getSubcategoriaCategoria():Observable<AdCategorySubResponse> {
    return this.http.get<AdCategorySubResponse>(`${this.urlSubCategoria}/categorias/`)
  }

}
