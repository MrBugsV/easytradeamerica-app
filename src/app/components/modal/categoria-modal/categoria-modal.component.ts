import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { errorObserver, errorResponse } from 'src/app/Func/ResponseFuntions';
import { AdCategoryMainModel, AdCategoryMainResponse, CategoriaModal } from 'src/app/model/ad_catagory_main';
import { AdCategorySubModel } from 'src/app/model/ad_catagory_sub';
import { CategoriaService } from 'src/app/service/categoria.service';

@Component({
  selector: 'app-categoria-modal',
  templateUrl: './categoria-modal.component.html',
  styleUrls: ['./categoria-modal.component.css']
})
export class CategoriaModalComponent implements OnDestroy{

  @Input() tituloModal:string = "";
  @Input() idModal:string = "";

  @Output() onSelectedCategoria = new EventEmitter<AdCategoryMainModel>();
  @Output() onSelectedSubCategoria = new EventEmitter<AdCategorySubModel>();

  listadoCategoriaSub:CategoriaModal[]=[];
  listadoCategoria:AdCategoryMainModel[]=[];

  controlSub:FormControl=new FormControl(false);

  dtOptionsSub: DataTables.Settings | any = {};
  dtTriggerSub: Subject<any> = new Subject<any>();
  dtOptionsCat: DataTables.Settings | any = {};
  dtTriggerCat: Subject<any> = new Subject<any>();

  private subsCategoria!:Subscription;
  private subsSubcategoria!:Subscription;

  constructor(
      private categoriaService:CategoriaService
    ) { 
      this.initTableCategoria()
    }

  ngOnDestroy(): void {
    this.subsCategoria?.unsubscribe()
    this.subsSubcategoria?.unsubscribe()
  }

  initTableCategoria(){
    this.dtOptionsSub = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu:[5, 10, 15, 20],
      info: true,
      processing: true,
      ordering: true,
      responsive: true,
      retrieve: true,
      destroy: true,
      autoWidth: false,
      order:[[ 0, 'asc'],[1,'desc']],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
      },
      columnDefs: [
          {
            targets:[0,1,2],
            visible:false
          },
          {
            targets: "_all",
            className: 'dt-body-left',
            orderable:false,
            autoWidth:true
          },
        ]
      };
      
    this.dtOptionsCat = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu:[5, 10, 15, 20],
      info: true,
      processing: true,
      ordering: true,
      responsive: true,
      retrieve: true,
      destroy: true,
      autoWidth: false,
      order:[],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
      },
      columnDefs: [
          {
            targets:[1],
            orderable:false
          },
          {
            targets: "_all",
            className: 'dt-body-left',
            autoWidth:true
          },
        ]
      };
      
    this.cargarTablaCategoria();

  }
  cargarTablaCategoria() {
    if (this.controlSub.value) {
      this.subsSubcategoria=this.categoriaService.getCategoriaSubcategoria().subscribe({
        next: (response: AdCategoryMainResponse) => {
          if (response.STATUS=="OK") {
            let dtInstance = $('#adCategoriaSubTable').DataTable();
            dtInstance.destroy();
            this.listadoCategoriaSub=[]
            response.DATA.forEach((cat:AdCategoryMainModel)=>{
              let categoria= {idCat:cat.cat_id,clase:"group-cat",categoria:true,nombre:cat.cat_name,nombreCategoria:cat.cat_name, objeto:cat} as CategoriaModal
              
              cat.subcategorias.forEach((sub:AdCategorySubModel)=>{
                sub.categoria=cat.cat_name;
                categoria.contenido+=sub.sub_cat_name+"-";
                this.listadoCategoriaSub.push({idCat:sub.sub_cat_id,clase:"group-sub",categoria:false,nombre:sub.sub_cat_name,nombreCategoria:cat.cat_name, objeto:sub} as CategoriaModal)
              });
    
              this.listadoCategoriaSub.push(categoria)
            });
            this.dtTriggerSub.next('');
          }else
            errorResponse(response)
          
        },
        error: (err: any) => errorObserver(err)
      });
    }else{
      this.subsCategoria=this.categoriaService.getCategorias().subscribe({
        next: (response: AdCategoryMainResponse) => {
          if (response.STATUS=="OK") {
            let dtInstance = $('#adCategoriaTable').DataTable();
            dtInstance.destroy();
            this.listadoCategoria=response.DATA
            this.dtTriggerCat.next('');
          }else
            errorResponse(response);
        },
        error: (err: any) => errorObserver(err)
      });
    }
  }
  selectCategoria(categoria:any){
    this.onSelectedCategoria.emit(categoria);
  }
  selectSubcategoria(subcategoria:any){
    this.onSelectedSubCategoria.emit(subcategoria);
  }
}
