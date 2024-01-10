import { FormControl, FormGroup, Validators } from "@angular/forms";

export interface AdUserModel {
  id: number;
  group_id: number;
  username: string;
  user_type: string;
  password_hash: string;
  forgot: string;
  confirm: string;
  email: string;
  status: string;
  view: number;
  created_at: Date;
  updated_at: Date;
  name: string;
  tagline: string;
  description: string;
  website: string;
  sex: string;
  phone: string;
  postcode: string;
  address: string;
  country: string;
  city: string;
  image: string;
  lastactive: Date;
  facebook: string;
  twitter: string;
  googleplus: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  oauth_provider: string;
  oauth_link: string;
  online: string;
  notify: string;
  notify_cat: string;

  urgent:number;
  featured:number;
  highlight:number;
}

export interface AdUserResponse {
  STATUS:string,
  MESSAGE:string,
  DATA:AdUserModel[]
}

export class AdUserForm extends FormGroup{
  constructor() {
    super({
      username:new FormControl(null,Validators.required),
      password:new FormControl(null,Validators.required),   
      email:new FormControl(null),    
      name:new FormControl(null), 
      phone:new FormControl(null), 
    });
  }
}

export class AdRegisterForm extends FormGroup{
  constructor() {
    super({
      name:new FormControl(null,Validators.required),
      username:new FormControl(null,Validators.required),
      email:new FormControl(null,[Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),    
      password:new FormControl(null,Validators.required),
      phone:new FormControl(null), 
    });
  }
}