export interface MyFormData {
  barrio: any;
  domicilio: any;
  idalumno: string;
  nombre: string;
  telefono: string;
  fecha_nacimiento: String;
}
export interface MyFormDataInventario {
  idinventario: string;
  nombre: string;
  detalles: string;
  estado: string;
}
export interface MyFormDataPago {
  idpago: string;
  fecha_pago: string;
  fecha_inicio: string;
  nota_venta: string;
  alumno: {
    nombre: string;
    sexo: string;
    fecha_nacimiento: string;
    escolaridad: string;
    domicilio: string;
    barrio: string;
    telefono: string;
    tutor: string;
  };
}
