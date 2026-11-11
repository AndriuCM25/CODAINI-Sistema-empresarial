import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Cliente } from '../types';
import { clientesService } from '../services/api';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import SearchBar from '../components/ui/SearchBar';
import DataTable from '../components/tables/DataTable';
import Loading from '../components/ui/Loading';
import Swal from 'sweetalert2';
import { useTheme } from '../context/ThemeContext';
import { getSwalConfig, getSwalDeleteConfig } from '../utils/swalTheme';
import { tc } from '../utils/themeClasses';

const inputSwal = (id: string, placeholder: string, type = 'text', value = '') =>
  `<input id="${id}" class="swal2-input" type="${type}" placeholder="${placeholder}" value="${value}">`;

const Clientes: React.FC = () => {
  const { isDark } = useTheme();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filtered, setFiltered] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await clientesService.getAll();
        setClientes(data);
        setFiltered(data);
      } catch {
        setClientes([]);
        setFiltered([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClientes();
  }, []);

  useEffect(() => {
    const filtered = clientes.filter(
      (c) =>
        c.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.contacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.ruc.includes(searchTerm)
    );
    setFiltered(filtered);
  }, [searchTerm, clientes]);

  const applySearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCreate = () => {
    Swal.fire({
      ...getSwalConfig(isDark),
      title: 'Crear Cliente',
      html: `
        ${inputSwal('empresa', 'Empresa')}
        ${inputSwal('ruc', 'RUC')}
        ${inputSwal('contacto', 'Contacto')}
        ${inputSwal('email', 'Email', 'email')}
        ${inputSwal('telefono', 'Teléfono')}
      `,
      confirmButtonText: 'Crear',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const empresa  = (document.getElementById('empresa')  as HTMLInputElement).value.trim();
        const ruc      = (document.getElementById('ruc')      as HTMLInputElement).value.trim();
        const contacto = (document.getElementById('contacto') as HTMLInputElement).value.trim();
        const email    = (document.getElementById('email')    as HTMLInputElement).value.trim();
        const telefono = (document.getElementById('telefono')  as HTMLInputElement).value.trim();
        if (!empresa || !ruc || !contacto || !email || !telefono) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
          return null;
        }
        return { empresa, ruc, contacto, email, telefono };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          const nuevo = await clientesService.create(result.value);
          const updated = [...clientes, nuevo];
          setClientes(updated);
          setFiltered(
            updated.filter(
              (c) =>
                c.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.contacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.ruc.includes(searchTerm)
            )
          );
          Swal.fire({ ...getSwalConfig(isDark), icon: 'success', title: '¡Creado!', text: 'Cliente creado exitosamente', timer: 2000, showConfirmButton: false });
        } catch {
          Swal.fire({ ...getSwalConfig(isDark), icon: 'error', title: 'Error', text: 'No se pudo crear el cliente' });
        }
      }
    });
  };

  const handleEdit = (cliente: Cliente) => {
    Swal.fire({
      ...getSwalConfig(isDark),
      title: 'Editar Cliente',
      html: `
        ${inputSwal('empresa', 'Empresa', 'text', cliente.empresa)}
        ${inputSwal('ruc', 'RUC', 'text', cliente.ruc)}
        ${inputSwal('contacto', 'Contacto', 'text', cliente.contacto)}
        ${inputSwal('email', 'Email', 'email', cliente.email)}
        ${inputSwal('telefono', 'Teléfono', 'text', cliente.telefono)}
      `,
      confirmButtonText: 'Guardar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const empresa  = (document.getElementById('empresa')  as HTMLInputElement).value.trim();
        const ruc      = (document.getElementById('ruc')      as HTMLInputElement).value.trim();
        const contacto = (document.getElementById('contacto') as HTMLInputElement).value.trim();
        const email    = (document.getElementById('email')    as HTMLInputElement).value.trim();
        const telefono = (document.getElementById('telefono')  as HTMLInputElement).value.trim();
        if (!empresa || !ruc || !contacto || !email || !telefono) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
          return null;
        }
        return { empresa, ruc, contacto, email, telefono };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          const updated = await clientesService.update(cliente.id, result.value);
          setClientes(clientes.map((c) => (c.id === cliente.id ? updated : c)));
          Swal.fire({ ...getSwalConfig(isDark), icon: 'success', title: '¡Actualizado!', text: 'Cliente actualizado', timer: 2000, showConfirmButton: false });
        } catch {
          Swal.fire({ ...getSwalConfig(isDark), icon: 'error', title: 'Error', text: 'No se pudo actualizar el cliente' });
        }
      }
    });
  };

  const handleDelete = (cliente: Cliente) => {
    Swal.fire({
      ...getSwalDeleteConfig(isDark),
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar al cliente ${cliente.empresa}?`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await clientesService.delete(cliente.id);
          const updated = clientes.filter((c) => c.id !== cliente.id);
          setClientes(updated);
          Swal.fire({ ...getSwalConfig(isDark), icon: 'success', title: '¡Eliminado!', text: 'El cliente ha sido eliminado', timer: 2000, showConfirmButton: false });
        } catch {
          Swal.fire({ ...getSwalConfig(isDark), icon: 'error', title: 'Error', text: 'No se pudo eliminar el cliente' });
        }
      }
    });
  };

  const columns = [
    { header: 'ID',       accessor: 'id'       as keyof Cliente },
    { header: 'Empresa',  accessor: 'empresa'  as keyof Cliente },
    { header: 'RUC',      accessor: 'ruc'      as keyof Cliente },
    { header: 'Contacto', accessor: 'contacto' as keyof Cliente },
    { header: 'Email',    accessor: 'email'    as keyof Cliente },
    { header: 'Teléfono', accessor: 'telefono' as keyof Cliente },
    {
      header: 'Estado',
      accessor: (c: Cliente) => (
        <Badge variant={c.estado === 'Activo' ? 'success' : 'danger'} dot>{c.estado}</Badge>
      ),
    },
    {
      header: 'Acciones',
      accessor: (c: Cliente) => (
        <div className="flex items-center space-x-1">
          <button onClick={() => handleEdit(c)} className="p-1.5 rounded text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="Editar">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(c)} className="p-1.5 rounded text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Eliminar">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <Loading text="Cargando clientes..." fullPage />;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${tc.textHeading}`}>Clientes</h1>
          <p className={`mt-1 ${tc.textMuted}`}>Gestión de clientes de CODAINI</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleCreate}>
          Nuevo Cliente
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className={`${tc.cardShadow} p-6`}>
        <div className="mb-5">
          <SearchBar value={searchTerm} onChange={applySearch} placeholder="Buscar por empresa, contacto, email o RUC..." />
        </div>
        <DataTable columns={columns} data={filtered} />
      </motion.div>
    </div>
  );
};

export default Clientes;
