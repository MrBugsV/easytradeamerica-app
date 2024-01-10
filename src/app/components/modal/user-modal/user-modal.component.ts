import { Component, Input,} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { errorObserver, errorResponse } from 'src/app/Func/ResponseFuntions';
import { AdRegisterForm, AdUserForm, AdUserModel, AdUserResponse } from 'src/app/model/ad_user_model';
import { LoginService } from 'src/app/service/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent{

  @Input() idModal:string = "";

  tabActiva:"login"|"registro"="login";
  banderaPassword:boolean=true;

  formLogin:FormGroup=new AdUserForm();

  constructor(
      private loginService:LoginService
    ) { 
    }

  public showModal(tab:"login"|"registro"|null=null){
    (jQuery(`#${this.idModal}`) as any).modal('show');
    if (tab) this.tabActiva=tab; else this.tabActiva="login";
    this.initForm(tab);
  }

  initForm(tab:"login"|"registro"|null){
    if (!tab||(tab&&tab=="login")) {
      this.formLogin=new AdUserForm();
    }else{
      this.formLogin=new AdRegisterForm();
    }
    this.formLogin.reset();
  }

  changeTab(tab:"login"|"registro"){
    this.tabActiva=tab;
    this.initForm(tab);
  }
  
  onLogin(){
    this.formLogin.markAllAsTouched()
    if (this.formLogin.valid) {
      this.loginService.logIn(this.formLogin.value['username'],this.formLogin.value['password']).subscribe({
        next:async (response:AdUserResponse)=>{
          if (response.STATUS=="OK") {
            this.loginService.userEvent.emit(response.DATA[0]);
            await Swal.fire({
              title: 'Éxito',
              text: response.MESSAGE,
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Aceptar'
            });
            (jQuery(`#${this.idModal}`) as any).modal('hide');
          }else errorResponse(response);
        },
        error:(err:any)=>errorObserver(err)
      })
    }
  }

  onRegister(){
    this.formLogin.markAllAsTouched()
    if (this.formLogin.valid) {
      this.loginService.register(this.formLogin.value).subscribe({
        next:async (response:AdUserResponse)=>{
          if (response.STATUS=="OK") {
            this.loginService.userEvent.emit(response.DATA[0]);
            await Swal.fire({
              title: 'Éxito',
              text: response.MESSAGE,
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Aceptar'
            });
            (jQuery(`#${this.idModal}`) as any).modal('hide');
          }else errorResponse(response);
        },
        error:(err:any)=>errorObserver(err)
      })
    }
  }

  validFormControl(campo:string):string{
    return this.formLogin.controls[campo].touched?
            (this.formLogin.controls[campo].valid?"is-valid":"is-invalid")
            :'';
  }
  
  validEmailControl(campo:string):string{
    const error=this.formLogin.controls[campo].errors;
    return error&&error['required']?
            "required"
            :"email";
  }
}
