import Swal from "sweetalert2";

export function errorResponse(response:any){
  Swal.fire({
    title: 'Error!',
    text: response.MESSAGE,
    icon: 'error',
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Aceptar'
  });
}

export function errorObserver(err: any) {
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
