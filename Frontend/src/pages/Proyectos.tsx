import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Eye, Users, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import { Proyecto, EstadoProyecto, Cliente, Trabajador } from '../types';
import { proyectosService, clientesService, trabajadoresService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import SearchBar from '../components/ui/SearchBar';
import Modal from '../components/ui/Modal';
import Loading from '../components/ui/Loading';
import { tc } from '../utils/themeClasses';
import { getSwalConfig } from '../utils/swalTheme';
import { useTheme } from '../context/ThemeContext';
import Swal from 'sweetalert2';

interface ProyectoForm {
  nombre: string;
  descripcion: string;
  clienteId: string;
  cliente: string;
  responsableId: string;
  responsable: string;
  fechaLimite: string;
  presupuesto: string;
}

const getEstadoBadge = (estado: EstadoProyecto): 'success' | 'info' | 'danger' | 'warning' => {
  switch (estado) {
    case 'Completado':  return 'success';
    case 'En progreso': return 'info';
    case 'Cancelado':   return 'danger';
    default:            return 'warning';
  }
};

const defaultForm: ProyectoForm = {
  nombre: '',
  descripcion: '',
  clienteId: '',
  cliente: '',
  responsableId: '',
  responsable: '',
  fechaLimite: '',
  presupuesto: '',
};

const Proyectos: React.FC = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const isAdmin = user?.rol === 'Administrador';

  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [clientesList, setClientesList] = useState<Cliente[]>([]);
  const [trabajadoresList, setTrabajadoresList] = useState<Trabajador[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [soloMisProyectos, setSoloMisProyectos] = useState(!isAdmin);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<ProyectoForm>(defaultForm);

  // Filtrado inteligente
  const filtered = useMemo(() => {
    return proyectos.filter(p => {
      const matchSearch =
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.cliente.toLowerCase().includes(searchTerm.toLowerCase());
      const matchMios = !soloMisProyectos ||
        p.responsableId === user?.id ||
        p.responsable?.toLowerCase().includes((user?.nombre ?? '').toLowerCase());
      const matchEstado = !filtroEstado || p.estado === filtroEstado;
      return matchSearch && matchMios && matchEstado;
    });
  }, [proyectos, searchTerm, soloMisProyectos, filtroEstado, user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [proyectosData, clientesData, trabajadoresData] = await Promise.allSettled([
          proyectosService.getAll(),
          clientesService.getAll(),
          trabajadoresService.getAll(),
        ]);

        if (proyectosData.status === 'fulfilled') {
          setProyectos(proyectosData.value);
        }
        if (clientesData.status === 'fulfilled') {
          setClientesList(clientesData.value);
        }
        if (trabajadoresData.status === 'fulfilled') {
          setTrabajadoresList(trabajadoresData.value);
        }
      } catch {
        setProyectos([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Eliminar el useEffect redundante de filtrado (ya usa useMemo)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'clienteId') {
      const selected = clientesList.find((c) => c.id === value);
      setForm((prev) => ({ ...prev, clienteId: value, cliente: selected ? selected.empresa : prev.cliente }));
    } else if (name === 'responsableId') {
      const selected = trabajadoresList.find((t) => t.id === value);
      setForm((prev) => ({ ...prev, responsableId: value, responsable: selected ? `${selected.nombre} ${selected.apellidos || ''}`.trim() : prev.responsable }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCrear = async () => {
    if (!form.nombre.trim() || !form.descripcion.trim()) {
      Swal.fire({
        ...getSwalConfig(isDark),
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Completa al menos el nombre y descripción del proyecto.',
      });
      return;
    }
    try {
      const payload: Partial<Proyecto> = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        clienteId: form.clienteId || undefined,
        cliente: form.cliente || (clientesList[0]?.empresa || 'Cliente General'),
        responsableId: form.responsableId || undefined,
        responsable: form.responsable || (trabajadoresList[0]?.nombre || 'Sin asignar'),
        estado: 'Pendiente' as EstadoProyecto,
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaLimite: form.fechaLimite || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        presupuesto: form.presupuesto ? Number(form.presupuesto) : undefined,
      };

      const nuevo = await proyectosService.create(payload);
      setProyectos((prev) => [nuevo, ...prev]);
      setModalOpen(false);
      setForm(defaultForm);
      Swal.fire({
        ...getSwalConfig(isDark),
        icon: 'success',
        title: 'Proyecto creado',
        text: `${nuevo.nombre} fue registrado exitosamente.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        ...getSwalConfig(isDark),
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear el proyecto en el servidor.',
      });
    }
  };

  if (isLoading) {
    return <Loading text="Cargando proyectos..." fullPage />;
  }

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className={`text-3xl font-bold ${tc.textHeading}`}>Proyectos</h1>
          <p className={`mt-1 ${tc.textMuted}`}>
            {soloMisProyectos ? 'Mis proyectos asignados' : 'Todos los proyectos'}
          </p>
        </div>
        {isAdmin && (
          <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
            Nuevo Proyecto
          </Button>
        )}
      </motion.div>

      {/* Panel métricas rápidas */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {[
          { label: 'Total', value: filtered.length, icon: <TrendingUp className="w-4 h-4" />, color: 'text-light-accent dark:text-codaini-cyan', bg: 'border-light-accent/30 dark:border-codaini-cyan/30' },
          { label: 'En progreso', value: filtered.filter(p => p.estado === 'En progreso').length, icon: <Clock className="w-4 h-4" />, color: 'text-blue-400', bg: 'border-blue-700/30' },
          { label: 'Completados', value: filtered.filter(p => p.estado === 'Completado').length, icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-emerald-400', bg: 'border-emerald-700/30' },
          { label: 'Equipo', value: trabajadoresList.length, icon: <Users className="w-4 h-4" />, color: 'text-purple-400', bg: 'border-purple-700/30' },
        ].map((m) => (
          <div key={m.label} className={`${tc.cardShadow} p-4 border ${m.bg}`}>
            <div className={`flex items-center gap-2 ${m.color} mb-1`}>
              {m.icon}
              <span className="text-xs font-semibold">{m.label}</span>
            </div>
            <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Filtros */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className={`${tc.cardShadow} p-4`}>
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
          <div className="flex-1 min-w-[200px]">
            <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar proyectos..." />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Filtro mis proyectos */}
            <button
              onClick={() => setSoloMisProyectos(!soloMisProyectos)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                soloMisProyectos
                  ? 'bg-light-accent/20 dark:bg-codaini-cyan/20 border-light-accent/40 dark:border-codaini-cyan/40 text-light-accent dark:text-codaini-cyan'
                  : `${tc.border} ${tc.surface2} ${tc.textMuted}`
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Mis proyectos
            </button>
            {/* Filtro estado */}
            <select
              value={filtroEstado}
              onChange={e => setFiltroEstado(e.target.value)}
              className={`${tc.input} !py-2 text-xs w-auto`}
            >
              <option value="">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En progreso">En progreso</option>
              <option value="Completado">Completado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Grid de proyectos */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        {filtered.length === 0 ? (
          <div className={`${tc.cardShadow} p-16 text-center`}>
            <TrendingUp className={`w-10 h-10 ${tc.textMuted} mx-auto mb-3`} />
            <p className={`text-sm ${tc.textMuted}`}>
              {soloMisProyectos ? 'No tienes proyectos asignados' : 'No se encontraron proyectos'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((proyecto) => (
              <motion.div key={proyecto.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -4 }}
                className={`${tc.card} p-6 hover:shadow-lg dark:hover:shadow-codaini transition-all duration-300 cursor-pointer`}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className={`font-bold text-base ${tc.textPrimary} flex-1 mr-2`}>{proyecto.nombre}</h3>
                  <Badge variant={getEstadoBadge(proyecto.estado)} dot>
                    {proyecto.estado}
                  </Badge>
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
        )}
      </motion.div>

      {/* ── Modal Nuevo Proyecto ── */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nuevo Proyecto"
        subtitle="Regístralo en el sistema"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className={tc.inputLabel}>Nombre *</label>
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required className={tc.input} placeholder="Nombre del proyecto" />
          </div>
          <div>
            <label className={tc.inputLabel}>Descripción *</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} required className={`${tc.input} min-h-[80px] resize-y`} placeholder="Descripción del proyecto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="proy-cliente" className={tc.inputLabel}>Cliente *</label>
              {clientesList.length > 0 ? (
                <select
                  id="proy-cliente"
                  name="clienteId"
                  value={form.clienteId}
                  onChange={handleChange}
                  className={tc.input}
                >
                  <option value="">-- Seleccionar Cliente --</option>
                  {clientesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.empresa} ({c.ruc})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id="proy-cliente"
                  type="text"
                  name="cliente"
                  value={form.cliente}
                  onChange={handleChange}
                  required
                  className={tc.input}
                  placeholder="Nombre del cliente"
                />
              )}
            </div>
            <div>
              <label htmlFor="proy-responsable" className={tc.inputLabel}>Responsable *</label>
              {trabajadoresList.length > 0 ? (
                <select
                  id="proy-responsable"
                  name="responsableId"
                  value={form.responsableId}
                  onChange={handleChange}
                  className={tc.input}
                >
                  <option value="">-- Seleccionar Responsable --</option>
                  {trabajadoresList.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre} {t.apellidos || ''} ({t.cargo || 'Trabajador'})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id="proy-responsable"
                  type="text"
                  name="responsable"
                  value={form.responsable}
                  onChange={handleChange}
                  required
                  className={tc.input}
                  placeholder="Nombre del responsable"
                />
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="proy-fechaLimite" className={tc.inputLabel}>Fecha Límite</label>
              <input
                id="proy-fechaLimite"
                type="date"
                name="fechaLimite"
                value={form.fechaLimite}
                onChange={handleChange}
                className={tc.input}
              />
            </div>
            <div>
              <label htmlFor="proy-presupuesto" className={tc.inputLabel}>Presupuesto (S/.)</label>
              <input
                id="proy-presupuesto"
                type="number"
                name="presupuesto"
                value={form.presupuesto}
                onChange={handleChange}
                className={tc.input}
                placeholder="Ej. 15000"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-light-border dark:border-codaini-border">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleCrear}>Crear Proyecto</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Proyectos;
