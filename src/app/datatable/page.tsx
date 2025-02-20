'use client';

import { useState, useMemo, useEffect } from 'react';
import { createColumns } from '@/components/column';
import { DataTable } from '@/components/data-table';
import { MyFormData } from '@/../types/table';
import UserForm from '@/components/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

async function loadAlumnos() {
  const res = await fetch('/api/alumnos');
  const data = await res.json();
  return data;
}

export default function TablePage() {
  const [data, setData] = useState<MyFormData[]>([]);
  const [editingUser, setEditingUser] = useState<MyFormData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
  const handleDelete = (idalumno: string) => {
    setData(data.filter((record) => record.idalumno !== idalumno));
  };

  const handlemultiDelete = (users: MyFormData[]) => {
    const userIds = new Set(users.map((record) => record.id));
    setData(data.filter((record) => !userIds.has(record.id)));
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
      <DataTable
        columns={columns}
        data={data}
        onAdd={openCreateDialog}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onmultiDelete={handlemultiDelete}
      />
    </div>
  );
}
