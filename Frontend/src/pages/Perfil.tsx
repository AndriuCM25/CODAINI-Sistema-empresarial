import React, { useState, useRef } from 'react';
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
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [pendingBase64, setPendingBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    nombre:    user?.nombre    || '',
    apellidos: user?.apellidos || '',
    telefono:  user?.telefono  || '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      Swal.fire({ ...getSwalConfig(isDark), icon: 'error', title: 'Archivo inválido', text: 'Solo se permiten imágenes.', timer: 2000, showConfirmButton: false });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({ ...getSwalConfig(isDark), icon: 'warning', title: 'Imagen muy grande', text: 'Máximo 2 MB.', timer: 2000, showConfirmButton: false });
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewImg(objectUrl);

    const reader = new FileReader();
    reader.onload = (ev) => {
      setPendingBase64(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const payload: Record<string, string> = { ...formData };
    if (pendingBase64) {
      payload.fotoPerfil = pendingBase64;
    }
    await updateUser(payload);
    setIsEditing(false);
    setPreviewImg(null);
    setPendingBase64(null);
    Swal.fire({
      ...getSwalConfig(isDark),
      icon: 'success',
      title: 'Perfil actualizado',
      text: 'Tus datos han sido actualizados exitosamente',
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewImg(null);
    setPendingBase64(null);
    setFormData({
      nombre:    user?.nombre    || '',
      apellidos: user?.apellidos || '',
      telefono:  user?.telefono  || '',
    });
  };

  const currentPhoto = previewImg || user?.fotoPerfil;

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
            {/* Avatar con botón de cámara */}
            <div className="relative group">
              {currentPhoto ? (
                <img
                  src={currentPhoto}
                  alt="Foto de perfil"
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-light-accent/20 dark:ring-codaini-cyan/20"
                />
              ) : (
                <Avatar
                  src={undefined}
                  iniciales={user?.iniciales}
                  size="xl"
                  className="ring-4 ring-light-accent/20 dark:ring-codaini-cyan/20"
                />
              )}

              {/* Overlay cámara */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center rounded-full
                           bg-black/0 group-hover:bg-black/50 transition-all duration-200 cursor-pointer"
                title="Cambiar foto de perfil"
              >
                <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Indicador de nueva foto */}
              {previewImg && (
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-light-accent dark:bg-codaini-cyan rounded-full flex items-center justify-center">
                  <Camera className="w-3 h-3 text-white dark:text-codaini-navy" />
                </span>
              )}
            </div>

            <div>
              <h2 className={`text-2xl font-bold ${tc.textPrimary}`}>
                {user?.nombre} {user?.apellidos}
              </h2>
              <p className="text-light-accent dark:text-codaini-cyan font-semibold mt-0.5">{user?.rol}</p>
              <p className={`text-xs mt-1 ${tc.textMuted}`}>Haz clic en la foto para cambiarla</p>
            </div>
          </div>

          <div className="flex gap-2">
            {isEditing && (
              <Button variant="secondary" onClick={handleCancel}>Cancelar</Button>
            )}
            <Button
              variant={isEditing ? 'success' : 'secondary'}
              icon={isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
            >
              {isEditing ? 'Guardar' : 'Editar'}
            </Button>
          </div>
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
              {user?.fechaRegistro ? new Date(user.fechaRegistro).toLocaleDateString('es-PE') : '—'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Perfil;
