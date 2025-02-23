export interface MyFormData {
  idalumno: string;
  nombre: string;
  telefono: string;
  fecha_nacimiento: String;
}
export interface MyFormDataPago {
  idpago: string;
  fecha_pago: string;
  nota_venta: string;
  alumno: {
    nombre: string;
  };
}
