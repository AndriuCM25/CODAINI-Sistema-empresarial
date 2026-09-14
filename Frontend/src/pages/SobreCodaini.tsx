import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  User,
  Calendar,
  Code2,
  Globe,
  Wrench,
  ShoppingCart,
  GraduationCap,
  LayoutDashboard,
  Mail,
  MapPin,
  Target,
  Eye,
  Info,
  FileText,
  Hash,
} from 'lucide-react';
import { tc } from '../utils/themeClasses';

const SobreCodaini: React.FC = () => {
  const servicios = [
    { icon: Code2,          label: 'Desarrollo de software' },
    { icon: Globe,          label: 'Desarrollo de sistemas web' },
    { icon: Wrench,         label: 'Servicios y soporte tecnológico' },
    { icon: ShoppingCart,   label: 'Comercialización de productos' },
    { icon: GraduationCap,  label: 'Capacitación tecnológica' },
    { icon: LayoutDashboard,label: 'Soluciones digitales para empresas' },
  ];

  const datosFila = [
    { icon: Building2, label: 'Nombre comercial',       value: 'CODAINI' },
    { icon: User,      label: 'Titular',                 value: 'Benjamín Infantes Salazar' },
    { icon: FileText,  label: 'Tipo de empresa',         value: 'Persona Natural con Negocio' },
    { icon: Calendar,  label: 'Inicio de actividades',   value: '04 de diciembre de 2006' },
    { icon: Code2,     label: 'Actividad principal',     value: 'Programación informática' },
    { icon: Hash,      label: 'CIIU principal',          value: '6201' },
    { icon: FileText,  label: 'Actividades secundarias', value: 'Venta minorista no especializada y enseñanza' },
    { icon: Hash,      label: 'CIIU secundarios',        value: '4719 y 8549' },
    { icon: Info,      label: 'Estado',                  value: 'Activo' },
    { icon: Info,      label: 'Condición',               value: 'Habido' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* ── Back + Título ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4">
        <Link
          to="/configuracion"
          className={`p-2 rounded-lg ${tc.navIconBtn} transition-colors`}
          aria-label="Volver"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className={`text-3xl font-bold ${tc.textHeading}`}>Sobre CODAINI</h1>
          <p className={`mt-0.5 text-sm ${tc.textMuted}`}>Información institucional de la empresa</p>
        </div>
      </motion.div>

      {/* ── Descripción general ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className={`${tc.cardShadow} p-6`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-light-accent/10 dark:bg-codaini-cyan/10">
            <Building2 className="w-5 h-5 text-light-accent dark:text-codaini-cyan" />
          </div>
          <h2 className={`text-xl font-bold ${tc.textPrimary}`}>¿Quiénes somos?</h2>
        </div>
        <p className={`leading-relaxed ${tc.textMuted}`}>
          CODAINI es una empresa orientada al sector tecnológico, dedicada al desarrollo de soluciones
          informáticas, servicios tecnológicos, comercialización de productos y capacitación. Desde el
          inicio de sus actividades, busca brindar soluciones adaptadas a las necesidades de sus clientes,
          utilizando herramientas y tecnologías que permitan mejorar sus procesos.
        </p>
      </motion.div>

      {/* ── Datos empresariales ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className={`${tc.cardShadow} p-6`}>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-light-accent/10 dark:bg-codaini-cyan/10">
            <FileText className="w-5 h-5 text-light-accent dark:text-codaini-cyan" />
          </div>
          <h2 className={`text-xl font-bold ${tc.textPrimary}`}>Datos Empresariales</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {datosFila.map(({ icon: Icon, label, value }) => (
            <div key={label}
              className={`flex items-start gap-3 p-3 rounded-lg ${tc.surface2}`}>
              <Icon className="w-4 h-4 text-light-accent dark:text-codaini-cyan mt-0.5 flex-shrink-0" />
              <div>
                <p className={`text-xs font-medium ${tc.textMuted}`}>{label}</p>
                <p className={`text-sm font-semibold ${tc.textPrimary}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Misión y Visión ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className={`${tc.cardShadow} p-6`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-light-accent/10 dark:bg-codaini-cyan/10">
              <Target className="w-5 h-5 text-light-accent dark:text-codaini-cyan" />
            </div>
            <h2 className={`text-lg font-bold ${tc.textPrimary}`}>Misión</h2>
          </div>
          <p className={`leading-relaxed text-sm ${tc.textMuted}`}>
            Brindar soluciones y servicios tecnológicos de calidad que permitan atender las necesidades
            de nuestros clientes, utilizando herramientas digitales y recursos tecnológicos de manera eficiente.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className={`${tc.cardShadow} p-6`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-light-accent/10 dark:bg-codaini-cyan/10">
              <Eye className="w-5 h-5 text-light-accent dark:text-codaini-cyan" />
            </div>
            <h2 className={`text-lg font-bold ${tc.textPrimary}`}>Visión</h2>
          </div>
          <p className={`leading-relaxed text-sm ${tc.textMuted}`}>
            Consolidarnos como una empresa tecnológica reconocida por ofrecer soluciones eficientes,
            innovadoras y confiables, fortaleciendo nuestros servicios de desarrollo, tecnología,
            comercialización y capacitación.
          </p>
        </motion.div>
      </div>

      {/* ── Servicios ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className={`${tc.cardShadow} p-6`}>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-light-accent/10 dark:bg-codaini-cyan/10">
            <LayoutDashboard className="w-5 h-5 text-light-accent dark:text-codaini-cyan" />
          </div>
          <h2 className={`text-xl font-bold ${tc.textPrimary}`}>Servicios</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {servicios.map(({ icon: Icon, label }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.28 + i * 0.05 }}
              className={`flex items-center gap-3 p-4 rounded-xl border ${tc.border} ${tc.surface2} group hover:border-light-accent dark:hover:border-codaini-cyan transition-colors`}
            >
              <div className="p-2 rounded-lg bg-light-accent/10 dark:bg-codaini-cyan/10 group-hover:bg-light-accent/20 dark:group-hover:bg-codaini-cyan/20 transition-colors flex-shrink-0">
                <Icon className="w-4 h-4 text-light-accent dark:text-codaini-cyan" />
              </div>
              <span className={`text-sm font-medium ${tc.textPrimary}`}>{label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Contacto ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className={`${tc.cardShadow} p-6`}>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-light-accent/10 dark:bg-codaini-cyan/10">
            <Mail className="w-5 h-5 text-light-accent dark:text-codaini-cyan" />
          </div>
          <h2 className={`text-xl font-bold ${tc.textPrimary}`}>Contacto</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`flex items-center gap-3 p-3 rounded-lg ${tc.surface2}`}>
            <Mail className="w-4 h-4 text-light-accent dark:text-codaini-cyan flex-shrink-0" />
            <div>
              <p className={`text-xs ${tc.textMuted}`}>Correo electrónico</p>
              <a href="mailto:codaini.admin@gmail.com"
                className="text-sm font-semibold text-light-accent dark:text-codaini-cyan hover:underline">
                codaini.admin@gmail.com
              </a>
            </div>
          </div>
          <div className={`flex items-center gap-3 p-3 rounded-lg ${tc.surface2}`}>
            <MapPin className="w-4 h-4 text-light-accent dark:text-codaini-cyan flex-shrink-0" />
            <div>
              <p className={`text-xs ${tc.textMuted}`}>Ubicación</p>
              <p className={`text-sm font-semibold ${tc.textPrimary}`}>Lima, Perú</p>
            </div>
          </div>
          <div className={`flex items-center gap-3 p-3 rounded-lg ${tc.surface2}`}>
            <Building2 className="w-4 h-4 text-light-accent dark:text-codaini-cyan flex-shrink-0" />
            <div>
              <p className={`text-xs ${tc.textMuted}`}>Empresa</p>
              <p className={`text-sm font-semibold ${tc.textPrimary}`}>CODAINI</p>
            </div>
          </div>
          <div className={`flex items-center gap-3 p-3 rounded-lg ${tc.surface2}`}>
            <User className="w-4 h-4 text-light-accent dark:text-codaini-cyan flex-shrink-0" />
            <div>
              <p className={`text-xs ${tc.textMuted}`}>Titular</p>
              <p className={`text-sm font-semibold ${tc.textPrimary}`}>Benjamín Infantes Salazar</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Mapa ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className={`${tc.cardShadow} p-6`}>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-light-accent/10 dark:bg-codaini-cyan/10">
            <MapPin className="w-5 h-5 text-light-accent dark:text-codaini-cyan" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${tc.textPrimary}`}>Ubicación</h2>
            <p className={`text-sm ${tc.textMuted}`}>Tenorio Gadea 296, San Martín de Porres 15103, Lima, Perú</p>
          </div>
        </div>
        <div className="rounded-xl overflow-hidden border border-light-border dark:border-codaini-border">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3902.4328606290874!2d-77.07514982842201!3d-12.013692841278708!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105ceeec8578071%3A0xab637440a159bbbd!2sTenorio%20Gadea%20296%2C%20San%20Mart%C3%ADn%20de%20Porres%2015103!5e0!3m2!1ses!2spe!4v1789402514629!5m2!1ses!2spe"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Ubicación CODAINI — Tenorio Gadea 296, San Martín de Porres, Lima"
            className="block"
          />
        </div>
      </motion.div>

    </div>
  );
};

export default SobreCodaini;
