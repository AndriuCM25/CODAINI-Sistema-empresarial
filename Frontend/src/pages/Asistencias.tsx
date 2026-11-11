import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Asistencia } from '../types';
import { asistenciasService } from '../services/api';
import Badge from '../components/ui/Badge';
import DataTable from '../components/tables/DataTable';
import Button from '../components/ui/Button';
import SearchBar from '../components/ui/SearchBar';
import Loading from '../components/ui/Loading';
import Swal from 'sweetalert2';
import { getSwalConfig, getSwalSuccessConfig, getSwalDeleteConfig } from '../utils/swalTheme';
import { tc } from '../utils/themeClasses';
import { useTheme } from '../context/ThemeContext';
import { Calendar, Clock } from 'lucide-react';

const Asistencias: React.FC = () => {
  const { isDark } = useTheme();
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [filtered, setFiltered] = useState<Asistencia[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAsistencias = async () => {
      try {
        const data = await asistenciasService.getAll();
        setAsistencias(data);
        setFiltered(data);
      } catch {
        setAsistencias([]);
        setFiltered([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAsistencias();
  }, []);

  useEffect(() => {
    const filtered = asistencias.filter(
      (a) =>
        a.trabajador.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.fecha.includes(searchTerm) ||
        a.estado.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(filtered);
  }, [searchTerm, asistencias]);

  const handleMarcarEntrada = async () => {
    try {
      await asistenciasService.marcarEntrada();
      Swal.fire({
        ...getSwalSuccessConfig(isDark),
        title: 'Entrada registrada',
        text: 'Tu hora de entrada ha sido registrada',
      });
      const data = await asistenciasService.getAll();
      setAsistencias(data);
      setFiltered(data);
    } catch {
      Swal.fire({
        ...getSwalConfig(isDark),
        icon: 'error',
        title: 'Error',
        text: 'No se pudo registrar la entrada',
      });
    }
  };

  const columns = [
    { header: 'Trabajador',   accessor: 'trabajador'   as keyof Asistencia },
    { header: 'Fecha',        accessor: 'fecha'        as keyof Asistencia },
    { header: 'Hora Entrada', accessor: 'horaEntrada'  as keyof Asistencia },
    { header: 'Hora Salida',  accessor: 'horaSalida'   as keyof Asistencia },
    {
      header: 'Estado',
      accessor: (a: Asistencia) => (
        <Badge
          variant={a.estado === 'Presente' ? 'success' : a.estado === 'Tardanza' ? 'warning' : 'danger'}
          dot
        >
          {a.estado}
        </Badge>
      ),
    },
  ];

  if (isLoading) {
    return <Loading text="Cargando asistencias..." fullPage />;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${tc.textHeading}`}>Asistencias</h1>
          <p className={`mt-1 ${tc.textMuted}`}>Control de asistencia diaria</p>
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Button variant="success" icon={<Clock className="w-4 h-4" />} onClick={handleMarcarEntrada}>
          Marcar Entrada
        </Button>
        <Button variant="secondary" icon={<Calendar className="w-4 h-4" />} onClick={async () => {
          try {
            await asistenciasService.marcarSalida();
            Swal.fire({
              ...getSwalSuccessConfig(isDark),
              title: 'Salida registrada',
              text: 'Tu hora de salida ha sido registrada',
            });
            const data = await asistenciasService.getAll();
            setAsistencias(data);
            setFiltered(data);
          } catch {
            Swal.fire({
              ...getSwalConfig(isDark),
              icon: 'error',
              title: 'Error',
              text: 'No se pudo registrar la salida',
            });
          }
        }}>
          Marcar Salida
        </Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className={`${tc.cardShadow} p-6`}>
        <div className="mb-5">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar por trabajador, fecha o estado..." />
        </div>
        <DataTable columns={columns} data={filtered} />
      </motion.div>
    </div>
  );
};

export default Asistencias;
