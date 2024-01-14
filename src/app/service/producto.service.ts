import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import environment from 'src/environments/environment';
import { AdProductModel, AdProductResponse } from '../model/ad_product_model';
import { Observable } from 'rxjs';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { UUID as uuid } from 'uuid-generator-ts';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private urlProducto:string

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) { 
    this.urlProducto=`${environment.url}/producto`;
  }

  getProductos(producto:string|null,idCat:string|null,idSub:string|null,idCiu:string|null,preIni:number=0,preFin:number|null):Observable<AdProductResponse> {
    let query=""
    if (producto||idCat||idSub||idCiu||preIni||preFin) {
      query='?'
              +(producto?`producto=${producto}&`:'')
              +(idCat?`idCat=${idCat}&`:'')
              +(idSub?`idSub=${idSub}&`:'')
              +(idCiu?`idCiu=${idCiu}&`:'')
              +(preFin?`preIni=${preIni}&preFin=${preFin}&`:'')
    }
    return this.http.get<AdProductResponse>(`${this.urlProducto}${query}`)
  }

  getDestacados():Observable<AdProductResponse> {
    return this.http.get<AdProductResponse>(`${this.urlProducto}/destacados`)
  }

  getProducto(id:string):Observable<AdProductResponse> {
    return this.http.get<AdProductResponse>(`${this.urlProducto}/${id}`)
  }

  async postProducto(producto:AdProductModel, archivos:File[]):Promise<Observable<AdProductResponse>> {
    let urlImg:string=""
    for (let i = 0; i < archivos.length; i++) {
      const imagen = archivos[i];
      const file = imagen;
      const filePath = `images/${uuid.createUUID()+file.name.split(".").pop()}`;
      const fileRef = ref(this.storage,filePath);
      const res = await uploadBytes(fileRef,file)
      if (res) {
        const fileUrl=await getDownloadURL(res.ref)
        urlImg+=fileUrl+" , "
      }
    }
    producto.screen_shot=urlImg;
    return this.http.post<AdProductResponse>(`${this.urlProducto}`,producto)
  }

  putProducto(producto:AdProductModel, archivos:File[]):Observable<AdProductResponse> {
    let urlImg:string=""
    archivos.forEach(async imagen => {
      const file = imagen;
      const filePath = `images/${uuid.createUUID()+file.name.split(".").pop()}`;
      const fileRef = ref(this.storage,filePath);
      const res = await uploadBytes(fileRef,file)
      if (res) {
        const fileUrl=await getDownloadURL(res.ref)
        urlImg+=fileUrl+","
      }
    });
    return this.http.put<AdProductResponse>(`${this.urlProducto}`,producto)
  }

}
