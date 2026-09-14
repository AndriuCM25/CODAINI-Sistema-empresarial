import React from 'react';
import { motion } from 'framer-motion';
import { mockAsistencias } from '../data/mockData';
import Badge from '../components/ui/Badge';
import DataTable from '../components/tables/DataTable';
import { tc } from '../utils/themeClasses';

const Asistencias: React.FC = () => {
  const columns = [
    { header: 'Trabajador',   accessor: 'trabajador'   as keyof typeof mockAsistencias[0] },
    { header: 'Fecha',        accessor: 'fecha'        as keyof typeof mockAsistencias[0] },
    { header: 'Hora Entrada', accessor: 'horaEntrada'  as keyof typeof mockAsistencias[0] },
    { header: 'Hora Salida',  accessor: 'horaSalida'   as keyof typeof mockAsistencias[0] },
    {
      header: 'Estado',
      accessor: (a: typeof mockAsistencias[0]) => (
        <Badge
          variant={a.estado === 'Presente' ? 'success' : a.estado === 'Tardanza' ? 'warning' : 'danger'}
          dot
        >
          {a.estado}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={`text-3xl font-bold ${tc.textHeading}`}>Asistencias</h1>
        <p className={`mt-1 ${tc.textMuted}`}>Control de asistencia diaria</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className={`${tc.cardShadow} p-6`}>
        <DataTable columns={columns} data={mockAsistencias} />
      </motion.div>
    </div>
  );
};

export default Asistencias;
