import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Clock, Users, Trash2 } from 'lucide-react';
import { Capacitacion, EstadoCapacitacion } from '../types';
import { capacitacionesService } from '../services/api';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import SearchBar from '../components/ui/SearchBar';
import Modal from '../components/ui/Modal';
import Loading from '../components/ui/Loading';
import { tc } from '../utils/themeClasses';
import { getSwalConfig } from '../utils/swalTheme';
import { useTheme } from '../context/ThemeContext';
import Swal from 'sweetalert2';

interface CapacitacionForm {
  nombre: string;
  descripcion: string;
  instructor: string;
  fecha: string;
  hora: string;
  duracion: string;
  ubicacion: string;
}

const estadoBadge = (estado: EstadoCapacitacion) => {
  if (estado === 'Finalizada') return 'success';
  if (estado === 'En curso') return 'info';
  return 'warning';
};

const Capacitaciones: React.FC = () => {
  const { isDark } = useTheme();
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>([]);
  const [filtered, setFiltered] = useState<Capacitacion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<CapacitacionForm>({
    nombre: '', descripcion: '', instructor: '', fecha: '', hora: '', duracion: '', ubicacion: '',
  });

  useEffect(() => {
    const fetchCapacitaciones = async () => {
      try {
        const data = await capacitacionesService.getAll();
        setCapacitaciones(data);
        setFiltered(data);
      } catch {
        setCapacitaciones([]);
        setFiltered([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCapacitaciones();
  }, []);

  useEffect(() => {
    const filtered = capacitaciones.filter(
      (c) =>
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(filtered);
  }, [searchTerm, capacitaciones]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCrear = async () => {
    if (!form.nombre || !form.instructor || !form.fecha || !form.hora || !form.duracion || !form.ubicacion) {
      Swal.fire({
        ...getSwalConfig(isDark),
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Completa todos los campos obligatorios.',
      });
      return;
    }
    try {
      const nueva = await capacitacionesService.create({ ...form, participantes: [] });
      setCapacitaciones((prev) => [...prev, nueva]);
      setModalOpen(false);
      setForm({ nombre: '', descripcion: '', instructor: '', fecha: '', hora: '', duracion: '', ubicacion: '' });
      Swal.fire({
        ...getSwalConfig(isDark),
        icon: 'success',
        title: 'Capacitación creada',
        text: `${nueva.nombre} fue registrada exitosamente.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        ...getSwalConfig(isDark),
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear la capacitación.',
      });
    }
  };

  const handleDelete = async (cap: Capacitacion) => {
    const result = await Swal.fire({
      ...getSwalConfig(isDark),
      title: '¿Eliminar capacitación?',
      text: `Se eliminará permanentemente "${cap.nombre}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await capacitacionesService.delete(cap.id);
        setCapacitaciones((prev) => prev.filter((c) => c.id !== cap.id));
        setFiltered((prev) => prev.filter((c) => c.id !== cap.id));
        Swal.fire({
          ...getSwalConfig(isDark),
          icon: 'success',
          title: 'Eliminada',
          text: 'La capacitación fue eliminada.',
          timer: 1800,
          showConfirmButton: false,
        });
      } catch {
        Swal.fire({
          ...getSwalConfig(isDark),
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la capacitación.',
        });
      }
    }
  };

  if (isLoading) {
    return <Loading text="Cargando capacitaciones..." fullPage />;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${tc.textHeading}`}>Capacitaciones</h1>
          <p className={`mt-1 ${tc.textMuted}`}>Programas de capacitación</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
          Nueva Capacitación
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className={`${tc.cardShadow} p-6`}>
        <div className="mb-5">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar capacitaciones..." />
        </div>

        {filtered.length === 0 ? (
          <div className={`text-center py-16 ${tc.textMuted}`}>
            <p className="text-sm">No se encontraron capacitaciones</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((cap, index) => (
              <motion.div key={cap.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }} whileHover={{ y: -4 }}
                className={`${tc.card} p-6 hover:shadow-lg dark:hover:shadow-codaini transition-all duration-300`}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className={`font-bold text-base ${tc.textPrimary} flex-1 mr-3`}>{cap.nombre}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={estadoBadge(cap.estado)} dot>
                      {cap.estado}
                    </Badge>
                    <button
                      onClick={() => void handleDelete(cap)}
                      title="Eliminar capacitación"
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
        )}
      </motion.div>

      {/* ── Modal Crear Capacitación ── */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nueva Capacitación"
        subtitle="Regístrala en el sistema"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className={tc.inputLabel}>Nombre *</label>
            <input
              type="text" name="nombre" value={form.nombre} onChange={handleChange}
              required className={tc.input} placeholder="Ej: Desarrollo en React"
            />
          </div>
          <div>
            <label className={tc.inputLabel}>Descripción</label>
            <textarea
              name="descripcion" value={form.descripcion} onChange={handleChange}
              className={`${tc.input} min-h-[80px] resize-y`} placeholder="Descripción de la capacitación"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={tc.inputLabel}>Instructor *</label>
              <input type="text" name="instructor" value={form.instructor} onChange={handleChange} required className={tc.input} placeholder="Nombre del instructor" />
            </div>
            <div>
              <label className={tc.inputLabel}>Duración *</label>
              <input type="text" name="duracion" value={form.duracion} onChange={handleChange} required className={tc.input} placeholder="Ej: 3 horas" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={tc.inputLabel}>Fecha *</label>
              <input type="date" name="fecha" value={form.fecha} onChange={handleChange} required className={tc.input} />
            </div>
            <div>
              <label className={tc.inputLabel}>Hora *</label>
              <input type="time" name="hora" value={form.hora} onChange={handleChange} required className={tc.input} />
            </div>
          </div>
          <div>
            <label className={tc.inputLabel}>Ubicación *</label>
            <input type="text" name="ubicacion" value={form.ubicacion} onChange={handleChange} required className={tc.input} placeholder="Ej: Sala de Capacitación" />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-light-border dark:border-codaini-border">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleCrear}>Crear</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Capacitaciones;
