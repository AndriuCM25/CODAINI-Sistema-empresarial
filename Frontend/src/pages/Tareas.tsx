import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { Tarea, Prioridad, EstadoTarea, Proyecto, Trabajador } from '../types';
import { tareasService, proyectosService, trabajadoresService } from '../services/api';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import SearchBar from '../components/ui/SearchBar';
import DataTable from '../components/tables/DataTable';
import Modal from '../components/ui/Modal';
import Loading from '../components/ui/Loading';
import { tc } from '../utils/themeClasses';
import { getSwalConfig } from '../utils/swalTheme';
import { useTheme } from '../context/ThemeContext';
import Swal from 'sweetalert2';

interface TareaForm {
  titulo: string;
  descripcion: string;
  proyectoId: string;
  proyecto: string;
  responsableId: string;
  responsable: string;
  prioridad: Prioridad;
  fechaLimite: string;
}

const prioridadOpciones: Prioridad[] = ['Alta', 'Media', 'Baja'];

const defaultForm: TareaForm = {
  titulo: '',
  descripcion: '',
  proyectoId: '',
  proyecto: '',
  responsableId: '',
  responsable: '',
  prioridad: 'Media',
  fechaLimite: '',
};

const Tareas: React.FC = () => {
  const { isDark } = useTheme();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [proyectosList, setProyectosList] = useState<Proyecto[]>([]);
  const [trabajadoresList, setTrabajadoresList] = useState<Trabajador[]>([]);
  const [filtered, setFiltered] = useState<Tarea[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<TareaForm>(defaultForm);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tareasData, proyData, trabData] = await Promise.allSettled([
          tareasService.getAll(),
          proyectosService.getAll(),
          trabajadoresService.getAll(),
        ]);

        if (tareasData.status === 'fulfilled') {
          setTareas(tareasData.value);
          setFiltered(tareasData.value);
        }
        if (proyData.status === 'fulfilled') {
          setProyectosList(proyData.value);
        }
        if (trabData.status === 'fulfilled') {
          setTrabajadoresList(trabData.value);
        }
      } catch {
        setTareas([]);
        setFiltered([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = tareas.filter(
      (t) =>
        t.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.proyecto.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(filtered);
  }, [searchTerm, tareas]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'proyectoId') {
      const selected = proyectosList.find((p) => p.id === value);
      setForm((prev) => ({ ...prev, proyectoId: value, proyecto: selected ? selected.nombre : prev.proyecto }));
    } else if (name === 'responsableId') {
      const selected = trabajadoresList.find((t) => t.id === value);
      setForm((prev) => ({ ...prev, responsableId: value, responsable: selected ? `${selected.nombre} ${selected.apellidos || ''}`.trim() : prev.responsable }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCrear = async () => {
    if (!form.titulo.trim() || !form.descripcion.trim() || !form.fechaLimite) {
      Swal.fire({
        ...getSwalConfig(isDark),
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Completa el título, descripción y fecha límite.',
      });
      return;
    }
    try {
      const payload: Partial<Tarea> = {
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        proyectoId: form.proyectoId || (proyectosList[0]?.id || undefined),
        proyecto: form.proyecto || (proyectosList[0]?.nombre || 'Proyecto General'),
        responsableId: form.responsableId || (trabajadoresList[0]?.id || undefined),
        responsable: form.responsable || (trabajadoresList[0]?.nombre || 'Sin asignar'),
        prioridad: form.prioridad,
        fechaLimite: form.fechaLimite,
        estado: 'Pendiente' as EstadoTarea,
      };

      const nueva = await tareasService.create(payload);
      setTareas((prev) => [nueva, ...prev]);
      setFiltered((prev) => [nueva, ...prev]);
      setModalOpen(false);
      setForm(defaultForm);
      Swal.fire({
        ...getSwalConfig(isDark),
        icon: 'success',
        title: 'Tarea creada',
        text: `La tarea "${nueva.titulo}" fue registrada exitosamente.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        ...getSwalConfig(isDark),
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear la tarea en el servidor.',
      });
    }
  };

  const handleUpdateEstado = async (tarea: Tarea, nuevoEstado: EstadoTarea) => {
    try {
      const updated = await tareasService.update(tarea.id, { estado: nuevoEstado });
      const replace = (arr: Tarea[]) => arr.map((t) => (t.id === tarea.id ? updated : t));
      setTareas(replace);
      setFiltered(replace);
    } catch {
      Swal.fire({
        ...getSwalConfig(isDark),
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar la tarea.',
      });
    }
  };

  const handleDelete = async (tarea: Tarea) => {
    const result = await Swal.fire({
      ...getSwalConfig(isDark),
      title: '¿Eliminar tarea?',
      text: `Se eliminará permanentemente "${tarea.titulo}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await tareasService.delete(tarea.id);
        const remove = (arr: Tarea[]) => arr.filter((t) => t.id !== tarea.id);
        setTareas(remove);
        setFiltered(remove);
        Swal.fire({
          ...getSwalConfig(isDark),
          icon: 'success',
          title: 'Eliminada',
          text: 'La tarea ha sido eliminada.',
          timer: 1800,
          showConfirmButton: false,
        });
      } catch {
        Swal.fire({
          ...getSwalConfig(isDark),
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la tarea.',
        });
      }
    }
  };

  const columns = [
    { header: 'Tarea',          accessor: 'titulo'      as keyof Tarea },
    { header: 'Proyecto',       accessor: 'proyecto'    as keyof Tarea },
    { header: 'Responsable',    accessor: 'responsable' as keyof Tarea },
    {
      header: 'Prioridad',
      accessor: (t: Tarea) => (
        <Badge variant={t.prioridad === 'Alta' ? 'danger' : t.prioridad === 'Media' ? 'warning' : 'info'} dot>
          {t.prioridad}
        </Badge>
      ),
    },
    {
      header: 'Estado',
      accessor: (t: Tarea) => (
        <Badge variant={t.estado === 'Completada' ? 'success' : t.estado === 'En progreso' ? 'info' : 'warning'} dot>
          {t.estado}
        </Badge>
      ),
    },
    {
      header: 'Fecha Límite',
      accessor: (t: Tarea) => new Date(t.fechaLimite).toLocaleDateString(),
    },
    {
      header: 'Acciones',
      accessor: (t: Tarea) => (
        <div className="flex items-center gap-2">
          <select
            value={t.estado}
            onChange={(e) => void handleUpdateEstado(t, e.target.value as EstadoTarea)}
            className={`text-xs rounded-lg px-2 py-1 border transition-colors outline-none cursor-pointer ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En progreso">En progreso</option>
            <option value="Completada">Completada</option>
          </select>
          <button
            onClick={() => void handleDelete(t)}
            title="Eliminar tarea"
            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <Loading text="Cargando tareas..." fullPage />;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${tc.textHeading}`}>Tareas</h1>
          <p className={`mt-1 ${tc.textMuted}`}>Gestión de tareas</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
          Nueva Tarea
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className={`${tc.cardShadow} p-6`}>
        <div className="mb-5">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar tareas..." />
        </div>
        <DataTable columns={columns} data={filtered} />
      </motion.div>

      {/* ── Modal Nueva Tarea ── */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nueva Tarea"
        subtitle="Regístrala en el sistema"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className={tc.inputLabel}>Título *</label>
            <input type="text" name="titulo" value={form.titulo} onChange={handleChange} required className={tc.input} placeholder="Título de la tarea" />
          </div>
          <div>
            <label className={tc.inputLabel}>Descripción *</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} required className={`${tc.input} min-h-[80px] resize-y`} placeholder="Descripción" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tar-proyecto" className={tc.inputLabel}>Proyecto *</label>
              {proyectosList.length > 0 ? (
                <select
                  id="tar-proyecto"
                  name="proyectoId"
                  value={form.proyectoId}
                  onChange={handleChange}
                  className={tc.input}
                >
                  <option value="">-- Seleccionar Proyecto --</option>
                  {proyectosList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id="tar-proyecto"
                  type="text"
                  name="proyecto"
                  value={form.proyecto}
                  onChange={handleChange}
                  required
                  className={tc.input}
                  placeholder="Nombre del proyecto"
                />
              )}
            </div>
            <div>
              <label htmlFor="tar-responsable" className={tc.inputLabel}>Asignar Responsable</label>
              {trabajadoresList.length > 0 ? (
                <select
                  id="tar-responsable"
                  name="responsableId"
                  value={form.responsableId}
                  onChange={handleChange}
                  className={tc.input}
                >
                  <option value="">-- Seleccionar Trabajador --</option>
                  {trabajadoresList.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre} {t.apellidos || ''} ({t.cargo || 'Trabajador'})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id="tar-responsable"
                  type="text"
                  name="responsable"
                  value={form.responsable}
                  onChange={handleChange}
                  className={tc.input}
                  placeholder="Responsable asignado"
                />
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tar-prioridad" className={tc.inputLabel}>Prioridad</label>
              <select id="tar-prioridad" name="prioridad" value={form.prioridad} onChange={handleChange} className={tc.input}>
                {prioridadOpciones.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="tar-fechalimite" className={tc.inputLabel}>Fecha límite *</label>
              <input id="tar-fechalimite" type="date" name="fechaLimite" value={form.fechaLimite} onChange={handleChange} required className={tc.input} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-light-border dark:border-codaini-border">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleCrear}>Crear Tarea</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Tareas;
