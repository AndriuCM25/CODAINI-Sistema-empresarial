import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { mockProyectos } from '../data/mockData';
import { Proyecto } from '../types';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import SearchBar from '../components/ui/SearchBar';
import { tc } from '../utils/themeClasses';

const getEstadoBadge = (estado: string): 'success' | 'info' | 'danger' | 'warning' => {
  switch (estado) {
    case 'Completado':  return 'success';
    case 'En progreso': return 'info';
    case 'Cancelado':   return 'danger';
    default:            return 'warning';
  }
};

const Proyectos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProyectos = mockProyectos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${tc.textHeading}`}>Proyectos</h1>
          <p className={`mt-1 ${tc.textMuted}`}>Gestión de proyectos</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />}>Nuevo Proyecto</Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className={`${tc.cardShadow} p-6`}>
        <div className="mb-6">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar proyectos..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProyectos.map((proyecto: Proyecto) => (
            <motion.div key={proyecto.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4 }}
              className={`${tc.card} p-6 hover:shadow-lg dark:hover:shadow-codaini transition-all duration-300 cursor-pointer`}>
              <div className="flex items-start justify-between mb-3">
                <h3 className={`font-bold text-base ${tc.textPrimary} flex-1 mr-2`}>{proyecto.nombre}</h3>
                <Badge variant={getEstadoBadge(proyecto.estado)} dot>{proyecto.estado}</Badge>
              </div>

              <div className={`space-y-1.5 mb-4 text-sm ${tc.textMuted}`}>
                <p><span className={`font-medium ${tc.textPrimary}`}>Cliente:</span> {proyecto.cliente}</p>
                <p><span className={`font-medium ${tc.textPrimary}`}>Responsable:</span> {proyecto.responsable}</p>
                <p><span className={`font-medium ${tc.textPrimary}`}>Fecha límite:</span> {new Date(proyecto.fechaLimite).toLocaleDateString()}</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-medium ${tc.textMuted}`}>Progreso</span>
                  <span className="text-xs font-bold text-light-accent dark:text-codaini-cyan">{proyecto.progreso}%</span>
                </div>
                <div className="w-full bg-light-surface-2 dark:bg-codaini-navy rounded-full h-1.5">
                  <div className="bg-light-accent dark:bg-codaini-cyan h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${proyecto.progreso}%` }} />
                </div>
              </div>

              {proyecto.presupuesto && (
                <p className={`text-xs mt-3 ${tc.textMuted}`}>
                  Presupuesto: S/. {proyecto.presupuesto.toLocaleString()}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Proyectos;
