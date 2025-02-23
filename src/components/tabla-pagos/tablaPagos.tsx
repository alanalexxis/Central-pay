'use client';

import { useState, useMemo, useEffect } from 'react';
import { createColumns } from '@/components/tabla-pagos/column-pago';
import { DataTable } from '@/components/tabla-pagos/data-table-pago';
import { MyFormDataPago } from '@/../types/table';
import UserForm from '@/components/tabla-pagos/form-pagos';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

async function loadPagos() {
  const res = await fetch('/api/pagos');
  const data = await res.json();
  return data;
}

export default function TablePage() {
  const [data, setData] = useState<MyFormDataPago[]>([]);
  const [editingUser, setEditingUser] = useState<MyFormDataPago | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isMultiDeleteDialogOpen, setIsMultiDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<MyFormDataPago[]>([]);
  const columns = createColumns();
  const [lastNotaVenta, setLastNotaVenta] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const pagos = await loadPagos();
      setData(pagos);
      if (pagos.length > 0) {
        const lastNota = pagos[pagos.length - 1].nota_venta;
        setLastNotaVenta(lastNota);
        console.log('Última nota_pago:', lastNota);
      }
    }
    fetchData();
  }, []);

  const handleCreate = (newRecord: Omit<MyFormDataPago, 'id'>) => {
    const record = { ...newRecord, id: String(data.length + 1) };
    setData([...data, record]);
    setLastNotaVenta(record.nota_venta); // Actualiza el estado de lastNotaVenta
    setIsDialogOpen(false);
  };

  const confirmDelete = (idpago: string) => {
    setDeleteId(idpago);
    setIsAlertDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/pagos/${deleteId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        toast.success('Pago eliminado con éxito.');
        const updatedData = data.filter((record) => record.idpago !== deleteId);
        setData(updatedData);

        // Actualiza lastNotaVenta
        if (updatedData.length > 0) {
          const lastNota = updatedData[updatedData.length - 1].nota_venta;
          setLastNotaVenta(lastNota);
        } else {
          setLastNotaVenta(null);
        }
      } else {
        console.error('Error al eliminar el pago:', await res.text());
      }
    } catch (error) {
      console.error('Error al eliminar el pago:', error);
    } finally {
      setIsAlertDialogOpen(false);
      setDeleteId(null);
    }
  };

  const confirmMultiDelete = (users: MyFormDataPago[]) => {
    setSelectedUsers(users);
    setIsMultiDeleteDialogOpen(true);
  };

  const handlemultiDelete = async () => {
    const userIds = selectedUsers.map((record) => record.idpago);

    try {
      const deletePromises = userIds.map((id) =>
        fetch(`/api/pagos/${id}`, {
          method: 'DELETE'
        })
      );

      const results = await Promise.all(deletePromises);

      const successfulDeletes = results.filter((res) => res.ok).length;

      if (successfulDeletes === userIds.length) {
        setData(data.filter((record) => !userIds.includes(record.idpago)));
        toast.success('Pagos eliminados exitosamente.');
      } else {
        toast.error('Error al eliminar algunos pagos.');
      }
    } catch (error) {
      console.error('Error al eliminar los pagos:', error);
      toast.error('Error al eliminar los pagos.');
    } finally {
      setIsMultiDeleteDialogOpen(false);
      setSelectedUsers([]);
    }
  };

  const handleEdit = (record: MyFormDataPago) => {
    setEditingUser(record);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  return (
    <div className='container mx-auto py-10'>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Editar datos del pago' : 'Registrar nuevo pago'}
            </DialogTitle>
            <DialogDescription>
              Por favor, completa el siguiente formulario para{' '}
              {editingUser
                ? 'actualizar los datos del pago'
                : 'registrar un nuevo pago'}
              .
            </DialogDescription>
          </DialogHeader>
          <div>
            <UserForm
              onSubmit={editingUser ? handleUpdate : handleCreate}
              initialData={editingUser}
              lastNotaVenta={lastNotaVenta}
            />
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar este pago? Esta acción no se
              puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertDialogOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <Button
              variant='destructive'
              onClick={() => {
                // yes, you have to set a timeout
                setTimeout(() => (document.body.style.pointerEvents = ''), 100);
                {
                  handleDelete();
                }
              }}
            >
              Eliminar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={isMultiDeleteDialogOpen}
        onOpenChange={setIsMultiDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminación múltiple</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar estos pagos? Esta acción no
              se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setIsMultiDeleteDialogOpen(false)}
            >
              Cancelar
            </AlertDialogCancel>
            <Button
              variant='destructive'
              onClick={() => {
                // yes, you have to set a timeout
                setTimeout(() => (document.body.style.pointerEvents = ''), 100);
                {
                  handlemultiDelete();
                }
              }}
            >
              Eliminar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DataTable
        columns={columns}
        data={data}
        onAdd={openCreateDialog}
        onEdit={handleEdit}
        onDelete={confirmDelete}
        onmultiDelete={confirmMultiDelete}
      />
    </div>
  );
}
