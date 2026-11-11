import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Proyecto, EstadoProyecto, Cliente, Trabajador } from '../types';
import { proyectosService, clientesService, trabajadoresService } from '../services/api';
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
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [clientesList, setClientesList] = useState<Cliente[]>([]);
  const [trabajadoresList, setTrabajadoresList] = useState<Trabajador[]>([]);
  const [filtered, setFiltered] = useState<Proyecto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<ProyectoForm>(defaultForm);

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
          setFiltered(proyectosData.value);
        }
        if (clientesData.status === 'fulfilled') {
          setClientesList(clientesData.value);
        }
        if (trabajadoresData.status === 'fulfilled') {
          setTrabajadoresList(trabajadoresData.value);
        }
      } catch {
        setProyectos([]);
        setFiltered([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = proyectos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.cliente.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(filtered);
  }, [searchTerm, proyectos]);

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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${tc.textHeading}`}>Proyectos</h1>
          <p className={`mt-1 ${tc.textMuted}`}>Gestión de proyectos</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
          Nuevo Proyecto
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className={`${tc.cardShadow} p-6`}>
        <div className="mb-6">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar proyectos..." />
        </div>

        {filtered.length === 0 ? (
          <div className={`text-center py-16 ${tc.textMuted}`}>
            <p className="text-sm">No se encontraron proyectos</p>
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
