import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { AdCitiesModel, AdCitiesResponse } from 'src/app/model/ad_cities';
import { CiudadService } from 'src/app/service/ciudad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ciudad-modal',
  templateUrl: './ciudad-modal.component.html',
  styleUrls: ['./ciudad-modal.component.css']
})
export class CiudadModalComponent implements OnDestroy{

  @Input() tituloModal:string = "";
  @Input() idModal:string = "";

  @Output() onSelectedCiudad = new EventEmitter<AdCitiesModel>();

  listadoCiudad:AdCitiesModel[]=[];

  dtOptions: DataTables.Settings | any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  private subsCiudad!:Subscription;

  constructor(
    private ciudadService:CiudadService
  ) { 
    this.initTableCiudad()
  }

  ngOnDestroy(): void {
    this.subsCiudad?.unsubscribe();
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
      order:[],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
      },
      columnDefs: [
          {
            targets: [0,1],
            width:'auto'
          },
          {
            targets: [2],
            width:'5%',
            orderable: false
          },
          {
            targets: "_all",
            className: 'dt-body-left',
            autoWidth:true
          },
        ],
      };
      this.cargarTablaCiudad();
  }
  cargarTablaCiudad() {
    this.subsCiudad=this.ciudadService.getCiudadProvincia().subscribe({
      next: (response: AdCitiesResponse) => {
        let dtInstance = $('#adCiudadTable').DataTable();
        dtInstance.destroy();
        this.listadoCiudad = response.DATA;
        this.dtTrigger.next('');
      },
      error: (err: any) => this.errorObserver(err)
    });
  }
  selectCiudad(ciudad:AdCitiesModel){
    this.onSelectedCiudad.emit(ciudad);
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
