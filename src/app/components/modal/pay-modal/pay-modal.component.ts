import { Component, EventEmitter, Input, Output } from '@angular/core';
import { errorObserver, errorResponse } from 'src/app/Func/ResponseFuntions';
import { AdPaymentModel, AdPaymentResponse } from 'src/app/model/ad_payments_model';
import { PagoService } from 'src/app/service/pago.service';

@Component({
  selector: 'app-pay-modal',
  templateUrl: './pay-modal.component.html',
  styleUrls: ['./pay-modal.component.css']
})
export class PayModalComponent {

  @Input() tituloModal:string = "";
  @Input() idModal:string = "";

  @Output() onSelectedPayment = new EventEmitter<AdPaymentModel>();

  listaPago:AdPaymentModel[]=[];

  constructor(
    private pagoService:PagoService
    ) { 
      this.pagoService.getPagosInstalados().subscribe({
        next:(response:AdPaymentResponse)=>{
          if (response.STATUS=="OK") {
            this.listaPago=response.DATA;
          }else errorObserver(response)
        },
        error:err=>errorResponse(err)
      })
    }

  selectPago(pago:AdPaymentModel){
    this.onSelectedPayment.emit(pago);
  }

  establecerIcono(nombre:string):string{
    switch (nombre) {
      case "paypal":
        return "fab fa-cc-paypal"
      case "stripe":
        return "fab fa-cc-stripe"
      case "wire_transfer":
        return "fas fa-credit-card"
      case "2checkout":
        return "fas fa-money-bill-transfer"
      case "paystack":
        return "fas fa-money-bill"
      default:
        return "fas fa-money-bill"
    }
  }
}
