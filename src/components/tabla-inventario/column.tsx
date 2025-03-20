'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Circle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MyFormDataInventario } from '@/../types/table';

interface ColumnActions {
  onEdit?: (data: MyFormDataInventario) => void;
  onDelete?: (id: string) => void;
}

export const createColumns = (): ColumnDef<MyFormDataInventario>[] => {
  const columns: ColumnDef<MyFormDataInventario>[] = [
    {
      accessorKey: 'idinventario',
      header: 'ID'
    },
    {
      accessorKey: 'nombre',
      header: 'Nombre'
    },
    {
      accessorKey: 'detalles',
      header: 'Detalles'
    },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: ({ row }) => {
        const estado = row.original.estado;
        let color = 'text-green-500';
        if (estado === 'Regular') color = 'text-yellow-500';
        if (estado === 'Malo') color = 'text-red-500';

        return (
          <div className='flex items-center gap-2'>
            <Circle className={color} size={16} />
            <span>{estado}</span>
          </div>
        );
      }
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
              <DropdownMenuItem onClick={() => onDelete(record.idinventario)}>
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
