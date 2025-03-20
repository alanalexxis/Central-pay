'use client';

import { useState, useMemo, useEffect } from 'react';
import { createColumns } from '@/components/tabla-inventario/column';
import { DataTable } from '@/components/tabla-inventario/data-table';
import { MyFormDataInventario } from '@/../types/table';
import UserForm from '@/components/tabla-inventario/form';
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

async function loadInventarios() {
  const res = await fetch('/api/inventarios');
  const data = await res.json();
  return data;
}

export default function TablePage() {
  const [data, setData] = useState<MyFormDataInventario[]>([]);
  const [editingUser, setEditingUser] = useState<MyFormDataInventario | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isMultiDeleteDialogOpen, setIsMultiDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<MyFormDataInventario[]>(
    []
  );
  const columns = createColumns();

  useEffect(() => {
    async function fetchData() {
      const inventarios = await loadInventarios();
      setData(inventarios);
    }
    fetchData();
  }, []);

  const handleCreate = (newRecord: Omit<MyFormDataInventario, 'id'>) => {
    const record = { ...newRecord, id: String(data.length + 1) };
    setData([...data, record]);
    setIsDialogOpen(false);
  };

  const handleUpdate = (updatedUser: MyFormDataInventario) => {
    setData(
      data.map((record) =>
        record.idinventario === updatedUser.idinventario ? updatedUser : record
      )
    );
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  const confirmDelete = (idinventario: string) => {
    setDeleteId(idinventario);
    setIsAlertDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/inventarios/${deleteId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        toast.success('Eliminado con éxito.');
        setData(data.filter((record) => record.idinventario !== deleteId));
      } else {
        console.error('Error al eliminar:', await res.text());
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
    } finally {
      setIsAlertDialogOpen(false);
      setDeleteId(null);
    }
  };

  const confirmMultiDelete = (users: MyFormDataInventario[]) => {
    setSelectedUsers(users);
    setIsMultiDeleteDialogOpen(true);
  };

  const handlemultiDelete = async () => {
    const userIds = selectedUsers.map((record) => record.idinventario);

    try {
      const deletePromises = userIds.map((id) =>
        fetch(`/api/inventarios/${id}`, {
          method: 'DELETE'
        })
      );

      const results = await Promise.all(deletePromises);

      const successfulDeletes = results.filter((res) => res.ok).length;

      if (successfulDeletes === userIds.length) {
        setData(
          data.filter((record) => !userIds.includes(record.idinventario))
        );
        toast.success('Eliminados exitosamente.');
      } else {
        toast.error('Error al eliminar.');
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      toast.error('Error al eliminar.');
    } finally {
      setIsMultiDeleteDialogOpen(false);
      setSelectedUsers([]);
    }
  };

  const handleEdit = (record: MyFormDataInventario) => {
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
              {editingUser
                ? 'Editar datos del objeto'
                : 'Registrar nuevo objeto'}
            </DialogTitle>
            <DialogDescription>
              Por favor, completa el siguiente formulario para{' '}
              {editingUser
                ? 'actualizar los datos del objeto'
                : 'registrar un nuevo objeto'}
              .
            </DialogDescription>
          </DialogHeader>
          <div>
            <UserForm
              onSubmit={editingUser ? handleUpdate : handleCreate}
              initialData={editingUser}
            />
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar este objeto? Esta acción no
              se puede deshacer.
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
              ¿Estás seguro de que deseas eliminar estos objetos? Esta acción no
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
