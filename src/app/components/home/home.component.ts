import { AfterViewInit, Component, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AdCategoryMainModel, AdCategoryMainResponse } from 'src/app/model/ad_catagory_main';
import { AdCategorySubModel } from 'src/app/model/ad_catagory_sub';
import { AdCitiesModel } from 'src/app/model/ad_cities';
import { CategoriaService } from 'src/app/service/categoria.service';
import { SubcategoriaModalComponent } from '../modal/subcategoria-modal/subcategoria-modal.component';
import { AdProductModel, AdProductResponse } from 'src/app/model/ad_product_model';
import { ProductoService } from 'src/app/service/producto.service';
import { AdUserModel } from 'src/app/model/ad_user_model';
import { LoginService } from 'src/app/service/login.service';
import { userInfo } from 'os';
import { Router } from '@angular/router';
import { ObjectEncryption } from 'src/app/utils/object_encryption';
import { errorObserver, errorResponse } from 'src/app/Func/ResponseFuntions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit{
  formBuscar:FormGroup;

  listaCiudades:AdCitiesModel[] = []
  listaCategorias:AdCategoryMainModel[]=[];
  listaDestacados:AdProductModel[]=[];

  listaProductos:AdProductModel[]=[];

  usuario!:AdUserModel|null;

  @ViewChild(SubcategoriaModalComponent) subcategoriaModal!:SubcategoriaModalComponent;

  constructor(
    private categoriaService:CategoriaService,
    private productoService:ProductoService,
    private loginService:LoginService,
    private router:Router,
    private objectEncryption:ObjectEncryption,
  ){
    this.formBuscar=new FormGroup({
      buscar: new FormControl(null),
      precioIni: new FormControl(null),
      precioFin: new FormControl(null),
      ciudad: new FormControl(null),
      ciudad_id: new FormControl(null),
      categoria: new FormControl(null),
      categoria_id: new FormControl(null),
      subcategoria: new FormControl(null),
      subcategoria_id: new FormControl(null)
    });
    this.cargarCategorias();
    this.cargarDestacados();
  }

  ngAfterViewInit(): void {
    this.loginService.userEvent.subscribe({
      next:(response:AdUserModel|null)=>this.usuario=response
    })
  }

  modalCiudad(){
    (jQuery('#modalCiudad') as any).modal('show');
  }

  selectCiudad(ciudad:AdCitiesModel){
    this.formBuscar.patchValue({
      ciudad:`${ciudad.asciiname}, ${ciudad.provincia}`,
      ciudad_id:ciudad.id,
    });
    (jQuery('#modalCiudad') as any).modal('hide');
  }

  onBorrarCiudad(){
    this.formBuscar.patchValue({
      ciudad:null,
      ciudad_id:null,
    });
  }

  modalCategoria(){
    (jQuery('#modalCategoria') as any).modal('show');
  }

  selectCategoria(categoria:AdCategoryMainModel){
    this.formBuscar.patchValue({
      categoria:categoria.cat_name,
      categoria_id: categoria.cat_id,
      subcategoria_id: null,
      subcategoria: null
    });
    (jQuery('#modalCategoria') as any).modal('hide');
  }

  onBorrarCategoria(){
    this.formBuscar.patchValue({
      categoria:null,
      categoria_id:null,
      subcategoria: null,
      subcategoria_id: null
    });
  }

  modalSubcategoria(){
    this.subcategoriaModal?.showModal(this.formBuscar.value['categoria_id']);
  }

  selectSubCategoria(subcategoria:AdCategorySubModel){
    this.formBuscar.patchValue({
      categoria:subcategoria.categoria,
      categoria_id: subcategoria.main_cat_id,
      subcategoria: subcategoria.sub_cat_name,
      subcategoria_id: subcategoria.sub_cat_id
    });
    (jQuery('#modalCategoria') as any).modal('hide');
    (jQuery('#modalSubcategoria') as any).modal('hide');
  }

  cargarCategorias(){
    this.categoriaService.getCategorias().subscribe({
      next:(response:AdCategoryMainResponse)=>{
        this.listaCategorias=response.DATA
      }
    })
  }

  cargarDestacados(){
    this.productoService.getDestacados().subscribe({
      next:(response:AdProductResponse)=>{
        this.listaDestacados=response.DATA
      }
    })
  }

  onBorrarSubcategoria(){
    this.formBuscar.patchValue({
      categoria:null,
      categoria_id: null,
      subcategoria: null,
      subcategoria_id: null
    });
  }

  onBuscar(){
    this.productoService.getProductos(this.formBuscar.value['buscar']
                                        ,this.formBuscar.value['categoria_id']
                                        ,this.formBuscar.value['subcategoria_id']
                                        ,this.formBuscar.value['ciudad_id']).subscribe({
        next:(response:AdProductResponse)=>{
          if (response.STATUS=="OK") {
            this.listaProductos=response.DATA
          }else
            errorResponse(response)
        },
        error:err=>errorObserver(err)
      })
  }

  getProducto(productos:string):string{
    if (productos) {
      const temp = productos.split(",");
      if (temp.length>0) 
        return temp[0];
    }
    return "defaultImage.png"
  }

  goToProducto(producto:AdProductModel){
    this.router.navigate(["product",this.objectEncryption.set(producto.id)])
  }
}
