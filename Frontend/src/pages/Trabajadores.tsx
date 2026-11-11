import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trabajador } from '../types';
import { trabajadoresService } from '../services/api';
import Badge from '../components/ui/Badge';
import SearchBar from '../components/ui/SearchBar';
import Avatar from '../components/ui/Avatar';
import Loading from '../components/ui/Loading';
import { tc } from '../utils/themeClasses';

const Trabajadores: React.FC = () => {
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrabajadores = async () => {
      try {
        const data = await trabajadoresService.getAll();
        setTrabajadores(data);
      } catch {
        setTrabajadores([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrabajadores();
  }, []);

  const filteredTrabajadores = trabajadores.filter(
    (t) =>
      t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.cargo || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <Loading text="Cargando trabajadores..." fullPage />;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={`text-3xl font-bold ${tc.textHeading}`}>Trabajadores</h1>
        <p className={`mt-1 ${tc.textMuted}`}>Equipo de CODAINI</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className={`${tc.cardShadow} p-6`}>
        <div className="mb-6">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar trabajadores..." />
        </div>

        {filteredTrabajadores.length === 0 ? (
          <div className={`text-center py-16 ${tc.textMuted}`}>
            <p className="text-sm">No se encontraron trabajadores</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTrabajadores.map((trabajador) => (
              <motion.div key={trabajador.id} whileHover={{ y: -4 }}
                className={`${tc.card} p-6 hover:shadow-lg dark:hover:shadow-codaini transition-all duration-300`}>
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar src={trabajador.fotoPerfil} iniciales={trabajador.iniciales} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold ${tc.textPrimary} truncate`}>
                      {trabajador.nombre} {trabajador.apellidos}
                    </h3>
                    <p className={`text-sm ${tc.textMuted}`}>{trabajador.cargo || 'Sin cargo'}</p>
                  </div>
                </div>
                <div className={`space-y-1.5 text-sm ${tc.textMuted}`}>
                    <p><span className={`font-medium ${tc.textPrimary}`}>Área:</span> {trabajador.area || 'No asignada'}</p>
                  <p><span className={`font-medium ${tc.textPrimary}`}>Email:</span> {trabajador.email}</p>
                  <p><span className={`font-medium ${tc.textPrimary}`}>Teléfono:</span> {trabajador.telefono}</p>
                </div>
                <div className="mt-4">
                  <Badge variant="success" dot>{trabajador.estado}</Badge>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Trabajadores;
