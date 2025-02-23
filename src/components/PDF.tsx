import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font
} from '@react-pdf/renderer';
import { JSX } from 'react';

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
  header: {
    flexDirection: 'row',
    marginBottom: 20
  },
  logoContainer: {
    width: '30%'
  },
  logo: {
    width: 100,
    height: 100
  },
  headerText: {
    width: '70%'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 5,
    color: '#34495e'
  },
  address: {
    fontSize: 10,
    color: '#7f8c8d'
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#2c3e50'
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 20
  },
  infoColumn: {
    flex: 1
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5
  },
  infoLabel: {
    width: '30%',
    fontWeight: 'medium',
    color: '#34495e'
  },
  infoValue: {
    flex: 1,
    color: '#2c3e50'
  },
  table: {
    marginTop: 20
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3498db',
    color: '#ffffff',
    padding: 10
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bdc3c7',
    padding: 10
  },
  columnHeader: {
    flex: 1,
    fontWeight: 'bold'
  },
  column: {
    flex: 1
  },
  footer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#bdc3c7',
    paddingTop: 10
  },
  footerText: {
    fontSize: 8,
    textAlign: 'center',
    color: '#7f8c8d',
    marginTop: 5
  },
  total: {
    textAlign: 'right',
    marginTop: 20,
    paddingRight: 10,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#2c3e50'
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
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const PDF = ({ data }: PDFProps) => (
  <Document>
    <Page size='A4' style={styles.page}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            src='/placeholder.svg?height=100&width=100'
          />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>CENTRO DE CAPACITACION Y SOPORTE</Text>
          <Text style={styles.title}>INFORMATICO</Text>
          <Text style={styles.subtitle}>
            INCORPORADO AL SISTEMA EDUCATIVO NACIONAL
          </Text>
          <Text style={styles.address}>C.C.T. 07PBT0718Z</Text>
          <Text style={styles.address}>
            2DA PONIENTE SUR S/N, BARRIO CENTRO, YAJALÓN
          </Text>
          <Text style={styles.address}>
            CHIAPAS C.P. 29930, TEL. 9196714330
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
            <Text style={styles.infoLabel}>NOMBRE:</Text>
            <Text style={[styles.infoValue, { textTransform: 'uppercase' }]}>
              {data.alumno.nombre}
            </Text>
          </View>
        </View>
        <View style={styles.infoColumn}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>NOTA DE VENTA:</Text>
            <Text style={styles.infoValue}> {data.nota_venta}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>FECHA:</Text>
            <Text style={styles.infoValue}> {formatDate(data.fecha_pago)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>LUGAR:</Text>
            <Text style={styles.infoValue}>YAJALON, CHIAPAS</Text>
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
            PAGO DE COLEGIATURA DEL MES DE ENERO 2025
          </Text>
          <Text style={styles.column}>$250.00</Text>
          <Text style={styles.column}>$250.00</Text>
        </View>
      </View>

      <Text style={styles.total}>TOTAL: $250.00</Text>
      <Text
        style={[
          styles.total,
          { fontSize: 12, fontWeight: 'normal', marginTop: 5 }
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
    </Page>
  </Document>
);

export default PDF;
