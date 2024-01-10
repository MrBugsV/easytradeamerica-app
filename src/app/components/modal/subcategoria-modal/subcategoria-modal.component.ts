import { Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { AdCategoryMainModel, AdCategoryMainResponse, CategoriaModal } from 'src/app/model/ad_catagory_main';
import { AdCategorySubModel, AdCategorySubResponse,  } from 'src/app/model/ad_catagory_sub';
import { SubcategoriaService } from 'src/app/service/subcategoria.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subcategoria-modal',
  templateUrl: './subcategoria-modal.component.html',
  styleUrls: ['./subcategoria-modal.component.css']
})
export class SubcategoriaModalComponent implements OnDestroy{

  @Input() tituloModal:string = "";
  @Input() idModal:string = "";

  idCategoria:string="";

  @Output() onSelectedSubCategoria = new EventEmitter<AdCategorySubModel>();

  listadoSubcategoria:AdCategorySubModel[]=[];

  dtOptions: DataTables.Settings | any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  private subsSubcategoria!:Subscription;

  constructor(
    private subcategoriaService:SubcategoriaService
  ) { 
    this.initTableCiudad()
  }

  ngOnDestroy(): void {
    this.subsSubcategoria?.unsubscribe();
  }

  public showModal(id:string|null=""){
    this.idCategoria=id?id:"";
    (jQuery(`#${this.idModal}`) as any).modal('show');
    this.cargarTablaCategoria();
  }

  initTableCiudad(){
    this.dtOptions = {
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
            targets: ['1'],
            orderable:false
          },
          {
            targets: "_all",
            className: 'dt-body-left',
            autoWidth:true
          },
        ]
      };
  }
  cargarTablaCategoria() {
    this.subsSubcategoria=this.subcategoriaService.getSubcategorias(this.idCategoria).subscribe({
      next: (response: AdCategorySubResponse) => {
        let dtInstance = $('#adSubcategoriaTable').DataTable();
        dtInstance.destroy();
        this.listadoSubcategoria=response.DATA;
        this.dtTrigger.next('');
      },
      error: (err: any) => this.errorObserver(err)
    });
  }
  selectSubcategoria(subcategoria:any){
    this.onSelectedSubCategoria.emit(subcategoria);
  }
  errorObserver(err: any) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = err.error.message;
    } else {
      if(err.status == 401) {
        errorMessage = 'Código: '+err.status+' Mensaje: '+err.error.MESSAGE;
      } else {
        errorMessage = 'Código: '+err.status+' Mensaje: '+err.message;
      }
    }
    Swal.fire({
      title: 'Error!',
      text: 'Error interno del servidor. ' + errorMessage,
      icon: 'error',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar'
    });
  }
}
