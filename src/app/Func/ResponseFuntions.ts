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
  Swal.fire({
    title: 'Error!',
    text: 'Error interno del servidor.',
    icon: 'error',
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Aceptar'
  });
}
