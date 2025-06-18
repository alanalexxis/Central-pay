'use client';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image
} from '@react-pdf/renderer';
interface PDFProps {
  data: {
    fecha_pago: string;
    nota_venta: string;
    fecha_inicio: string;
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
  };
}
// Define styles with smaller typography and reduced spacing
const styles = StyleSheet.create({
  page: {
    padding: 20, // Reduced padding
    fontFamily: 'Helvetica',
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10, // Reduced margin
    borderBottomWidth: 1, // Thinner border
    borderBottomColor: '#1e3a8a',
    paddingBottom: 5 // Reduced padding
  },
  headerCenter: {
    flex: 1,
    textAlign: 'center',
    alignItems: 'center',
    marginHorizontal: 10 // Reduced margin
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 3 // Reduced margin
  },
  headerSubtitle: {
    fontSize: 9,
    marginBottom: 1, // Reduced margin
    textAlign: 'center',
    color: '#374151'
  },
  logo: {
    width: 100, // Smaller logo
    height: 50
  },
  logoo: {
    width: 60, // Smaller logo
    height: 60
  },
  formTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8, // Reduced margin
    marginTop: 5, // Reduced margin
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: 4, // Reduced padding
    borderRadius: 3
  },
  section: {
    marginBottom: 8, // Reduced margin
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 8, // Reduced padding
    borderRadius: 3
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6, // Reduced margin
    backgroundColor: '#f3f4f6',
    padding: 3, // Reduced padding
    borderRadius: 3,
    color: '#1e3a8a'
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4 // Reduced margin
  },
  label: {
    width: '30%',
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151'
  },
  value: {
    width: '70%',
    fontSize: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#9ca3af',
    paddingBottom: 2 // Reduced padding
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8 // Reduced margin
  },
  dateBox: {
    width: '30%',
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 3, // Reduced padding
    borderRadius: 2,
    marginHorizontal: 2 // Reduced margin
  },
  dateLabel: {
    fontSize: 7,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#4b5563'
  },
  dateValue: {
    fontSize: 9,
    textAlign: 'center',
    marginTop: 1, // Reduced margin
    textTransform: 'uppercase'
  },
  scheduleBox: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 3, // Reduced padding
    borderRadius: 2
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8, // Reduced margin
    marginBottom: 3 // Reduced margin
  },
  costBox: {
    width: '30%',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 3,
    overflow: 'hidden'
  },
  costLabel: {
    fontSize: 7,
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 2, // Reduced padding
    backgroundColor: '#f3f4f6',
    color: '#1e3a8a'
  },
  costValue: {
    fontSize: 10,
    textAlign: 'center',
    padding: 3, // Reduced padding
    fontWeight: 'bold'
  },
  paymentBox: {
    width: '30%',
    borderWidth: 1,
    borderColor: '#1e3a8a',
    backgroundColor: '#1e3a8a',
    borderRadius: 3
  },
  paymentLabel: {
    fontSize: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 4, // Reduced padding
    color: 'white'
  },
  warning: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: 5, // Reduced padding
    fontSize: 9,
    textAlign: 'center',
    marginTop: 8, // Reduced margin
    marginBottom: 8, // Reduced margin
    fontWeight: 'bold',
    borderRadius: 3
  },
  formSignatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20, // Reduced margin
    marginBottom: 10 // Reduced margin
  },
  formSignatureBox: {
    width: '45%',
    borderTopWidth: 1,
    borderTopColor: '#9ca3af',
    paddingTop: 4, // Reduced padding
    alignItems: 'center'
  },
  signatureLabel: {
    fontSize: 8,
    textAlign: 'center',
    color: '#4b5563',
    marginTop: 2 // Reduced margin
  },
  promotorBox: {
    marginTop: 10, // Reduced margin
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 4, // Reduced padding
    borderRadius: 3
  },
  locationDate: {
    flexDirection: 'row',
    marginBottom: 6, // Reduced margin
    alignItems: 'center',
    justifyContent: 'center'
  },
  locationDateText: {
    fontSize: 9,
    color: '#374151',
    marginHorizontal: 1, // Reduced margin
    textTransform: 'uppercase'
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3 // Reduced margin
  },
  scheduleLabel: {
    fontSize: 9,
    width: '40%',
    color: '#374151'
  },
  scheduleLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#d1d5db',
    marginLeft: 3 // Reduced margin
  },

  // Conditions page styles - Enhanced for more formal look
  conditionsPage: {
    padding: 20, // Reduced padding
    fontFamily: 'Helvetica',
    backgroundColor: '#fff'
  },
  conditionsHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#1e3a8a',
    paddingBottom: 5,
    marginBottom: 10
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 3,
    color: '#1e3a8a',
    textTransform: 'uppercase'
  },
  subtitle: {
    fontSize: 8,
    textAlign: 'center',
    color: '#4b5563',
    marginBottom: 8
  },
  conditionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10
  },
  leftColumn: {
    width: '48%',
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb'
  },
  rightColumn: {
    width: '48%',
    paddingLeft: 8
  },
  conditionItem: {
    marginBottom: 8,
    paddingBottom: 2
  },
  conditionNumber: {
    fontWeight: 'bold',
    color: '#1e3a8a',
    fontSize: 11
  },
  conditionText: {
    fontSize: 8,
    lineHeight: 1.3,
    color: '#1f2937',
    textAlign: 'justify'
  },
  subItem: {
    marginLeft: 10,
    fontSize: 8,
    marginTop: 2,
    lineHeight: 1.3,
    color: '#1f2937'
  },
  requirementsSection: {
    marginTop: 5,
    marginBottom: 10,
    padding: 6,
    backgroundColor: '#f9fafb',
    borderRadius: 3,
    borderLeftWidth: 2,
    borderLeftColor: '#1e3a8a'
  },
  requirementsTitle: {
    fontWeight: 'bold',
    fontSize: 9,
    marginBottom: 4,
    color: '#1e3a8a',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    paddingBottom: 2
  },
  requirementItem: {
    fontSize: 8,
    marginBottom: 2,
    lineHeight: 1.3,
    color: '#1f2937',
    paddingLeft: 8,
    position: 'relative'
  },
  bulletPoint: {
    position: 'absolute',
    left: 0,
    top: 0,
    color: '#1e3a8a',
    fontWeight: 'bold'
  },
  table: {
    display: 'flex',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginTop: 8,
    borderRadius: 3,
    overflow: 'hidden'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db'
  },
  tableColHeader: {
    width: '50%',
    backgroundColor: '#1e3a8a',
    padding: 5,
    fontSize: 9,
    fontWeight: 'bold',
    borderRightWidth: 1,
    borderRightColor: '#d1d5db',
    color: 'white'
  },
  tableColHeaderLast: {
    width: '50%',
    backgroundColor: '#1e3a8a',
    padding: 5,
    fontSize: 9,
    fontWeight: 'bold',
    color: 'white'
  },
  tableCol: {
    width: '50%',
    padding: 5,
    fontSize: 8,
    borderRightWidth: 1,
    borderRightColor: '#d1d5db',
    backgroundColor: '#f9fafb'
  },
  tableColLast: {
    width: '50%',
    padding: 5,
    fontSize: 8,
    backgroundColor: '#f9fafb'
  },
  fullWidthRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db'
  },
  fullWidthCol: {
    padding: 5,
    fontSize: 8
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 10,
    padding: 2
  },
  checkbox: {
    width: 12,
    height: 12,
    border: '1px solid #1e3a8a',
    marginRight: 8,
    borderRadius: 2
  },
  amountDescription: {
    fontSize: 8,
    padding: 5,
    lineHeight: 1.3,
    color: '#1f2937',
    fontStyle: 'italic'
  },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 60,
    paddingTop: 60,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb'
  },
  signatureBox: {
    width: '30%',
    alignItems: 'center'
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: '#1e3a8a',
    width: '100%',
    marginBottom: 5
  },
  signatureText: {
    fontSize: 8,
    textAlign: 'center',
    color: '#4b5563',
    fontWeight: 'bold'
  },
  signatureName: {
    fontSize: 7,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginTop: 2
  },
  authorizedBy: {
    backgroundColor: '#1e3a8a',
    padding: 4,
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white'
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    fontSize: 8,
    color: '#9ca3af'
  }
});

const getLocation = (notaVenta: string) => {
  if (notaVenta.includes('Y')) {
    return {
      location: 'YAJALÓN, CHIAPAS',
      loc: 'Yajalón, Chiapas',
      cp: '29930',
      tel: '9196714330'
    };
  } else if (notaVenta.includes('T')) {
    return {
      location: 'TILA, CHIAPAS',
      loc: 'Tila, Chiapas',
      cp: '29910',
      tel: '9191293658'
    };
  }
  return { location: '', ciudad: '' };
};
const formatFechaNacimiento = (fecha: string) => {
  const [dia, mes, año] = fecha.split('/'); // Intercambiamos el orden
  const meses = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre'
  ];
  return `${parseInt(dia)} de ${meses[parseInt(mes) - 1]} de ${año}`;
};
const formatFechaPago = (fecha: string) => {
  const [fechaPart] = fecha.split(' '); // Separamos la fecha de la hora
  const [dia, mes, año] = fechaPart.split('/'); // Extraemos los valores

  const meses = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre'
  ];

  return `${parseInt(dia)} de ${meses[parseInt(mes) - 1]} de ${año}`;
};

// PDF Document component with improved layout and design
const PDFDocument = ({ data, style }: PDFProps & { style?: any }) => {
  const { location, loc, tel, cp } = getLocation(data.nota_venta);

  // Aquí formateamos la fecha de pago con la función formatFechaPago
  const fechaPagoFormateada = formatFechaPago(data.fecha_pago); // Suponiendo que 'fecha_pago' es la fecha en formato 'YYYY-MM-DD HH:mm:ss'

  // Extraemos el día, mes y año de la fecha formateada
  const [dia, mes, año] = fechaPagoFormateada.split(' de ');
  return (
    <Document>
      {/* Registration Form Page */}
      <Page size='A4' style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image style={styles.logo} src='/logo2.png?height=100&width=100' />
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              CENTRO DE CAPACITACIÓN Y SOPORTE INFORMÁTICO
            </Text>

            <Text style={styles.headerSubtitle}>
              SUBSECRETARÍA DE EDUCACIÓN MEDIA SUPERIOR
            </Text>
            <Text style={styles.headerSubtitle}>
              DIRECCIÓN GENERAL DE CENTROS DE FORMACIÓN PARA EL TRABAJO
            </Text>
            <Text style={styles.headerSubtitle}>
              Incorporado al sistema educativo nacional
            </Text>
            <Text style={styles.headerSubtitle}>CCT.07PBT0718Z</Text>
            <Text style={styles.headerSubtitle}>
              2DA. PONIENTE SUR S/N, BARRIO CONCEPCION, {location}
            </Text>
            <Text style={styles.headerSubtitle}>
              TEL. 919-671-43-30 Y CEL. 919-129-36-58
            </Text>
          </View>
          <Image style={styles.logoo} src='/logo.png?height=100&width=100' />
        </View>

        <Text style={styles.formTitle}>
          FORMULARIO DE INSCRIPCIÓN CICLO 2024-2025
        </Text>

        {/* Personal Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATOS PERSONALES</Text>

          <View style={styles.locationDate}>
            <Text style={styles.locationDateText}>
              {location}; A: {formatFechaPago(data.fecha_pago)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>NOMBRE DEL ALUMNO:</Text>
            <Text style={styles.value}>{data.alumno.nombre}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>SEXO:</Text>
            <Text style={styles.value}>{data.alumno.sexo}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>FECHA DE NAC.:</Text>
            <Text style={styles.value}>
              {formatFechaNacimiento(data.alumno.fecha_nacimiento)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>ESCOLARIDAD:</Text>
            <Text style={styles.value}>{data.alumno.escolaridad}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>DOMICILIO:</Text>
            <Text style={styles.value}>{data.alumno.domicilio}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>BARRIO:</Text>
            <Text style={styles.value}>{data.alumno.barrio}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>CIUDAD/MUNICIPIO:</Text>
            <Text style={styles.value}>{loc}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>TEL.</Text>
            <Text style={styles.value}>{data.alumno.telefono}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>PADRE O TUTOR:</Text>
            <Text style={styles.value}>{data.alumno.tutor}</Text>
          </View>
        </View>

        {/* Additional Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMACIÓN ADICIONAL</Text>

          <View style={styles.row}>
            <Text style={styles.label}>FECHA DE PAGO:</Text>
            <View style={{ flexDirection: 'row', width: '70%' }}>
              <View style={styles.dateBox}>
                <Text style={styles.dateLabel}>DÍA</Text>
                <Text style={styles.dateValue}>
                  {dia.padStart(2, '0')}
                </Text>{' '}
                {/* Asegura que el día siempre tenga 2 dígitos */}
              </View>
              <View style={styles.dateBox}>
                <Text style={styles.dateLabel}>MES</Text>
                <Text style={styles.dateValue}>
                  {mes.padStart(2, '0')}
                </Text>{' '}
                {/* Asegura que el mes siempre tenga 2 dígitos */}
              </View>
              <View style={styles.dateBox}>
                <Text style={styles.dateLabel}>AÑO</Text>
                <Text style={styles.dateValue}>{año}</Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>HORARIO:</Text>
            <View style={{ width: '70%' }}>
              <View style={styles.scheduleRow}>
                <Text style={styles.scheduleLabel}>LUNES A VIERNES:</Text>
                <View style={styles.scheduleLine} />
              </View>
              <View style={styles.scheduleRow}>
                <Text style={styles.scheduleLabel}>SÁBADO:</Text>
                <View style={styles.scheduleLine} />
              </View>
              <View style={styles.scheduleRow}>
                <Text style={styles.scheduleLabel}>DOMINGO:</Text>
                <View style={styles.scheduleLine} />
              </View>
            </View>
          </View>

          <View style={styles.costRow}>
            <View style={styles.costBox}>
              <Text style={styles.costLabel}>COSTO DE INSCRIPCIÓN:</Text>
              <Text style={styles.costValue}>$450.00</Text>
            </View>
            <View style={styles.paymentBox}>
              <Text style={styles.paymentLabel}>PAGO ÚNICO</Text>
            </View>
            <View style={styles.costBox}>
              <Text style={styles.costLabel}>COLEGIATURA MENSUAL:</Text>
              <Text style={styles.costValue}>$250.00</Text>
            </View>
          </View>

          <Text style={styles.warning}>NO SE DEVUELVEN ANTICIPOS</Text>

          <View style={styles.formSignatureRow}>
            <View style={styles.formSignatureBox}>
              <Text style={styles.signatureLabel}>FIRMA DEL ALUMNO</Text>
            </View>
            <View style={styles.formSignatureBox}>
              <Text style={styles.signatureLabel}>FIRMA DEL PADRE O TUTOR</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>PROMOTOR EDUCATIVO:</Text>
            <View style={styles.promotorBox}>
              <Text style={{ fontSize: 9, textAlign: 'center' }}>
                C. MARIA MAGDALENA ARCOS LOPEZ
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.pageNumber}>Página 1 de 2</Text>
      </Page>

      {/* Conditions Page - Enhanced with more formal design */}
      <Page size='A4' style={styles.conditionsPage}>
        {/* Header with title */}
        <View style={styles.conditionsHeader}>
          <Text style={styles.title}>CONDICIONES</Text>
          <Text style={styles.subtitle}>
            CENTRO DE CAPACITACIÓN Y SOPORTE INFORMÁTICO - TÉRMINOS Y
            CONDICIONES DE INSCRIPCIÓN
          </Text>
        </View>

        {/* Two-column layout for conditions */}
        <View style={styles.conditionsContainer}>
          {/* Left Column */}
          <View style={styles.leftColumn}>
            <View style={styles.conditionItem}>
              <Text style={styles.conditionText}>
                <Text style={styles.conditionNumber}>1. </Text>
                Al llenar este formulario, el alumno queda obligado a cubrir la
                cuota de inscripción y presentarse en las instalaciones de la
                institución a terminar sus trámites de inscripción entregando su
                documentación junto con la primera cuota de colegiatura semanal.
              </Text>
            </View>

            <View style={styles.conditionItem}>
              <Text style={styles.conditionText}>
                <Text style={styles.conditionNumber}>2. </Text>
                Los pagos de inscripción se harán cada semestre, según la cuota
                establecida en el presente documento.
              </Text>
            </View>

            <View style={styles.conditionItem}>
              <Text style={styles.conditionText}>
                <Text style={styles.conditionNumber}>3. </Text>
                En los casos de promoción el alumno cubrirá un único pago de
                inscripción valido por los dos años que dura la especialidad.
              </Text>
            </View>

            <View style={styles.conditionItem}>
              <Text style={styles.conditionText}>
                <Text style={styles.conditionNumber}>4. </Text>
                Al llenar este documento, la institución se reserva el derecho
                de no hacer devoluciones por los pagos efectuados durante el
                trámite.
              </Text>
            </View>

            <View style={styles.conditionItem}>
              <Text style={styles.conditionText}>
                <Text style={styles.conditionNumber}>5. </Text>
                Durante su estancia en el plantel la institución se reserva el
                derecho de aplicar incrementos en el pago de colegiaturas cuando
                así se juzgue necesario.
              </Text>
            </View>

            <View style={styles.conditionItem}>
              <Text style={styles.conditionText}>
                <Text style={styles.conditionNumber}>6. </Text>
                Cuando un alumno sea ingresado en un plan de promoción tendrá
                derecho a:
              </Text>
              <Text style={styles.subItem}>
                A).- Apoyo en un 80% de materiales didácticos.
              </Text>
              <Text style={styles.subItem}>B) examen profesional Gratis.</Text>
            </View>
          </View>

          {/* Right Column */}
          <View style={styles.rightColumn}>
            <View style={styles.conditionItem}>
              <Text style={styles.conditionText}>
                <Text style={styles.conditionNumber}>7. </Text>
                Los pagos de colegiatura semanal se harán los días que indique
                el calendario proporcionado por la escuela.
              </Text>
            </View>

            <View style={styles.conditionItem}>
              <Text style={styles.conditionText}>
                <Text style={styles.conditionNumber}>8. </Text>
                Durante la estancia dentro del plantel, el alumno podrá
                demorarse en sus pagos hasta en un máximo de 3 colegiaturas, al
                excederse la cantidad máxima incrementará el 10% sobre el total
                de adeudo.
              </Text>
            </View>

            <View style={styles.conditionItem}>
              <Text style={styles.conditionText}>
                <Text style={styles.conditionNumber}>9. </Text>
                Cuando el alumno se ausente del plantel por una o más semana,
                deberá cubrir pago de las mismas, dándole derecho a recuperar
                las clases perdidas en el horario de su preferencia.
              </Text>
            </View>

            <View style={styles.conditionItem}>
              <Text style={styles.conditionText}>
                <Text style={styles.conditionNumber}>10. </Text>
                Durante la estancia en este plantel alumno gozara de 4 semanas
                vacaciones previo pago de las mismas.
              </Text>
              <Text style={styles.subItem}>
                A. 1 Semana por vacaciones semana santa
              </Text>
              <Text style={styles.subItem}>
                B. 1 Semana por vacaciones junio
              </Text>
              <Text style={styles.subItem}>
                C. 2 semanas por vacaciones de navidad y año nuevo
              </Text>
            </View>

            <View style={styles.conditionItem}>
              <Text style={styles.conditionText}>
                <Text style={styles.conditionNumber}>11.- </Text>
                lo no expuesto en el presente documentos se tratará
                confidencialmente con el director del plantel
              </Text>
            </View>
          </View>
        </View>

        {/* Requirements Section - Enhanced with better styling */}
        <View style={styles.requirementsSection}>
          <Text style={styles.requirementsTitle}>Requisitos:</Text>
          <View style={{ position: 'relative' }}>
            <Text style={styles.requirementItem}>
              <Text style={styles.bulletPoint}>•</Text> Copia del Acta de
              Nacimiento
            </Text>
            <Text style={styles.requirementItem}>
              <Text style={styles.bulletPoint}>•</Text> Copia del comprobante de
              Estudios
            </Text>
            <Text style={styles.requirementItem}>
              <Text style={styles.bulletPoint}>•</Text> INE y comprobante de
              domicilio
            </Text>
            <Text style={styles.requirementItem}>
              <Text style={styles.bulletPoint}>•</Text> CURP
            </Text>
          </View>
        </View>

        {/* Table Section - Enhanced with better styling */}
        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text>Especialidad</Text>
            </View>
            <View style={styles.tableColHeaderLast}>
              <Text>Duración</Text>
            </View>
          </View>

          {/* Specialty Row */}
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <View style={styles.checkboxRow}>
                <View style={styles.checkbox}></View>
                <Text>INFORMÁTICA</Text>
              </View>
            </View>
            <View style={styles.tableColLast}>
              <Text>36 meses</Text>
            </View>
          </View>

          {/* Amount Row */}
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text>RECIBÍ DE: {data.alumno.nombre}</Text>
            </View>
            <View style={styles.tableColLast}>
              <Text>LA CANTIDAD DE:</Text>
              <Text style={{ fontWeight: 'bold', marginTop: 3 }}>$450.00</Text>
            </View>
          </View>

          {/* Description Row */}
          <View style={styles.fullWidthRow}>
            <View style={styles.fullWidthCol}>
              <Text style={styles.amountDescription}>
                Cuatrocientos Cincuenta pesos 00/00 M.N. Por concepto de
                Inscripción amparando su estancia en nuestro plantel el tiempo
                que dure la especialidad elegida
              </Text>
            </View>
          </View>

          {/* Date and Schedule Row */}
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={{ fontWeight: 'bold', marginBottom: 3 }}>
                Fecha de inicio:
              </Text>
              <Text>{formatFechaPago(data.fecha_inicio)}</Text>
            </View>
            <View style={styles.tableColLast}>
              <Text style={{ fontWeight: 'bold', marginBottom: 3 }}>
                Horario:
              </Text>
              <Text>8-11 O 11 a 2 pm O 2 a 5 pm</Text>
            </View>
          </View>

          {/* Authorized By Row */}
          <View style={styles.fullWidthRow}>
            <View style={styles.authorizedBy}>
              <Text>Autorizado por:</Text>
            </View>
          </View>
        </View>

        {/* Signature Section - Enhanced with better styling */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine}></View>
            <Text style={styles.signatureText}>Director</Text>
            <Text style={styles.signatureName}>Lsc. José Antonio Cruz H.</Text>
          </View>

          <View style={styles.signatureBox}>
            <View style={styles.signatureLine}></View>
            <Text style={styles.signatureText}>Supervisor</Text>
            <Text style={styles.signatureName}></Text>
          </View>

          <View style={styles.signatureBox}>
            <View style={styles.signatureLine}></View>
            <Text style={styles.signatureText}>Asesor educativo</Text>
            <Text style={styles.signatureName}>María M. Arcos López</Text>
          </View>
        </View>

        <Text style={styles.pageNumber}>Página 2 de 2</Text>
      </Page>
    </Document>
  );
};
export default PDFDocument;
