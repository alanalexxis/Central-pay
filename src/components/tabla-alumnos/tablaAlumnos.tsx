'use client';

import { useState, useMemo, useEffect } from 'react';
import { createColumns } from '@/components/tabla-alumnos/column';
import { DataTable } from '@/components/tabla-alumnos/data-table';
import { MyFormData } from '@/../types/table';
import UserForm from '@/components/tabla-alumnos/form';
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

async function loadAlumnos() {
  const res = await fetch('/api/alumnos');
  const data = await res.json();
  return data;
}

export default function TablePage() {
  const [data, setData] = useState<MyFormData[]>([]);
  const [editingUser, setEditingUser] = useState<MyFormData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isMultiDeleteDialogOpen, setIsMultiDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<MyFormData[]>([]);
  const columns = createColumns();

  useEffect(() => {
    async function fetchData() {
      const alumnos = await loadAlumnos();
      setData(alumnos);
    }
    fetchData();
  }, []);

  const handleCreate = (newRecord: Omit<MyFormData, 'id'>) => {
    const record = { ...newRecord, id: String(data.length + 1) };
    setData([...data, record]);
    setIsDialogOpen(false);
  };

  const handleUpdate = (updatedUser: MyFormData) => {
    setData(
      data.map((record) =>
        record.idalumno === updatedUser.idalumno ? updatedUser : record
      )
    );
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  const confirmDelete = (idalumno: string) => {
    setDeleteId(idalumno);
    setIsAlertDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/alumnos/${deleteId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        toast.success('Alumno eliminado con éxito.');
        setData(data.filter((record) => record.idalumno !== deleteId));
      } else {
        console.error('Error al eliminar el alumno:', await res.text());
      }
    } catch (error) {
      console.error('Error al eliminar el alumno:', error);
    } finally {
      setIsAlertDialogOpen(false);
      setDeleteId(null);
    }
  };

  const confirmMultiDelete = (users: MyFormData[]) => {
    setSelectedUsers(users);
    setIsMultiDeleteDialogOpen(true);
  };

  const handlemultiDelete = async () => {
    const userIds = selectedUsers.map((record) => record.idalumno);

    try {
      const deletePromises = userIds.map((id) =>
        fetch(`/api/alumnos/${id}`, {
          method: 'DELETE'
        })
      );

      const results = await Promise.all(deletePromises);

      const successfulDeletes = results.filter((res) => res.ok).length;

      if (successfulDeletes === userIds.length) {
        setData(data.filter((record) => !userIds.includes(record.idalumno)));
        toast.success('Alumnos eliminados exitosamente.');
      } else {
        toast.error('Error al eliminar algunos alumnos.');
      }
    } catch (error) {
      console.error('Error al eliminar los alumnos:', error);
      toast.error('Error al eliminar los alumnos.');
    } finally {
      setIsMultiDeleteDialogOpen(false);
      setSelectedUsers([]);
    }
  };

  const handleEdit = (record: MyFormData) => {
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
                ? 'Editar datos del alumno'
                : 'Registrar nuevo alumno'}
            </DialogTitle>
            <DialogDescription>
              Por favor, completa el siguiente formulario para{' '}
              {editingUser
                ? 'actualizar los datos del alumno'
                : 'registrar un nuevo alumno'}
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
              ¿Estás seguro de que deseas eliminar este alumno? Esta acción no
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
              ¿Estás seguro de que deseas eliminar estos alumnos? Esta acción no
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
