import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { mockTareas } from '../data/mockData';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import SearchBar from '../components/ui/SearchBar';
import DataTable from '../components/tables/DataTable';
import { tc } from '../utils/themeClasses';

const Tareas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTareas = mockTareas.filter(
    (t) =>
      t.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.proyecto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: 'Tarea',       accessor: 'titulo'      as keyof typeof mockTareas[0] },
    { header: 'Proyecto',    accessor: 'proyecto'    as keyof typeof mockTareas[0] },
    { header: 'Responsable', accessor: 'responsable' as keyof typeof mockTareas[0] },
    {
      header: 'Prioridad',
      accessor: (t: typeof mockTareas[0]) => (
        <Badge variant={t.prioridad === 'Alta' ? 'danger' : t.prioridad === 'Media' ? 'warning' : 'info'} dot>
          {t.prioridad}
        </Badge>
      ),
    },
    {
      header: 'Estado',
      accessor: (t: typeof mockTareas[0]) => (
        <Badge variant={t.estado === 'Completada' ? 'success' : t.estado === 'En progreso' ? 'info' : 'warning'} dot>
          {t.estado}
        </Badge>
      ),
    },
    {
      header: 'Fecha Límite',
      accessor: (t: typeof mockTareas[0]) => new Date(t.fechaLimite).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${tc.textHeading}`}>Tareas</h1>
          <p className={`mt-1 ${tc.textMuted}`}>Gestión de tareas</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />}>Nueva Tarea</Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className={`${tc.cardShadow} p-6`}>
        <div className="mb-5">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar tareas..." />
        </div>
        <DataTable columns={columns} data={filteredTareas} />
      </motion.div>
    </div>
  );
};

export default Tareas;
