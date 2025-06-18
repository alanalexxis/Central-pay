'use client';
import { parse } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font
} from '@react-pdf/renderer';

// Register custom fonts
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
      fontWeight: 300
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
      fontWeight: 400
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
      fontWeight: 500
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 700
    }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Roboto',
    fontSize: 10,
    color: '#333',
    backgroundColor: '#f9f9f9'
  },
  header: { flexDirection: 'row', marginBottom: 10 },
  logoContainer: { width: '25%' },
  logo: { width: 80, height: 80 },
  headerText: { width: '75%' },
  title: { fontSize: 14, fontWeight: 'bold', color: '#2c3e50' },
  subtitle: { fontSize: 12, marginBottom: 2, color: '#34495e' },
  address: { fontSize: 10, color: '#7f8c8d' },
  invoiceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#2c3e50'
  },
  infoContainer: { flexDirection: 'row', marginBottom: 10 },
  infoColumn: { flex: 1 },
  infoRow: { flexDirection: 'row', marginBottom: 2 },
  infoLabel: { width: '30%', fontWeight: 'medium', color: '#34495e' },
  infoValue: { flex: 1, color: '#2c3e50' },
  table: { marginTop: 10 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3498db',
    color: '#ffffff',
    padding: 5
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bdc3c7',
    padding: 5
  },
  columnHeader: { flex: 1, fontWeight: 'bold', fontSize: 10 },
  column: { flex: 1, fontSize: 10 },
  footer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#bdc3c7',
    paddingTop: 5
  },
  footerText: {
    fontSize: 8,
    textAlign: 'center',
    color: '#7f8c8d',
    marginTop: 2
  },
  total: {
    textAlign: 'right',
    marginTop: 10,
    paddingRight: 5,
    fontWeight: 'bold',
    fontSize: 12,
    color: '#2c3e50'
  },
  receiptContainer: {
    marginBottom: 20,
    borderBottom: '1 dotted #000',
    paddingBottom: 10
  }
});

interface PDFProps {
  data: {
    fecha_pago: string;
    nota_venta: string;
    alumno: {
      nombre: string;
    };
  };
}

const getMonthYear = (dateString: string) => {
  const date = parse(dateString, 'dd/MM/yyyy', new Date());
  return `${date.toLocaleString('es-ES', { month: 'long' }).toUpperCase()} ${date.getFullYear()}`;
};
const getLocation = (notaVenta: string) => {
  if (notaVenta.includes('Y')) {
    return {
      location: 'YAJALÓN, CHIAPAS',
      cp: '29930',
      tel: '9196714330'
    };
  } else if (notaVenta.includes('T')) {
    return {
      location: 'TILA, CHIAPAS',
      cp: '29910',
      tel: '9191293658'
    };
  }
  return { location: '', ciudad: '' };
};

const Receipt = ({ data, style }: PDFProps & { style?: any }) => {
  const { location, tel, cp } = getLocation(data.nota_venta);

  return (
    <View style={[styles.receiptContainer, style]}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} src='/logo.png?height=100&width=100' />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>
            CENTRO DE CAPACITACION Y SOPORTE INFORMATICO
          </Text>
          <Text style={styles.subtitle}>
            INCORPORADO AL SISTEMA EDUCATIVO NACIONAL
          </Text>
          <Text style={styles.address}>C.C.T. 07PBT0718Z</Text>
          <Text style={styles.address}>
            2DA PONIENTE SUR S/N, BARRIO CENTRO, {location}
          </Text>
          <Text style={styles.address}>
            CHIAPAS C.P. {cp}, TEL. {tel}
          </Text>
        </View>
      </View>

      <Text style={styles.invoiceTitle}>RECIBO DE COLEGIATURA</Text>

      <View style={styles.infoContainer}>
        <View style={styles.infoColumn}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>CRED:</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>HORARIO:</Text>
            <Text style={styles.infoValue}>
              DOMINGOS DE 07:00 AM A 11:00 AM
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel]}>NOMBRE:</Text>
            <Text style={[styles.infoValue, { textTransform: 'uppercase' }]}>
              {data.alumno.nombre}
            </Text>
          </View>
        </View>
        <View style={styles.infoColumn}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>NOTA DE VENTA:</Text>
            <Text style={styles.infoValue}>{data.nota_venta}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>FECHA:</Text>
            <Text style={styles.infoValue}>{data.fecha_pago}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>LUGAR:</Text>
            <Text style={styles.infoValue}>{location}</Text>
          </View>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.columnHeader}>DESCRIPCION</Text>
          <Text style={styles.columnHeader}>P.UNIT</Text>
          <Text style={styles.columnHeader}>IMPORTE</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.column}>
            PAGO DE COLEGIATURA DEL MES DE {getMonthYear(data.fecha_pago)}
          </Text>
          <Text style={styles.column}>$250.00</Text>
          <Text style={styles.column}>$250.00</Text>
        </View>
      </View>

      <Text style={styles.total}>TOTAL: $250.00</Text>
      <Text
        style={[
          styles.total,
          { fontSize: 8, fontWeight: 'normal', marginTop: 2 }
        ]}
      >
        DOCIENTOS CINCUENTA PESOS M.N /00.00
      </Text>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          SUS PAGOS DEBEN SER EFECTUADOS SEGÚN EL CALENDARIO DE PAGO QUE SE LE
          FUE ENTREGADO. SE PAGARÁ MULTA DESPUES DE LA FECHA LIMITE.
        </Text>
      </View>
    </View>
  );
};

const PDF = ({ data }: PDFProps) => (
  <Document>
    <Page size='A4' style={styles.page}>
      <Receipt data={data} />
      <Receipt
        data={data}
        style={{ marginTop: 40, paddingTop: 20, borderTop: '1 dotted #000' }}
      />
    </Page>
  </Document>
);

export default PDF;
