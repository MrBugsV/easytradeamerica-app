import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import environment from 'src/environments/environment';
import { AdProductModel, AdProductResponse } from '../model/ad_product_model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private urlProducto:string

  constructor(
    private http: HttpClient,
  ) { 
    this.urlProducto=`${environment.url}/producto`
  }

  getProductos(producto:string|null,idCat:string|null,idSub:string|null,idCiu:string|null):Observable<AdProductResponse> {
    let query=""
    if (producto||idCat||idSub||idCiu) {
      query='?'
              +(producto?`producto=${producto}&`:'')
              +(idCat?`idCat=${idCat}&`:'')
              +(idSub?`idSub=${idSub}&`:'')
              +(idCiu?`idCiu=${idCiu}&`:'')
    }
    return this.http.get<AdProductResponse>(`${this.urlProducto}${query}`)
  }

  getDestacados():Observable<AdProductResponse> {
    return this.http.get<AdProductResponse>(`${this.urlProducto}`)
  }

  getProducto(id:string):Observable<AdProductResponse> {
    return this.http.get<AdProductResponse>(`${this.urlProducto}/${id}`)
  }

  postProducto(producto:AdProductModel):Observable<AdProductResponse> {
    return this.http.post<AdProductResponse>(`${this.urlProducto}`,producto)
  }

  putProducto(producto:AdProductModel):Observable<AdProductResponse> {
    return this.http.put<AdProductResponse>(`${this.urlProducto}`,producto)
  }

}
