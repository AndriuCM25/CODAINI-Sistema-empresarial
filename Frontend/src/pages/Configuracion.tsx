import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, User, Bell, Shield, Database, Globe, ChevronRight } from 'lucide-react';
import { tc } from '../utils/themeClasses';

const Configuracion: React.FC = () => {
  const configItems = [
    {
      icon: User,
      title: 'Perfil Personal',
      desc: 'Editar nombre, foto y datos de contacto',
      link: '/perfil',
    },
    {
      icon: Bell,
      title: 'Notificaciones',
      desc: 'Preferencias y frecuencia de alertas',
      link: null,
    },
    {
      icon: Shield,
      title: 'Seguridad',
      desc: 'Contraseña, privacidad y acceso a la cuenta',
      link: null,
    },
    {
      icon: Database,
      title: 'Datos y Exportación',
      desc: 'Gestión de datos y copias de seguridad',
      link: null,
    },
    {
      icon: Globe,
      title: 'Idioma y Región',
      desc: 'Zona horaria, idioma y formato de fechas',
      link: null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={`text-3xl font-bold ${tc.textHeading}`}>Configuración</h1>
        <p className={`mt-1 ${tc.textMuted}`}>Ajustes del sistema y preferencias</p>
      </motion.div>

      {/* Tarjeta destacada — Sobre CODAINI */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Link to="/sobre-codaini">
          <div className={`${tc.cardShadow} p-6 hover:shadow-lg dark:hover:shadow-codaini-lg transition-all duration-300 group cursor-pointer border-light-accent/30 dark:border-codaini-cyan/30`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-light-accent/10 dark:bg-codaini-cyan/10 rounded-xl group-hover:bg-light-accent/20 dark:group-hover:bg-codaini-cyan/20 transition-colors">
                  <Building2 className="w-6 h-6 text-light-accent dark:text-codaini-cyan" />
                </div>
                <div>
                  <h3 className={`font-bold text-base ${tc.textPrimary}`}>Sobre CODAINI</h3>
                  <p className={`text-sm mt-0.5 ${tc.textMuted}`}>
                    Información institucional, misión, visión, servicios y ubicación
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-light-accent dark:text-codaini-cyan opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Grid de otras configuraciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {configItems.map((item, index) => {
          const CardContent = (
            <div className={`${tc.card} p-5 hover:shadow-md dark:hover:shadow-codaini transition-all duration-300 ${item.link ? 'cursor-pointer' : 'cursor-default'} group h-full`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-light-accent/10 dark:bg-codaini-cyan/10 rounded-xl group-hover:bg-light-accent/20 dark:group-hover:bg-codaini-cyan/20 transition-colors flex-shrink-0">
                    <item.icon className="w-5 h-5 text-light-accent dark:text-codaini-cyan" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${tc.textPrimary}`}>{item.title}</h3>
                    <p className={`text-sm mt-0.5 ${tc.textMuted}`}>{item.desc}</p>
                  </div>
                </div>
                {item.link
                  ? <ChevronRight className="w-4 h-4 text-light-muted dark:text-codaini-muted opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  : <span className={`text-xs px-2 py-0.5 rounded-full ${tc.surface2} ${tc.textMuted} flex-shrink-0`}>Pronto</span>
                }
              </div>
            </div>
          );

          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              {item.link ? (
                <Link to={item.link} className="block h-full">{CardContent}</Link>
              ) : (
                CardContent
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className={`${tc.surface2} rounded-xl p-4 flex items-center gap-3 border ${tc.border}`}
      >
        <span className="w-2 h-2 rounded-full bg-light-accent dark:bg-codaini-cyan animate-pulse flex-shrink-0" />
        <p className={`text-sm ${tc.textMuted}`}>
          Más configuraciones disponibles al conectar con el{' '}
          <span className="font-semibold text-light-accent dark:text-codaini-cyan">
            backend PHP + Supabase
          </span>.
        </p>
      </motion.div>
    </div>
  );
};

export default Configuracion;
