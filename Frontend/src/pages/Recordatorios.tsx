import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Clock } from 'lucide-react';
import { mockRecordatorios } from '../data/mockData';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { tc } from '../utils/themeClasses';

const Recordatorios: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${tc.textHeading}`}>Recordatorios</h1>
          <p className={`mt-1 ${tc.textMuted}`}>Gestión de recordatorios personales</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />}>Nuevo Recordatorio</Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {mockRecordatorios.map((rec, index) => (
          <motion.div key={rec.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className={`
              ${tc.card} p-6
              border-l-4 transition-all duration-300
              ${rec.completado
                ? 'border-l-green-500 opacity-60'
                : rec.prioridad === 'Alta'
                ? 'border-l-red-500'
                : rec.prioridad === 'Media'
                ? 'border-l-yellow-500'
                : 'border-l-blue-500'
              }
              hover:shadow-md dark:hover:shadow-codaini
            `}
          >
            <div className="flex items-start justify-between mb-3 gap-3">
              <h3 className={`font-bold ${tc.textPrimary} flex-1 ${rec.completado ? 'line-through opacity-70' : ''}`}>
                {rec.titulo}
              </h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={rec.prioridad === 'Alta' ? 'danger' : rec.prioridad === 'Media' ? 'warning' : 'info'} dot>
                  {rec.prioridad}
                </Badge>
                {rec.completado && <Badge variant="success" dot>Completado</Badge>}
              </div>
            </div>

            <p className={`text-sm ${tc.textMuted} mb-4`}>{rec.descripcion}</p>

            <div className={`flex items-center gap-4 text-sm ${tc.textMuted}`}>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-light-accent dark:text-codaini-cyan" />
                <span>{new Date(rec.fecha).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-light-accent dark:text-codaini-cyan" />
                <span>{rec.hora}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Recordatorios;
