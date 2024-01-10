import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AdUserModel } from 'src/app/model/ad_user_model';
import { LoginService } from 'src/app/service/login.service';
import { UserModalComponent } from '../modal/user-modal/user-modal.component';
import { ObjectEncryption } from 'src/app/utils/object_encryption';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit{
  usuario!:AdUserModel|null

  @ViewChild(UserModalComponent) userModal!:UserModalComponent;

  constructor(
    private router:Router,
    private loginService:LoginService,
    private objectEncryption:ObjectEncryption,
  ){

  }

  ngAfterViewInit(): void {
    this.loginService.userEvent.subscribe({
      next:(response:AdUserModel|null)=>{
        this.usuario=response;
      }
    })
  }

  onHome(){
    this.router.navigate(["home"]);
  }

  modalLogin(tab:"login"|"registro"|null=null){
    this.userModal?.showModal(tab)
  }

  goToPublicar(){
    this.router.navigate(["product",this.objectEncryption.set(null)])
  }

  logout(){
    this.loginService.userEvent.emit(null);
    this.onHome()
  }
}
