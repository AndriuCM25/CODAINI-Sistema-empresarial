import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Clock, Users } from 'lucide-react';
import { mockCapacitaciones } from '../data/mockData';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { tc } from '../utils/themeClasses';

const Capacitaciones: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${tc.textHeading}`}>Capacitaciones</h1>
          <p className={`mt-1 ${tc.textMuted}`}>Programas de capacitación</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />}>Nueva Capacitación</Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {mockCapacitaciones.map((cap, index) => (
          <motion.div key={cap.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }} whileHover={{ y: -4 }}
            className={`${tc.card} p-6 hover:shadow-lg dark:hover:shadow-codaini transition-all duration-300`}>
            <div className="flex items-start justify-between mb-3">
              <h3 className={`font-bold text-base ${tc.textPrimary} flex-1 mr-3`}>{cap.nombre}</h3>
              <Badge variant={cap.estado === 'Finalizada' ? 'success' : cap.estado === 'En curso' ? 'info' : 'warning'} dot>
                {cap.estado}
              </Badge>
            </div>

            <p className={`text-sm ${tc.textMuted} mb-4`}>{cap.descripcion}</p>

            <div className={`space-y-2 text-sm ${tc.textMuted}`}>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 flex-shrink-0 text-light-accent dark:text-codaini-cyan" />
                <span>Instructor: <span className={tc.textPrimary}>{cap.instructor}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 flex-shrink-0 text-light-accent dark:text-codaini-cyan" />
                <span>{new Date(cap.fecha).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 flex-shrink-0 text-light-accent dark:text-codaini-cyan" />
                <span>{cap.hora} — {cap.duracion}</span>
              </div>
              <div className="flex items-center gap-4 pt-1">
                <span>Participantes: <strong className={tc.textPrimary}>{cap.numeroParticipantes}</strong></span>
                <span>Lugar: <strong className={tc.textPrimary}>{cap.ubicacion}</strong></span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Capacitaciones;
