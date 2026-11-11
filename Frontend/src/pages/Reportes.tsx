import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FileText, Download } from 'lucide-react';
import Button from '../components/ui/Button';
import Swal from 'sweetalert2';
import { useTheme } from '../context/ThemeContext';
import { getSwalSuccessConfig } from '../utils/swalTheme';
import { tc, getChartColors } from '../utils/themeClasses';
import { ChartTooltipProps } from '../types';
import { proyectosService, tareasService, asistenciasService, clientesService } from '../services/api';

const Reportes: React.FC = () => {
  const { isDark } = useTheme();
  const chart = getChartColors(isDark);

  const dataMensual = [
    { mes: 'Ene', proyectos: 4,  tareas: 12 },
    { mes: 'Feb', proyectos: 3,  tareas: 15 },
    { mes: 'Mar', proyectos: 6,  tareas: 18 },
    { mes: 'Abr', proyectos: 8,  tareas: 22 },
    { mes: 'May', proyectos: 5,  tareas: 20 },
    { mes: 'Jun', proyectos: 9,  tareas: 25 },
  ];

  const triggerCsvDownload = (filename: string, csvContent: string) => {
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleDownload = async (tipo: string) => {
    const dateStr = new Date().toISOString().split('T')[0];
    try {
      if (tipo === 'Proyectos') {
        const data = await proyectosService.getAll();
        const header = 'ID,Nombre,Cliente,Responsable,Estado,Progreso,Fecha Inicio,Fecha Limite,Presupuesto\n';
        const rows = data.map((p) =>
          `"${p.id}","${p.nombre.replace(/"/g, '""')}","${p.cliente}","${p.responsable}","${p.estado}","${p.progreso}%","${p.fechaInicio}","${p.fechaLimite}","${p.presupuesto || 0}"`
        ).join('\n');
        triggerCsvDownload(`reporte_proyectos_${dateStr}.csv`, header + rows);
      } else if (tipo === 'Tareas') {
        const data = await tareasService.getAll();
        const header = 'ID,Titulo,Proyecto,Responsable,Prioridad,Estado,Fecha Limite\n';
        const rows = data.map((t) =>
          `"${t.id}","${t.titulo.replace(/"/g, '""')}","${t.proyecto}","${t.responsable}","${t.prioridad}","${t.estado}","${t.fechaLimite}"`
        ).join('\n');
        triggerCsvDownload(`reporte_tareas_${dateStr}.csv`, header + rows);
      } else if (tipo === 'Asistencias') {
        const data = await asistenciasService.getAll();
        const header = 'ID,Trabajador,Fecha,Hora Entrada,Hora Salida,Estado\n';
        const rows = data.map((a) =>
          `"${a.id}","${a.trabajador}","${a.fecha}","${a.horaEntrada}","${a.horaSalida || ''}","${a.estado}"`
        ).join('\n');
        triggerCsvDownload(`reporte_asistencias_${dateStr}.csv`, header + rows);
      } else if (tipo === 'Clientes') {
        const data = await clientesService.getAll();
        const header = 'ID,Empresa,RUC,Contacto,Email,Telefono,Estado\n';
        const rows = data.map((c) =>
          `"${c.id}","${c.empresa.replace(/"/g, '""')}","${c.ruc}","${c.contacto}","${c.email}","${c.telefono}","${c.estado}"`
        ).join('\n');
        triggerCsvDownload(`reporte_clientes_${dateStr}.csv`, header + rows);
      }

      Swal.fire({
        ...getSwalSuccessConfig(isDark),
        title: 'Reporte generado',
        text: `El reporte de ${tipo} ha sido descargado exitosamente.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        ...getSwalSuccessConfig(isDark),
        icon: 'error',
        title: 'Error',
        text: `No se pudo exportar el reporte de ${tipo}.`,
      });
    }
  };

  const CustomTooltip: React.FC<ChartTooltipProps> = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className={`${tc.card} p-3 text-sm`}>
          <p className={`font-semibold ${tc.textPrimary} mb-1`}>{label}</p>
          {payload.map((p, i: number) => (
            <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={`text-3xl font-bold ${tc.textHeading}`}>Reportes</h1>
        <p className={`mt-1 ${tc.textMuted}`}>Generación y descarga de reportes</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {['Proyectos', 'Tareas', 'Asistencias', 'Clientes'].map((tipo, index) => (
          <motion.div key={tipo} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${tc.card} p-6 hover:shadow-md dark:hover:shadow-codaini transition-all`}>
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-3 rounded-xl bg-light-accent/10 dark:bg-codaini-cyan/10">
                <FileText className="w-6 h-6 text-light-accent dark:text-codaini-cyan" />
              </div>
              <h3 className={`font-bold text-lg ${tc.textPrimary}`}>Reporte de {tipo}</h3>
            </div>
            <p className={`text-sm ${tc.textMuted} mb-5`}>
              Generar reporte detallado de {tipo.toLowerCase()} con estadísticas completas
            </p>
            <Button variant="primary" icon={<Download className="w-4 h-4" />}
              onClick={() => handleDownload(tipo)} className="w-full">
              Descargar Reporte
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Gráfico estadísticas */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className={`${tc.cardShadow} p-6`}>
        <h3 className={`text-lg font-bold ${tc.textHeading} mb-6`}>Estadísticas Mensuales</h3>
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={dataMensual} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
            <XAxis dataKey="mes" tick={{ fill: chart.axis }} axisLine={{ stroke: chart.grid }} />
            <YAxis tick={{ fill: chart.axis }} axisLine={{ stroke: chart.grid }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: chart.axis }} />
            <Bar dataKey="proyectos" fill={chart.primary}   name="Proyectos" radius={[4, 4, 0, 0]} />
            <Bar dataKey="tareas"    fill={chart.secondary}  name="Tareas"     radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default Reportes;
