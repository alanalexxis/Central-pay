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

interface ColumnActions {
  onEdit?: (data: MyFormDataPago) => void;
  onDelete?: (id: string) => void;
}

export const createColumns = (): ColumnDef<MyFormDataPago>[] => {
  const columns: ColumnDef<MyFormDataPago>[] = [
    {
      accessorKey: 'idpago',
      header: 'ID'
    },
    {
      accessorKey: 'alumno.nombre',
      header: 'Nombre'
    },
    {
      accessorKey: 'fecha_pago',
      header: 'Fecha de pago'
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
            <DropdownMenuLabel>Accciones</DropdownMenuLabel>

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
