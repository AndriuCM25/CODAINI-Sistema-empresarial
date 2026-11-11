import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Bot, Send, Trash2, Copy, Check,
  Loader2, Key, ExternalLink, Users, User, ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { tc } from '../utils/themeClasses';

// ────────────────────────────────────────────────────────────────────────────
// Tipos
// ────────────────────────────────────────────────────────────────────────────
interface Mensaje {
  id: string;
  deId: string;
  de: string;
  deRol: string;
  paraId: string; // 'todos' | userId
  contenido: string;
  fecha: string;
  leido: boolean;
}

interface MensajeIA {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Contacto {
  id: string;
  nombre: string;
  rol: string;
  iniciales: string;
}

const CONTACTOS_DEFAULT: Contacto[] = [
  { id: '1', nombre: 'Administrador CODAINI', rol: 'Administrador', iniciales: 'AC' },
  { id: '2', nombre: 'Juan Pérez', rol: 'Trabajador', iniciales: 'JP' },
  { id: '3', nombre: 'María Gómez', rol: 'Trabajadora', iniciales: 'MG' },
  { id: '4', nombre: 'Carlos Cliente', rol: 'Cliente', iniciales: 'CC' },
];

const CANAL_GENERAL = 'todos';

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────
function loadMensajes(): Mensaje[] {
  try {
    return JSON.parse(localStorage.getItem('codaini_messages') || '[]');
  } catch { return []; }
}

function saveMensajes(msgs: Mensaje[]) {
  localStorage.setItem('codaini_messages', JSON.stringify(msgs));
}

function loadIAHistory(): MensajeIA[] {
  try {
    return JSON.parse(localStorage.getItem('ia_chat_history') || '[]');
  } catch { return []; }
}

function saveIAHistory(msgs: MensajeIA[]) {
  localStorage.setItem('ia_chat_history', JSON.stringify(msgs.slice(-50)));
}

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  } catch { return ''; }
}

function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getIniciales(nombre: string) {
  return nombre.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

// ────────────────────────────────────────────────────────────────────────────
// Componente Avatar mini
// ────────────────────────────────────────────────────────────────────────────
const MiniAvatar: React.FC<{ iniciales: string; foto?: string; size?: 'sm' | 'md' }> = ({
  iniciales, foto, size = 'md',
}) => {
  const sz = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm';
  if (foto) {
    return <img src={foto} className={`${sz} rounded-full object-cover flex-shrink-0`} alt={iniciales} />;
  }
  return (
    <div className={`${sz} rounded-full flex items-center justify-center font-bold bg-light-accent dark:bg-codaini-cyan text-white dark:text-codaini-navy flex-shrink-0`}>
      {iniciales}
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// Burbuja de mensaje
// ────────────────────────────────────────────────────────────────────────────
const Burbuja: React.FC<{ msg: Mensaje; esMio: boolean }> = ({ msg, esMio }) => (
  <div className={`flex items-end gap-2 ${esMio ? 'flex-row-reverse' : ''}`}>
    <MiniAvatar iniciales={getIniciales(msg.de)} size="sm" />
    <div className={`max-w-[70%] space-y-1 ${esMio ? 'items-end' : 'items-start'} flex flex-col`}>
      {!esMio && (
        <span className={`text-xs font-medium ${tc.textMuted} px-1`}>{msg.de}</span>
      )}
      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
        ${esMio
          ? 'bg-light-accent dark:bg-codaini-cyan text-white dark:text-codaini-navy rounded-br-sm'
          : `${tc.surface2} ${tc.textPrimary} rounded-bl-sm border ${tc.border}`
        }`}>
        {msg.contenido}
      </div>
      <span className={`text-xs ${tc.textMuted} px-1`}>{formatTime(msg.fecha)}</span>
    </div>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// Burbuja IA
// ────────────────────────────────────────────────────────────────────────────
const BurbujaIA: React.FC<{ msg: MensajeIA }> = ({ msg }) => {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === 'user';

  const copiar = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      {isUser
        ? <div className="w-8 h-8 rounded-full flex items-center justify-center bg-light-accent dark:bg-codaini-cyan text-white dark:text-codaini-navy flex-shrink-0"><User className="w-4 h-4" /></div>
        : <div className="w-8 h-8 rounded-full flex items-center justify-center bg-violet-500 dark:bg-violet-600 text-white flex-shrink-0"><Bot className="w-4 h-4" /></div>
      }
      <div className={`max-w-[75%] space-y-1 flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed relative group
          ${isUser
            ? 'bg-light-accent dark:bg-codaini-cyan text-white dark:text-codaini-navy rounded-br-sm'
            : `${tc.surface2} ${tc.textPrimary} rounded-bl-sm border ${tc.border}`
          }`}>
          <p className="whitespace-pre-wrap">{msg.content}</p>
          {!isUser && (
            <button
              onClick={copiar}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded"
            >
              {copied
                ? <Check className="w-3.5 h-3.5 text-green-500" />
                : <Copy className="w-3.5 h-3.5 text-light-muted dark:text-codaini-muted" />
              }
            </button>
          )}
        </div>
        <span className={`text-xs ${tc.textMuted} px-1`}>{formatTime(msg.timestamp)}</span>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// Typing indicator
// ────────────────────────────────────────────────────────────────────────────
const TypingIndicator: React.FC = () => (
  <div className="flex items-end gap-2">
    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-violet-500 dark:bg-violet-600 text-white flex-shrink-0">
      <Bot className="w-4 h-4" />
    </div>
    <div className={`px-4 py-3 rounded-2xl rounded-bl-sm ${tc.surface2} border ${tc.border} flex gap-1.5 items-center`}>
      {[0, 1, 2].map((i) => (
        <motion.span key={i} className="w-2 h-2 rounded-full bg-light-accent dark:bg-codaini-cyan"
          animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
      ))}
    </div>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// Panel de configuración de API Key
// ────────────────────────────────────────────────────────────────────────────
const APIKeyPanel: React.FC<{ onSave: (key: string) => void }> = ({ onSave }) => {
  const [inputKey, setInputKey] = useState('');
  const { isDark } = useTheme();

  const handleSave = () => {
    const trimmed = inputKey.trim();
    if (!trimmed) return;
    localStorage.setItem('gemini_api_key', trimmed);
    onSave(trimmed);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className={`${tc.card} max-w-md w-full p-8 space-y-5`}>
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <Bot className="w-9 h-9 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${tc.textHeading}`}>Conectar Asistente IA</h3>
            <p className={`text-sm mt-1 ${tc.textMuted}`}>
              Necesitas una API Key gratuita de Google Gemini para usar el asistente.
            </p>
          </div>
        </div>

        <div className={`${tc.surface2} rounded-xl p-4 space-y-2 text-sm border ${tc.border}`}>
          <p className={`font-semibold ${tc.textPrimary}`}>Cómo obtenerla (gratis):</p>
          <ol className={`list-decimal list-inside space-y-1 ${tc.textMuted}`}>
            <li>Ve a <strong>aistudio.google.com</strong></li>
            <li>Inicia sesión con tu cuenta Google</li>
            <li>Clic en <strong>"Get API Key"</strong></li>
            <li>Crea una nueva API Key y cópiala</li>
          </ol>
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-2 text-violet-600 dark:text-violet-400 font-medium hover:underline">
            <ExternalLink className="w-3.5 h-3.5" /> Ir a Google AI Studio
          </a>
        </div>

        <div className="space-y-2">
          <label className={tc.inputLabel}>
            <Key className="w-3.5 h-3.5 inline mr-1" /> Tu API Key de Gemini
          </label>
          <input
            type="password"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="AIzaSy..."
            className={tc.input}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!inputKey.trim()}
          className="w-full py-3 rounded-xl font-semibold text-sm bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
        >
          Guardar y conectar
        </button>
      </motion.div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// PESTAÑA: Chat General
// ────────────────────────────────────────────────────────────────────────────
const ChatGeneral: React.FC = () => {
  const { user } = useAuth();
  const [mensajes, setMensajes] = useState<Mensaje[]>(loadMensajes);
  const [canalActivo, setCanalActivo] = useState<string>(CANAL_GENERAL);
  const [input, setInput] = useState('');
  const [showContactos, setShowContactos] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const contactos = CONTACTOS_DEFAULT.filter(
    (c) => c.id !== user?.id && c.nombre !== `${user?.nombre} ${user?.apellidos || ''}`.trim()
  );

  const mensajesFiltrados = mensajes.filter((m) => {
    if (canalActivo === CANAL_GENERAL) return m.paraId === CANAL_GENERAL;
    return (
      (m.deId === user?.id && m.paraId === canalActivo) ||
      (m.deId === canalActivo && m.paraId === user?.id)
    );
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajesFiltrados.length]);

  const enviar = () => {
    const texto = input.trim();
    if (!texto) return;
    const nuevo: Mensaje = {
      id: genId(),
      deId: user?.id || '0',
      de: `${user?.nombre || ''} ${user?.apellidos || ''}`.trim(),
      deRol: user?.rol || '',
      paraId: canalActivo,
      contenido: texto,
      fecha: new Date().toISOString(),
      leido: false,
    };
    const updated = [...mensajes, nuevo];
    setMensajes(updated);
    saveMensajes(updated);
    setInput('');
  };

  const getNombreCanal = () => {
    if (canalActivo === CANAL_GENERAL) return '# Canal General';
    const c = contactos.find((x) => x.id === canalActivo);
    return c ? c.nombre : 'Conversación';
  };

  return (
    <div className="flex h-full">
      {/* Sidebar contactos */}
      <div className={`w-64 flex-shrink-0 flex flex-col border-r ${tc.border}`}>
        <div className={`p-3 border-b ${tc.border}`}>
          <p className={`text-xs font-semibold uppercase tracking-wider ${tc.textMuted} mb-2`}>Canales</p>
          <button
            onClick={() => setCanalActivo(CANAL_GENERAL)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors
              ${canalActivo === CANAL_GENERAL
                ? 'bg-light-accent dark:bg-codaini-cyan text-white dark:text-codaini-navy font-semibold'
                : `${tc.textMuted} ${tc.hoverSurface}`
              }`}
          >
            <Users className="w-4 h-4 flex-shrink-0" />
            <span>General</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className={`text-xs font-semibold uppercase tracking-wider ${tc.textMuted} mb-2`}>Mensajes directos</p>
          {contactos.map((c) => (
            <button
              key={c.id}
              onClick={() => setCanalActivo(c.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors
                ${canalActivo === c.id
                  ? 'bg-light-accent dark:bg-codaini-cyan text-white dark:text-codaini-navy font-semibold'
                  : `${tc.textPrimary} ${tc.hoverSurface}`
                }`}
            >
              <MiniAvatar iniciales={c.iniciales} size="sm" />
              <div className="text-left min-w-0">
                <p className="truncate text-sm">{c.nombre}</p>
                <p className={`text-xs truncate ${canalActivo === c.id ? 'opacity-70' : tc.textMuted}`}>{c.rol}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Panel de mensajes */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className={`px-4 py-3 border-b ${tc.border} flex items-center gap-2 flex-shrink-0`}>
          <MessageSquare className="w-4 h-4 text-light-accent dark:text-codaini-cyan" />
          <span className={`font-semibold ${tc.textPrimary}`}>{getNombreCanal()}</span>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {mensajesFiltrados.length === 0 ? (
            <div className={`flex flex-col items-center justify-center h-full gap-3 ${tc.textMuted}`}>
              <MessageSquare className="w-12 h-12 opacity-20" />
              <p className="text-sm">No hay mensajes aún. ¡Sé el primero en escribir!</p>
            </div>
          ) : (
            mensajesFiltrados.map((m) => (
              <Burbuja key={m.id} msg={m} esMio={m.deId === user?.id} />
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className={`px-4 py-3 border-t ${tc.border} flex gap-2 flex-shrink-0`}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), enviar())}
            placeholder={`Mensaje en ${getNombreCanal()}...`}
            className={`${tc.input} flex-1`}
          />
          <button
            onClick={enviar}
            disabled={!input.trim()}
            className="px-4 py-2 rounded-lg bg-light-accent dark:bg-codaini-cyan text-white dark:text-codaini-navy disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// PESTAÑA: Asistente IA
// ────────────────────────────────────────────────────────────────────────────
const AsistenteIA: React.FC = () => {
  const { user } = useAuth();
  const [historial, setHistorial] = useState<MensajeIA[]>(loadIAHistory);
  const [input, setInput] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://127.0.0.1:8000';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [historial.length, cargando]);

  const enviarMensaje = async () => {
    const texto = input.trim();
    if (!texto || cargando) return;
    setError('');
    setInput('');

    const msgUsuario: MensajeIA = {
      id: genId(),
      role: 'user',
      content: texto,
      timestamp: new Date().toISOString(),
    };

    const nuevoHistorial = [...historial, msgUsuario];
    setHistorial(nuevoHistorial);
    setCargando(true);

    try {
      const token = localStorage.getItem('token');

      // Construir contents con historial
      const contents = nuevoHistorial.map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

      const res = await fetch(`${BACKEND_URL}/api/gemini/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          contents,
          systemInstruction: 'Eres un asistente empresarial de CODAINI. Ayudas con gestión de proyectos, tareas, empleados y negocios. Responde en español de forma clara y profesional.',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Error ${res.status}`);
      }

      const msgIA: MensajeIA = {
        id: genId(),
        role: 'assistant',
        content: data.text || 'Sin respuesta.',
        timestamp: new Date().toISOString(),
      };

      const finalHistorial = [...nuevoHistorial, msgIA];
      setHistorial(finalHistorial);
      saveIAHistory(finalHistorial);
    } catch (e: unknown) {
      setError((e as Error).message || 'Error al conectar con el asistente.');
    } finally {
      setCargando(false);
    }
  };

  const limpiarHistorial = () => {
    setHistorial([]);
    saveIAHistory([]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header IA */}
      <div className={`px-4 py-3 border-b ${tc.border} flex items-center justify-between flex-shrink-0`}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <Bot className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          </div>
          <span className={`font-semibold ${tc.textPrimary}`}>Asistente Gemini</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">
            Conectado
          </span>
        </div>
        <button onClick={limpiarHistorial} title="Limpiar historial" className={tc.navIconBtn}>
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {historial.length === 0 && !cargando && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <Bot className="w-9 h-9 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className={`font-semibold ${tc.textPrimary}`}>Hola, {user?.nombre} 👋</p>
              <p className={`text-sm mt-1 ${tc.textMuted}`}>
                Soy tu asistente empresarial. Pregúntame sobre proyectos, tareas, gestión del equipo o cualquier tema de negocio.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-sm">
              {[
                '¿Cómo mejorar la gestión de proyectos?',
                'Tips para liderar un equipo remoto',
                '¿Cómo priorizar tareas eficientemente?',
                'Estrategias para mejorar la productividad',
              ].map((s) => (
                <button key={s} onClick={() => setInput(s)}
                  className={`text-left text-xs px-3 py-2.5 rounded-xl ${tc.surface2} border ${tc.border} ${tc.textMuted} hover:border-light-accent dark:hover:border-codaini-cyan hover:text-light-accent dark:hover:text-codaini-cyan transition-colors`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {historial.map((m) => (
          <BurbujaIA key={m.id} msg={m} />
        ))}

        {cargando && <TypingIndicator />}

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
            <span className="flex-1">{error}</span>
            <button onClick={() => setError('')} className="opacity-60 hover:opacity-100">✕</button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className={`px-4 py-3 border-t ${tc.border} flex gap-2 flex-shrink-0`}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviarMensaje(); }
          }}
          placeholder="Escribe tu pregunta... (Enter para enviar, Shift+Enter para nueva línea)"
          rows={1}
          style={{ resize: 'none' }}
          className={`${tc.input} flex-1`}
        />
        <button
          onClick={enviarMensaje}
          disabled={!input.trim() || cargando}
          className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {cargando
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Send className="w-4 h-4" />
          }
        </button>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ────────────────────────────────────────────────────────────────────────────
const Mensajeria: React.FC = () => {
  const [pestaña, setPestaña] = useState<'chat' | 'ia'>('chat');

  const tabs = [
    { id: 'chat' as const, label: 'Mensajes', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'ia'   as const, label: 'Asistente IA', icon: <Bot className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Encabezado */}
      <div className="flex-shrink-0 mb-4">
        <h1 className={`text-3xl font-bold ${tc.textHeading}`}>Mensajería</h1>
        <p className={`mt-1 ${tc.textMuted}`}>Comunicación interna y asistente inteligente</p>
      </div>

      {/* Contenedor principal */}
      <div className={`${tc.cardShadow} flex-1 flex flex-col overflow-hidden`}>
        {/* Pestañas */}
        <div className={`flex border-b ${tc.border} flex-shrink-0 px-4 pt-3 gap-1`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPestaña(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all border-b-2 -mb-px
                ${pestaña === tab.id
                  ? 'border-light-accent dark:border-codaini-cyan text-light-accent dark:text-codaini-cyan'
                  : `border-transparent ${tc.textMuted} hover:${tc.textPrimary}`
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido de pestañas */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {pestaña === 'chat' ? (
              <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                <ChatGeneral />
              </motion.div>
            ) : (
              <motion.div key="ia" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col">
                <AsistenteIA />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Mensajeria;
