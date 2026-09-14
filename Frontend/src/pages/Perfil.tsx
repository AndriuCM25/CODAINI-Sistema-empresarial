import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Save, User, Mail, Phone, Briefcase, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Swal from 'sweetalert2';
import { getSwalConfig } from '../utils/swalTheme';
import { tc } from '../utils/themeClasses';

const Perfil: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { isDark } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    
    nombre:    user?.nombre    || '',
    apellidos: user?.apellidos || '',
    telefono:  user?.telefono  || '',
  });
  const [fotoPerfil, setFotoPerfil] = useState(user?.fotoPerfil || '');
  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];

  if (!file) return;

  // Validar que sea una imagen
  if (!file.type.startsWith('image/')) {
    Swal.fire({
      ...getSwalConfig(isDark),
      icon: 'error',
      title: 'Archivo no válido',
      text: 'Selecciona una imagen.',
    });
    return;
  }

  // Limitar tamaño a 2 MB
  if (file.size > 2 * 1024 * 1024) {
    Swal.fire({
      ...getSwalConfig(isDark),
      icon: 'error',
      title: 'Imagen demasiado grande',
      text: 'La imagen debe pesar menos de 2 MB.',
    });
    return;
  }

  const reader = new FileReader();

  reader.onloadend = () => {
    setFotoPerfil(reader.result as string);
  };

  reader.readAsDataURL(file);
};

const handleSave = () => {
  updateUser({
    ...formData,
    fotoPerfil: fotoPerfil,
  });
      // Guardar permanentemente en localStorage
    localStorage.setItem('user', JSON.stringify(updateUser));

    return updateUser;

  setIsEditing(false);

  Swal.fire({
    ...getSwalConfig(isDark),
    icon: 'success',
    title: 'Perfil actualizado',
    text: 'Tus datos han sido actualizados exitosamente',
    timer: 2000,
    showConfirmButton: false,
  });
};

  const fieldIcon = (icon: React.ReactNode) => (
    <span className="text-light-accent dark:text-codaini-cyan mr-2">{icon}</span>
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={`text-3xl font-bold ${tc.textHeading}`}>Mi Perfil</h1>
        <p className={`mt-1 ${tc.textMuted}`}>Información personal</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className={`${tc.cardShadow} p-8`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">

<div className="flex items-center space-x-5">

  {/* Avatar */}
  <div className="relative">
    <Avatar
      src={fotoPerfil}
      iniciales={user?.iniciales}
      size="xl"
      className="ring-4 ring-light-accent/20 dark:ring-codaini-cyan/20"
    />

    {/* Botón cambiar foto */}
    {isEditing && (
      <>
        <label
          htmlFor="fotoPerfil"
          className="
            absolute bottom-0 right-0
            w-9 h-9
            rounded-full
            bg-light-accent dark:bg-codaini-cyan
            text-white
            flex items-center justify-center
            cursor-pointer
            shadow-lg
            border-2 border-white dark:border-gray-800
            hover:scale-105
            transition-transform
          "
          title="Cambiar foto"
        >
          <Camera className="w-4 h-4" />
        </label>

        <input
          id="fotoPerfil"
          type="file"
          accept="image/*"
          onChange={handleFotoChange}
          className="hidden"
        />
      </>
    )}
  </div>

  {/* Información del usuario */}
  <div>
    <h2 className={`text-2xl font-bold ${tc.textPrimary}`}>
      {user?.nombre} {user?.apellidos}
    </h2>

    <p className="text-light-accent dark:text-codaini-cyan font-semibold mt-0.5">
      {user?.rol}
    </p>

    <p className={`text-sm mt-0.5 ${tc.textMuted}`}>
      CODAINI
    </p>
  </div>

</div>


          <Button
            variant={isEditing ? 'success' : 'secondary'}
            icon={isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
          >
            {isEditing ? 'Guardar' : 'Editar'}
          </Button>
        </div>

        {/* Fields */}
        <div className={`border-t ${tc.border} pt-6 grid grid-cols-1 md:grid-cols-2 gap-6`}>
          {/* Nombre */}
          <div>
            <label className={`${tc.inputLabel} flex items-center`}>
              {fieldIcon(<User className="w-4 h-4" />)} Nombre
            </label>
            {isEditing ? (
              <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className={tc.input} />
            ) : (
              <p className={`py-2 ${tc.textPrimary}`}>{user?.nombre}</p>
            )}
          </div>

          {/* Apellidos */}
          <div>
            <label className={`${tc.inputLabel} flex items-center`}>
              {fieldIcon(<User className="w-4 h-4" />)} Apellidos
            </label>
            {isEditing ? (
              <input type="text" value={formData.apellidos} onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                className={tc.input} />
            ) : (
              <p className={`py-2 ${tc.textPrimary}`}>{user?.apellidos}</p>
            )}
          </div>

          {/* Email (readonly) */}
          <div>
            <label className={`${tc.inputLabel} flex items-center`}>
              {fieldIcon(<Mail className="w-4 h-4" />)} Correo electrónico
            </label>
            <p className={`py-2 ${tc.textMuted}`}>{user?.email}</p>
          </div>

          {/* Teléfono */}
          <div>
            <label className={`${tc.inputLabel} flex items-center`}>
              {fieldIcon(<Phone className="w-4 h-4" />)} Teléfono
            </label>
            {isEditing ? (
              <input type="tel" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className={tc.input} />
            ) : (
              <p className={`py-2 ${tc.textPrimary}`}>{user?.telefono}</p>
            )}
          </div>

          {/* Rol (readonly) */}
          <div>
            <label className={`${tc.inputLabel} flex items-center`}>
              {fieldIcon(<Briefcase className="w-4 h-4" />)} Rol
            </label>
            <p className={`py-2 ${tc.textPrimary}`}>{user?.rol}</p>
          </div>

          {/* Fecha registro (readonly) */}
          <div>
            <label className={tc.inputLabel}>Fecha de Registro</label>
            <p className={`py-2 ${tc.textMuted}`}>
              {user?.fechaRegistro ? new Date(user.fechaRegistro).toLocaleDateString() : '—'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Perfil;
