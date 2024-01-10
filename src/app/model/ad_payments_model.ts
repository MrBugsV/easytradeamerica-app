import { FormControl, FormGroup, Validators } from "@angular/forms";

export interface AdPaymentModel {
  payment_id: number;
  payment_install: string;
  payment_title: string;
  payment_folder: string;
  payment_desc: string;
}

export interface AdPaymentResponse {
  STATUS:string,
  MESSAGE:string,
  DATA:AdPaymentModel[]
}