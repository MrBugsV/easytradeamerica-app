import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import environment from 'src/environments/environment';
import { AdPaymentResponse } from '../model/ad_payments_model';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  private urlPago:string

  constructor(
    private http: HttpClient,
  ) { 
    this.urlPago=`${environment.url}/pago`
  }

  getPagosInstalados():Observable<AdPaymentResponse> {
    return this.http.get<AdPaymentResponse>(`${this.urlPago}/instalados`)
  }

}
