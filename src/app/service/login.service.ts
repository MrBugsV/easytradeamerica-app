import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import environment from 'src/environments/environment';
import { AdUserModel, AdUserResponse } from '../model/ad_user_model';

@Injectable({
  providedIn: 'root'
})
export class LoginService{

  private urlLogin:string
  private user!:AdUserModel|null;

  public userEvent!:EventEmitter<AdUserModel|null>;

  constructor(
    private http: HttpClient,
  ) { 
    this.urlLogin=`${environment.url}/login`
    this.userEvent=new EventEmitter<AdUserModel|null>();
    this.userEvent.subscribe({
      next:(res:AdUserModel|null)=>{
        this.user=res
      }
    })
    this.user=null
  }

  logIn(user:string, pass:string):Observable<AdUserResponse> {
    return this.http.get<AdUserResponse>(`${this.urlLogin}?user=${user}&pass=${pass}`)
  }

  register(user:AdUserModel):Observable<AdUserResponse> {
    return this.http.post<AdUserResponse>(`${this.urlLogin}`,user)
  }

  logeado(){
    return this.user!=null;
  }

  getUsuario(){
    return this.user;
  }
}
