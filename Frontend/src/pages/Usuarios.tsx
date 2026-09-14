import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { mockUsuarios, generarIniciales } from '../data/mockData';
import { Usuario, RolType } from '../types';
import Badge from '../components/ui/Badge';
import SearchBar from '../components/ui/SearchBar';
import Avatar from '../components/ui/Avatar';
import DataTable from '../components/tables/DataTable';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { tc } from '../utils/themeClasses';
import { useTheme } from '../context/ThemeContext';
import {
  UserPlus, User, Mail, Phone, Lock, Eye, EyeOff,
  HardHat, Building2, Shield,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { getSwalConfig } from '../utils/swalTheme';

interface NuevoUsuarioForm {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  password: string;
  confirmarPassword: string;
  rol: RolType | '';
  cargo: string;
  area: string;
}

const rolOpciones: { valor: RolType; label: string; icon: React.ReactNode; desc: string }[] = [
  { valor: 'Administrador', label: 'Administrador', icon: <Shield className="w-5 h-5" />,   desc: 'Acceso total al sistema' },
  { valor: 'Trabajador',    label: 'Trabajador',    icon: <HardHat className="w-5 h-5" />,   desc: 'Proyectos, tareas y asistencia' },
  { valor: 'Usuario',       label: 'Usuario / Cliente', icon: <Building2 className="w-5 h-5" />, desc: 'Solo vista de sus proyectos' },
];

const defaultForm: NuevoUsuarioForm = {
  nombre: '', apellidos: '', email: '', telefono: '',
  password: '', confirmarPassword: '', rol: '',
  cargo: '', area: '',
};

const Usuarios: React.FC = () => {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm]   = useState('');
  const [modalOpen, setModalOpen]     = useState(false);
  const [form, setForm]               = useState<NuevoUsuarioForm>(defaultForm);
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [usuarios, setUsuarios]       = useState<Usuario[]>(mockUsuarios);

  /* ── Filtro de búsqueda ─────────────────────────────────────── */
  const filtered = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ── Cambios en el formulario ───────────────────────────────── */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleRol = (rol: RolType) => setForm((prev) => ({ ...prev, rol }));

  /* ── Validación y creación ──────────────────────────────────── */
  const handleCrear = () => {
    const cfg = getSwalConfig(isDark);

    if (!form.nombre.trim() || !form.apellidos.trim()) {
      return Swal.fire({ ...cfg, icon: 'warning', title: 'Nombre requerido', text: 'Ingresa nombre y apellidos.' });
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return Swal.fire({ ...cfg, icon: 'warning', title: 'Email inválido', text: 'Ingresa un correo electrónico válido.' });
    }
    if (usuarios.some((u) => u.email === form.email)) {
      return Swal.fire({ ...cfg, icon: 'error', title: 'Email en uso', text: 'Ya existe un usuario con ese correo.' });
    }
    if (!form.rol) {
      return Swal.fire({ ...cfg, icon: 'warning', title: 'Rol requerido', text: 'Selecciona un rol para el usuario.' });
    }
    if (form.password.length < 6) {
      return Swal.fire({ ...cfg, icon: 'warning', title: 'Contraseña corta', text: 'La contraseña debe tener al menos 6 caracteres.' });
    }
    if (form.password !== form.confirmarPassword) {
      return Swal.fire({ ...cfg, icon: 'error', title: 'Contraseñas no coinciden', text: 'Verifica que ambas contraseñas sean iguales.' });
    }

    const nuevo: Usuario = {
      id:             String(Date.now()),
      nombre:         form.nombre.trim(),
      apellidos:      form.apellidos.trim(),
      email:          form.email.trim().toLowerCase(),
      password:       form.password,
      telefono:       form.telefono.trim(),
      rol:            form.rol as RolType,
      iniciales:      generarIniciales(form.nombre, form.apellidos),
      estado:         'Activo',
      fechaRegistro:  new Date().toISOString().split('T')[0],
    };

    // Persistir en localStorage para que el login lo reconozca
    const stored = localStorage.getItem('registeredUsers');
    const registrados: Usuario[] = stored ? JSON.parse(stored) : [];
    registrados.push(nuevo);
    localStorage.setItem('registeredUsers', JSON.stringify(registrados));

    setUsuarios((prev) => [...prev, nuevo]);
    setModalOpen(false);
    setForm(defaultForm);

    Swal.fire({
      ...getSwalConfig(isDark),
      icon: 'success',
      title: 'Usuario creado',
      text: `${nuevo.nombre} ${nuevo.apellidos} fue registrado exitosamente.`,
      timer: 2500,
      showConfirmButton: false,
    });
  };

  /* ── Columnas de la tabla ───────────────────────────────────── */
  const columns = [
    {
      header: 'Usuario',
      accessor: (u: Usuario) => (
        <div className="flex items-center space-x-3">
          <Avatar src={u.fotoPerfil} iniciales={u.iniciales} size="sm" />
          <div>
            <p className={`font-medium text-sm ${tc.textPrimary}`}>{u.nombre} {u.apellidos}</p>
            <p className={`text-xs ${tc.textMuted}`}>{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Rol',
      accessor: (u: Usuario) => (
        <Badge variant={u.rol === 'Administrador' ? 'success' : u.rol === 'Trabajador' ? 'info' : 'default'}>
          {u.rol}
        </Badge>
      ),
    },
    { header: 'Teléfono', accessor: 'telefono' as keyof Usuario },
    {
      header: 'Estado',
      accessor: (u: Usuario) => (
        <Badge variant={u.estado === 'Activo' ? 'success' : 'danger'} dot>{u.estado}</Badge>
      ),
    },
    {
      header: 'Fecha Registro',
      accessor: (u: Usuario) => new Date(u.fechaRegistro).toLocaleDateString(),
    },
  ];

  /* ── Helper de input con ícono ──────────────────────────────── */
  const InputField = ({
    name, label, type = 'text', placeholder, icon: Icon, required = true,
    right,
  }: {
    name: keyof NuevoUsuarioForm; label: string; type?: string;
    placeholder?: string; icon: React.ElementType; required?: boolean;
    right?: React.ReactNode;
  }) => (
    <div>
      <label className={tc.inputLabel}>{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className={`w-4 h-4 ${tc.textMuted}`} />
        </div>
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`${tc.input} pl-9 ${right ? 'pr-10' : ''}`}
        />
        {right && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">{right}</div>
        )}
      </div>
    </div>
  );

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${tc.textHeading}`}>Usuarios</h1>
          <p className={`mt-1 ${tc.textMuted}`}>Gestión de usuarios del sistema</p>
        </div>
        <Button
          variant="primary"
          icon={<UserPlus className="w-4 h-4" />}
          onClick={() => setModalOpen(true)}
        >
          Nuevo Usuario
        </Button>
      </motion.div>

      {/* Tabla */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }} className={`${tc.cardShadow} p-6`}>
        <div className="mb-5">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar por nombre o email..." />
        </div>
        <DataTable columns={columns} data={filtered} />
      </motion.div>

      {/* ── Modal Crear Usuario ─────────────────────────────────── */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setForm(defaultForm); }}
        title="Crear Nuevo Usuario"
        subtitle="El usuario podrá iniciar sesión con las credenciales que asignes"
        size="lg"
      >
        <div className="space-y-5">

          {/* Selección de Rol */}
          <div>
            <label className={`${tc.inputLabel} mb-2 block`}>
              Rol del usuario <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {rolOpciones.map(({ valor, label, icon, desc }) => (
                <button
                  key={valor}
                  type="button"
                  onClick={() => handleRol(valor)}
                  className={`
                    flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-sm
                    font-semibold transition-all duration-200
                    ${form.rol === valor
                      ? 'border-light-accent dark:border-codaini-cyan bg-light-accent/10 dark:bg-codaini-cyan/10 text-light-accent dark:text-codaini-cyan'
                      : `${tc.border} ${tc.textMuted} ${tc.hoverSurface} hover:border-light-accent/50 dark:hover:border-codaini-cyan/50`
                    }
                  `}
                >
                  <span className="text-light-accent dark:text-codaini-cyan">{icon}</span>
                  <span className="leading-tight text-center">{label}</span>
                  <span className={`text-xs font-normal ${tc.textMuted} leading-tight text-center`}>{desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Nombre y Apellidos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField name="nombre"    label="Nombre"    placeholder="Juan"         icon={User} />
            <InputField name="apellidos" label="Apellidos" placeholder="Pérez García"  icon={User} required={false} />
          </div>

          {/* Email y Teléfono */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField name="email"    label="Correo electrónico" type="email" placeholder="usuario@correo.com" icon={Mail} />
            <InputField name="telefono" label="Teléfono" placeholder="+51 999 999 999" icon={Phone} required={false} />
          </div>

          {/* Cargo y Área (solo Trabajador) */}
          {form.rol === 'Trabajador' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField name="cargo" label="Cargo"  placeholder="Ej: Desarrollador"  icon={HardHat} required={false} />
              <InputField name="area"  label="Área"   placeholder="Ej: Tecnología"      icon={HardHat} required={false} />
            </div>
          )}

          {/* Contraseñas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              name="password" label="Contraseña" type={showPass ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres" icon={Lock}
              right={
                <button type="button" onClick={() => setShowPass((p) => !p)}
                  className={tc.textMuted}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
            <InputField
              name="confirmarPassword" label="Confirmar contraseña"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repite la contraseña" icon={Lock}
              right={
                <button type="button" onClick={() => setShowConfirm((p) => !p)}
                  className={tc.textMuted}>
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-2 border-t border-light-border dark:border-codaini-border">
            <Button variant="secondary" onClick={() => { setModalOpen(false); setForm(defaultForm); }}>
              Cancelar
            </Button>
            <Button variant="primary" icon={<UserPlus className="w-4 h-4" />} onClick={handleCrear}>
              Crear Usuario
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Usuarios;
