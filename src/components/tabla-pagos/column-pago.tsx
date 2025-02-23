'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MyFormDataPago } from '@/../types/table';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDF from '../PDF';

interface ColumnActions {
  onEdit?: (data: MyFormDataPago) => void;
  onDelete?: (id: string) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const utcDate = new Date(
    date.toLocaleString('en-US', { timeZone: 'America/Mexico_City' })
  );
  const day = String(utcDate.getDate()).padStart(2, '0');
  const month = String(utcDate.getMonth() + 1).padStart(2, '0');
  const year = utcDate.getFullYear();
  let hours = utcDate.getHours();
  const minutes = String(utcDate.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strHours = String(hours).padStart(2, '0');

  return `${day}/${month}/${year} ${strHours}:${minutes} ${ampm}`;
};
export const createColumns = (): ColumnDef<MyFormDataPago>[] => {
  const columns: ColumnDef<MyFormDataPago>[] = [
    {
      accessorKey: 'idpago',
      header: 'ID'
    },
    {
      accessorKey: 'alumno.nombre',
      header: 'Nombre de alumno'
    },
    {
      accessorKey: 'fecha_pago',
      header: 'Fecha de pago',
      cell: ({ getValue }) => formatDate(getValue() as string)
    },
    {
      accessorKey: 'nota_venta',
      header: 'Nota de venta'
    }
  ];

  columns.push({
    id: 'actions',
    cell: ({ row, table }) => {
      const record = row.original;
      const { onEdit, onDelete } = table.options.meta as ColumnActions;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem>
              {' '}
              <PDFDownloadLink
                document={<PDF data={record} />}
                fileName={`factura_${record.alumno.nombre}.pdf`}
              >
                {({ loading }) =>
                  loading ? (
                    <span>Generando factura...</span>
                  ) : (
                    <span>Generar factura de pago</span>
                  )
                }
              </PDFDownloadLink>
            </DropdownMenuItem>
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(record)}>
                Editar
              </DropdownMenuItem>
            )}

            {onDelete && (
              <DropdownMenuItem onClick={() => onDelete(record.idpago)}>
                Eliminar
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  });

  return columns;
};
