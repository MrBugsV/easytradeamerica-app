import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdCategoryMainModel } from 'src/app/model/ad_catagory_main';
import { AdProductForm, AdProductResponse, AdjuntoModel } from 'src/app/model/ad_product_model';
import { AdUserModel } from 'src/app/model/ad_user_model';
import { ObjectEncryption } from 'src/app/utils/object_encryption';
import { SubcategoriaModalComponent } from '../modal/subcategoria-modal/subcategoria-modal.component';
import { AdCategorySubModel } from 'src/app/model/ad_catagory_sub';
import { LoginService } from 'src/app/service/login.service';
import { ProductoService } from 'src/app/service/producto.service';
import Swal from 'sweetalert2';
import { errorObserver, errorResponse } from 'src/app/Func/ResponseFuntions';
import { AdCitiesModel } from 'src/app/model/ad_cities';
import { AdPaymentModel } from 'src/app/model/ad_payments_model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements AfterViewInit, OnInit{

  usuario!:AdUserModel|null;
  action:"new"|"edit"|"buy"="new";
  id!:string|null;
  precio:string="Gratis";

  formProducto:FormGroup=new AdProductForm()

  listaDelete:AdjuntoModel[]=[]
  listaAdjuntos:AdjuntoModel[]=[]
  principal!:AdjuntoModel;

  @ViewChild(SubcategoriaModalComponent) subcategoriaModal!:SubcategoriaModalComponent;

  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private objectEncryption:ObjectEncryption,
    private loginService:LoginService,
    private productService:ProductoService,
  ){
  }

  ngOnInit(): void {
    this.id = this.objectEncryption.get(this.route.snapshot.params["id"]);
    if (this.loginService.logeado()) {
      this.usuario=this.loginService.getUsuario();
      if (this.usuario) {
        this.formProducto.patchValue({
          user_id:this.usuario.id,
          nombre:this.usuario.name,
          email:this.usuario.email
        })
      }
    }else{
      if (!this.id) {
        this.router.navigate(["home"])
      }
    }
  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.id) {
      this.action="new";
    }else{
      this.productService.getProducto(this.id).subscribe({
        next:(response:AdProductResponse)=>{
          if (response.STATUS=="OK") {
            const producto=response.DATA[0];
            this.formProducto.patchValue(producto);
            this.formProducto.patchValue({
              archivos:producto.screen_shot
            });
            if (producto.user_id==this.usuario?.id) {
              this.formProducto.patchValue({
                user_id:this.usuario.id,
                nombre:this.usuario.name,
                email:this.usuario.email
              })
              this.action="edit";
            }else{
              this.action="buy";
            }
            this.listaAdjuntos=producto.screen_shot.split(",").map<AdjuntoModel>((url:string, i)=>{
              return { contenido:url, fromDB:true, principal:i } as AdjuntoModel
            })
          }else
            errorResponse(response);
        },
        error:err=>errorObserver(err)
      })

    }
    this.loginService.userEvent.subscribe({
      next:(response:AdUserModel|null)=>{
        this.usuario=response;
        if (response) 
          this.action=!this.id?"new":(response.id==this.formProducto.value['user_id']?"edit":"buy")
      }
    })
  }
  
  modalCategoria(){
    (jQuery('#modalCategoria') as any).modal('show');
  }

  selectCategoria(categoria:AdCategoryMainModel){
    this.formProducto.patchValue({
      category_name:categoria.cat_name,
      category: categoria.cat_id,
      sub_category_name: null,
      sub_category: null
    });
    (jQuery('#modalCategoria') as any).modal('hide');
  }

  modalSubcategoria(){
    this.subcategoriaModal?.showModal(this.formProducto.value['category']);
  }

  selectSubCategoria(subcategoria:AdCategorySubModel){
    this.formProducto.patchValue({
      category_name:subcategoria.categoria,
      category: subcategoria.main_cat_id,
      sub_category_name: subcategoria.sub_cat_name,
      sub_category: subcategoria.sub_cat_id
    });
    (jQuery('#modalCategoria') as any).modal('hide');
    (jQuery('#modalSubcategoria') as any).modal('hide');
  }

  modalCiudad(){
    (jQuery('#modalCiudad') as any).modal('show');
  }

  selectCiudad(ciudad:AdCitiesModel){
    this.formProducto.patchValue({
      city_name:`${ciudad.asciiname}, ${ciudad.provincia}`,
      city:ciudad.id,
      state:ciudad.subadmin1_code,
      country:ciudad.country_code,
      latlong:ciudad.latitude+", "+ciudad.longitude
    });
    (jQuery('#modalCiudad') as any).modal('hide');
  }

  modalPago(){
    if (this.validForm()) {
      (jQuery('#modalPago') as any).modal('show');
    }
  }

  async selectPago(pago:AdPaymentModel){
    (jQuery('#modalPago') as any).modal('hide');
    if (this.action=="new") {
      (await this.productService.postProducto(this.formProducto.value, this.listaAdjuntos)).subscribe({
        next:(response:AdProductResponse)=>{
          if (response.STATUS=="OK") {
            Swal.fire({
              title: 'Éxito!',
              text: response.MESSAGE,
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Aceptar'
            });
            this.router.navigate(["home"])
          }else{
            errorResponse(response)
          }
        },
        error:err=>errorObserver(err)
      })
    }else{
      (await this.productService.putProducto(this.formProducto.value, this.listaAdjuntos, this.listaDelete)).subscribe({
        next:(response:AdProductResponse)=>{
          if (response.STATUS=="OK") {
            Swal.fire({
              title: 'Éxito!',
              text: response.MESSAGE,
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Aceptar'
            });
            this.router.navigate(["home"])
          }else{
            errorResponse(response)
          }
        },
        error:err=>errorObserver(err)
      })
    }
  }

  validFormControl(campo:string):string{
    return this.formProducto.controls[campo].touched?
            (this.formProducto.controls[campo].valid?"is-valid":"is-invalid")
            :'';
  }
  
  validEmailControl(campo:string):string{
    const error=this.formProducto.controls[campo].errors;
    return error&&error['required']?
            "required"
            :"email";
  }

  validOptionControl(opcion:string,campos:string[]){
    return this.formProducto.controls[opcion].touched?
            (
              this.formProducto.value[opcion]=='basico'||
              campos.some((campo:string)=>this.formProducto.value[campo])
              ?"is-valid":"is-invalid")
            :'';
  }

  validForm():boolean{
    this.formProducto.markAllAsTouched()
    if (!this.formProducto.valid) {
      Swal.fire({
        title: 'Aviso!',
        text: "Campos requeridos o invalidos",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      });
      return false
    }else{
      if (this.formProducto.value['opcion']=="especial"&&
            (
              !this.formProducto.value['featured']&&
              !this.formProducto.value['urgent']&&
              !this.formProducto.value['highlight']
            )) {
        Swal.fire({
          title: 'Aviso!',
          text: "Debe seleccionar almenos una opción premium",
          icon: 'warning',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar'
        });
        return false
      }
    }
    return true
  }

  onBorrarAdjunto(i:number){
    const adjunto = this.listaAdjuntos.splice(i, 1)[0];

    if (adjunto.fromDB) 
      this.listaDelete.push(adjunto);
    
    this.listaAdjuntos.sort((a, b)=>{
      if (a == this.principal) 
        return -1;
      
      if (b == this.principal) 
        return 1;
      
      return 0;
    })
    
    if (this.listaAdjuntos.length>0&&!this.listaAdjuntos.some((archivo:any)=>archivo.principal.value)) {
      this.listaAdjuntos[0].principal=0
      this.principal=this.listaAdjuntos[0];
    }
    if (this.listaAdjuntos.length==0) 
      this.formProducto.patchValue({
        archivos:null
      })
  }

  cambioPrincipal(i:AdjuntoModel){
    this.principal=i;
  }

  onChangeBasico(){
    this.formProducto.patchValue({
      featured: false,
      urgent: false,
      highlight: false,
    })
    this.onChangePrice();
  }

  onChangePrice(){
    if (this.usuario) {
      if (this.formProducto.value['opcion']=="basico") {
        this.precio="Gratis";
      }else{
        let temp:number=0
                  +(this.formProducto.value['featured']?this.usuario.featured:0)
                  +(this.formProducto.value['urgent']?this.usuario.urgent:0)
                  +(this.formProducto.value['highlight']?this.usuario.highlight:0);
        this.precio=temp.toFixed(2);
      }
    }else{
      this.precio="Gratis"
    }
  }

  async onPublicar(){
    if (this.validForm()) {
      this.listaAdjuntos.sort((a, b)=>{
        if (a == this.principal) 
          return -1;
        
        if (b == this.principal) 
          return 1;
        
        return 0;
      })
      if (this.action=="new") {
        (await this.productService.postProducto(this.formProducto.value,this.listaAdjuntos)).subscribe({
          next:(response:AdProductResponse)=>{
            if (response.STATUS=="OK") {
              Swal.fire({
                title: 'Éxito!',
                text: response.MESSAGE,
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
              });
              this.router.navigate(["home"])
            }else{
              errorResponse(response)
            }
          },
          error:err=>errorObserver(err)
        })
      }else{
      (await this.productService.putProducto(this.formProducto.value, this.listaAdjuntos, this.listaDelete)).subscribe({
        next:(response:AdProductResponse)=>{
          if (response.STATUS=="OK") {
            Swal.fire({
              title: 'Éxito!',
              text: response.MESSAGE,
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Aceptar'
            });
            this.router.navigate(["home"])
          }else{
            errorResponse(response)
          }
        },
        error:err=>errorObserver(err)
      })
      }
    }
  }

  async uploadFile(event: any) {
    if (event.target.files.length > 0 && this.listaAdjuntos.length+event.target.files.length<=3) {
      this.listaAdjuntos.sort((a, b)=>{
        if (a == this.principal) 
          return -1;
        
        if (b == this.principal) 
          return 1;
        
        return 0;
      })
      
      const numAdj=3-this.listaAdjuntos.length;
      let listaArchivos=Array.from<File>(event.target.files).slice(event.target.files-numAdj,numAdj);
      for (let i = 0; i < listaArchivos.length; i++) {
        const archivo = listaArchivos[i];
        this.listaAdjuntos.push({name: archivo.name,contenido: await this.fileToBase64(archivo), principal:i, file:archivo} as AdjuntoModel);
      }
      this.principal=this.listaAdjuntos[0]
    }else{
      Swal.fire({
        title: 'Error!',
        text: "Solo puede cargar 3 imagenes en total",
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      });
    }
  }

  async downloadFile() {
    // let value: string =
    //   this.formGroupAdjunto.controls['DTRAD_CONTENIDO_ADJ'].value;
    // if (typeof value === 'string') {
    //   let fileName: string = this.formGroupAdjunto.controls['DTRAD_NOMBRE_ADJ'].value;
    //   let fileType: string = this.formGroupAdjunto.controls['DTRAD_EXTENSION_ADJ'].value;
    //   let file = this.base64ToFile(value, fileName, fileType);
    //   var url = URL.createObjectURL(await file);
    //   const newWindow = window.open(url, '_blank');
    //   if (newWindow) {
    //     newWindow.focus();
    //   }
    // }
  }

  async base64ToFile(base64: string, fileName: string, fileType: string) {
    const response = await fetch(`data:${fileType};base64,${base64}`);
    const buffer = await response.arrayBuffer();
    const byteArray = new Uint8Array(buffer);
    var blob = new Blob([byteArray],{type: fileType})
    return new File([blob], fileName, { type: fileType });
  }

  fileToBase64(file: File): Promise<string | null | ArrayBuffer> {
    return new Promise(function(resolve, reject) {
      var reader = new FileReader();
      reader.onload = function() { resolve(reader.result as string); };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
