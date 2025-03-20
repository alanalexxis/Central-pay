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
import { MyFormData } from '@/../types/table';

interface ColumnActions {
  onEdit?: (data: MyFormData) => void;
  onDelete?: (id: string) => void;
}

export const createColumns = (): ColumnDef<MyFormData>[] => {
  const columns: ColumnDef<MyFormData>[] = [
    {
      accessorKey: 'idalumno',
      header: 'ID'
    },
    {
      accessorKey: 'nombre',
      header: 'Nombre'
    },
    {
      id: 'direccion',
      header: 'Dirección',
      accessorFn: (row) => `${row.domicilio}, ${row.barrio}`
    },
    {
      accessorKey: 'sede',
      header: 'Sede'
    },
    {
      accessorKey: 'telefono',
      header: 'Teléfono'
    },
    {
      accessorKey: 'fecha_nacimiento',
      header: 'Fecha de nacimiento'
    },
    {
      accessorKey: 'tutor',
      header: 'Tutor'
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

            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(record)}>
                Editar
              </DropdownMenuItem>
            )}

            {onDelete && (
              <DropdownMenuItem onClick={() => onDelete(record.idalumno)}>
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
