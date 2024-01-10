import { FormControl, FormGroup, Validators } from "@angular/forms";

export interface AdProductModel {
  id: number;
  category: number;
  sub_category: number;
  user_id: number;
  product_name: string;
  description: string;
  price: number;
  negotiable: string;
  phone: string;
  hide_phone: string;
  city: string;
  featured: string;
  urgent: string;
  highlight: string;
  featured_exp_date: number;
  urgent_exp_date: number;
  highlight_exp_date: number;
  status: string;
  slug: string;
  location: string;
  state: string;
  country: string;
  latlong: string;
  screen_shot: string;
  tag: string;
  view: number;
  custom_fields: string;
  custom_types: string;
  custom_values: string;
  expire_date: number;
  contact_phone: string;
  contact_email: string;
  contact_chat: string;
  admin_seen: string;
  emailed: string;
  hide: string;
  created_at: Date;
  updated_at: Date;
}

export interface AdProductResponse {
  STATUS:string,
  MESSAGE:string,
  DATA:AdProductModel[]
}

export class AdProductForm extends FormGroup{
  constructor() {
    super({
      id: new FormControl(null),
      user_id: new FormControl(null,Validators.required),
      category: new FormControl(null,Validators.required),
      category_name: new FormControl(null,Validators.required),
      sub_category: new FormControl(null,Validators.required),
      sub_category_name: new FormControl(null,Validators.required),
      product_name: new FormControl(null,Validators.required),
      description: new FormControl(null,Validators.required),
      city: new FormControl(null,Validators.required),
      city_name: new FormControl(null,Validators.required),
      state: new FormControl(null,Validators.required),
      latlong: new FormControl(null,Validators.required),
      country: new FormControl(null,Validators.required),
      price: new FormControl(null,Validators.required),
      negotiable: new FormControl(false),
      phone: new FormControl(null,Validators.required),
      hide_phone: new FormControl(false),
      tag: new FormControl(null,Validators.required),
      nombre:new FormControl(null, Validators.required),
      email:new FormControl(null,[Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
      opcion:new FormControl("basico"),
      featured: new FormControl(false),
      featured_exp_date: new FormControl(null),
      urgent: new FormControl(false),
      urgent_exp_date: new FormControl(null),
      highlight: new FormControl(false),
      highlight_exp_date: new FormControl(null),
      archivos: new FormControl(null,Validators.required),
      location: new FormControl(""),
      screen_shot: new FormControl(""),
      custom_fields: new FormControl(""),
      custom_types: new FormControl(""),
      custom_values: new FormControl(""),
    });
  }
}
