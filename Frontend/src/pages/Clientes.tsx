import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { mockClientes } from '../data/mockData';
import { Cliente } from '../types';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import SearchBar from '../components/ui/SearchBar';
import DataTable from '../components/tables/DataTable';
import Swal from 'sweetalert2';
import { useTheme } from '../context/ThemeContext';
import { getSwalConfig, getSwalDeleteConfig } from '../utils/swalTheme';
import { tc } from '../utils/themeClasses';

const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>(mockClientes);
  const [searchTerm, setSearchTerm] = useState('');
  const { isDark } = useTheme();

  const filteredClientes = clientes.filter(
    (c) =>
      c.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.ruc.includes(searchTerm)
  );

  const handleCreate = () => {
    Swal.fire({
      ...getSwalConfig(isDark),
      title: 'Crear Cliente',
      html: `
        <input id="empresa" class="swal2-input" placeholder="Empresa">
        <input id="ruc" class="swal2-input" placeholder="RUC">
        <input id="contacto" class="swal2-input" placeholder="Contacto">
        <input id="email" type="email" class="swal2-input" placeholder="Email">
        <input id="telefono" class="swal2-input" placeholder="Teléfono">
      `,
      confirmButtonText: 'Crear',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const empresa  = (document.getElementById('empresa')  as HTMLInputElement).value;
        const ruc      = (document.getElementById('ruc')      as HTMLInputElement).value;
        const contacto = (document.getElementById('contacto') as HTMLInputElement).value;
        const email    = (document.getElementById('email')    as HTMLInputElement).value;
        const telefono = (document.getElementById('telefono') as HTMLInputElement).value;
        if (!empresa || !ruc || !contacto || !email || !telefono) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
          return null;
        }
        return { empresa, ruc, contacto, email, telefono };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const nuevo: Cliente = { id: `${Date.now()}`, ...result.value, estado: 'Activo', fechaRegistro: new Date().toISOString().split('T')[0] };
        setClientes([...clientes, nuevo]);
        Swal.fire({ ...getSwalConfig(isDark), icon: 'success', title: '¡Creado!', text: 'Cliente creado exitosamente', timer: 2000, showConfirmButton: false });
      }
    });
  };

  const handleEdit = (cliente: Cliente) => {
    Swal.fire({
      ...getSwalConfig(isDark),
      title: 'Editar Cliente',
      html: `
        <input id="empresa" class="swal2-input" value="${cliente.empresa}" placeholder="Empresa">
        <input id="ruc" class="swal2-input" value="${cliente.ruc}" placeholder="RUC">
        <input id="contacto" class="swal2-input" value="${cliente.contacto}" placeholder="Contacto">
        <input id="email" type="email" class="swal2-input" value="${cliente.email}" placeholder="Email">
        <input id="telefono" class="swal2-input" value="${cliente.telefono}" placeholder="Teléfono">
      `,
      confirmButtonText: 'Guardar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const empresa  = (document.getElementById('empresa')  as HTMLInputElement).value;
        const ruc      = (document.getElementById('ruc')      as HTMLInputElement).value;
        const contacto = (document.getElementById('contacto') as HTMLInputElement).value;
        const email    = (document.getElementById('email')    as HTMLInputElement).value;
        const telefono = (document.getElementById('telefono') as HTMLInputElement).value;
        if (!empresa || !ruc || !contacto || !email || !telefono) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
          return null;
        }
        return { empresa, ruc, contacto, email, telefono };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setClientes(clientes.map((c) => c.id === cliente.id ? { ...c, ...result.value } : c));
        Swal.fire({ ...getSwalConfig(isDark), icon: 'success', title: '¡Actualizado!', text: 'Cliente actualizado', timer: 2000, showConfirmButton: false });
      }
    });
  };

  const handleDelete = (cliente: Cliente) => {
    Swal.fire({
      ...getSwalDeleteConfig(isDark),
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar al cliente ${cliente.empresa}?`,
    }).then((result) => {
      if (result.isConfirmed) {
        setClientes(clientes.filter((c) => c.id !== cliente.id));
        Swal.fire({ ...getSwalConfig(isDark), icon: 'success', title: '¡Eliminado!', text: 'El cliente ha sido eliminado', timer: 2000, showConfirmButton: false });
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
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar por empresa, contacto, email o RUC..." />
        </div>
        <DataTable columns={columns} data={filteredClientes} />
      </motion.div>
    </div>
  );
};

export default Clientes;
