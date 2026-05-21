import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, Cell, PieChart, Pie
} from 'recharts';
import { 
  Activity, AlertTriangle, CheckCircle, Users, Map as MapIcon, 
  Network, FileText, Download, Play, X, ChevronDown, Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-scroll';
import { metricsData, hourlyTraffic, quotes, recommendations } from './data/mockData';

// --- Components ---

const StatCard = ({ title, value, icon: Icon, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass p-6 rounded-2xl flex items-center space-x-4"
  >
    <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
      <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
    </div>
  </motion.div>
);

const SectionTitle = ({ children, subtitle }) => (
  <div className="mb-12 text-center">
    <h2 className="text-3xl font-bold text-tecnm-blue mb-4">{children}</h2>
    {subtitle && <p className="text-slate-600 max-w-2xl mx-auto">{subtitle}</p>}
    <div className="w-20 h-1.5 bg-tecnm-red mx-auto mt-4 rounded-full"></div>
  </div>
);

export default function App() {
  const [isPresenting, setIsPresenting] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [timeFilter, setTimeFilter] = useState(15); // Hour 15 (peak)
  
  const criticalBuildings = metricsData.filter(m => m.disponibilidad < 92);
  const stableBuildings = metricsData.filter(m => m.disponibilidad > 96);

  return (
    <div className={`min-h-screen ${isPresenting ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* --- Navbar --- */}
      {!isPresenting && (
        <nav className="fixed top-0 w-full z-50 glass py-4 px-8 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-tecnm-blue rounded-lg flex items-center justify-center text-white font-bold">IT</div>
            <span className="font-bold text-tecnm-blue tracking-tight">Portal de Red ITVER</span>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
            <Link to="hero" smooth={true} className="hover:text-tecnm-red cursor-pointer">Portada</Link>
            <Link to="dashboard" smooth={true} className="hover:text-tecnm-red cursor-pointer">Dashboard</Link>
            <Link to="map" smooth={true} className="hover:text-tecnm-red cursor-pointer">Mapa</Link>
            <Link to="solution" smooth={true} className="hover:text-tecnm-red cursor-pointer">Propuesta</Link>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsPresenting(!isPresenting)}
              className="flex items-center space-x-2 bg-tecnm-blue text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all text-sm font-medium"
            >
              <Play className="w-4 h-4" />
              <span>Modo Presentación</span>
            </button>
          </div>
        </nav>
      )}

      {/* --- Presentation Mode Close --- */}
      {isPresenting && (
        <button 
          onClick={() => setIsPresenting(false)}
          className="fixed top-6 right-6 z-[60] bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      {/* --- Section 1: Hero --- */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-tecnm-blue/10 to-transparent"></div>
          {/* Background decoration */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-tecnm-blue/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tecnm-red/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-tecnm-blue mb-6">
              Monitoreo de Red <span className="text-tecnm-red">ITVER</span>
              <br /><span className="text-3xl md:text-4xl font-semibold opacity-80">- Diagnóstico 2026 -</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              Correlación avanzada entre métricas <span className="font-bold">SNMP</span> y experiencia de usuario 
              en los 12 edificios del campus. Un análisis técnico de la infraestructura crítica.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="dashboard" smooth={true} offset={-80}>
                <button className="px-8 py-4 bg-tecnm-blue text-white rounded-full font-bold text-lg shadow-lg hover:shadow-tecnm-blue/20 transform hover:-translate-y-1 transition-all">
                  Ver Diagnóstico Completo
                </button>
              </Link>
              <button className="px-8 py-4 border-2 border-tecnm-blue text-tecnm-blue rounded-full font-bold text-lg hover:bg-tecnm-blue hover:text-white transition-all flex items-center gap-2">
                <Download className="w-5 h-5" />
                Descargar Reporte PDF
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 opacity-30"
          >
            <ChevronDown className="w-10 h-10" />
          </motion.div>
        </div>
      </section>

      {/* --- Section 2: Dashboard --- */}
      <section id="dashboard" className="py-24 px-8 max-w-7xl mx-auto">
        <SectionTitle subtitle="Análisis detallado de disponibilidad y tráfico en tiempo real">
          Dashboard Técnico Interactiva
        </SectionTitle>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <StatCard title="Edificios Críticos" value="2 (X, L)" icon={AlertTriangle} color="bg-tecnm-red text-tecnm-red" />
          <StatCard title="Disponibilidad Mínima" value="88.66%" icon={Activity} color="bg-amber-500 text-amber-500" />
          <StatCard title="Encuestas Procesadas" value="371" icon={Users} color="bg-tecnm-green text-tecnm-green" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Availability Bar Chart */}
          <div className="glass p-8 rounded-3xl">
            <h3 className="text-xl font-bold mb-6 text-slate-800">Disponibilidad por Edificio (%)</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metricsData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="edificio" angle={-45} textAnchor="end" interval={0} fontSize={11} stroke="#64748b" />
                  <YAxis domain={[80, 100]} stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="disponibilidad" radius={[4, 4, 0, 0]}>
                    {metricsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.disponibilidad < 92 ? '#E63946' : entry.disponibilidad < 96 ? '#F59E0B' : '#2A9D8F'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center space-x-6 text-xs font-semibold uppercase tracking-wider">
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-tecnm-red rounded-full"></span> Crítico (&lt;92%)</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-amber-500 rounded-full"></span> Alerta (92-96%)</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-tecnm-green rounded-full"></span> Estable (&gt;96%)</div>
            </div>
          </div>

          {/* Traffic Line Chart */}
          <div className="glass p-8 rounded-3xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Tráfico por Edificio (Mbps)</h3>
              <div className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-500 font-bold">8:00 - 18:00</div>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyTraffic}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="hora" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="X" name="Edificio X" stroke="#E63946" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="L" name="Edificio L" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Promedio" name="Otros (Avg)" stroke="#2A9D8F" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-tecnm-blue/5 rounded-xl">
              <p className="text-sm text-slate-600 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-tecnm-blue" />
                <strong>Hallazgo:</strong> Saturación crítica entre las 11:00 y las 15:00 en Edificio X superando los 160 Mbps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 3: Matrix --- */}
      <section id="matrix" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Matriz de Correlación Técnica-Social</h2>
            <div className="w-20 h-1.5 bg-tecnm-red mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/5 text-slate-400 text-sm uppercase tracking-widest font-bold">
                <tr>
                  <th className="p-6">Edificio</th>
                  <th className="p-6">Disponibilidad</th>
                  <th className="p-6">Satisfacción</th>
                  <th className="p-6">Diagnóstico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {metricsData.slice(0, 8).map((item, idx) => (
                  <motion.tr 
                    key={idx}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="p-6 font-semibold">{item.edificio}</td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full ${item.disponibilidad < 92 ? 'bg-tecnm-red' : 'bg-tecnm-green'}`} style={{ width: `${item.disponibilidad}%` }}></div>
                        </div>
                        <span>{item.disponibilidad}%</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(item.satisfaccion) ? 'opacity-100' : 'opacity-20'}>★</span>
                        ))}
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        item.disponibilidad < 92 ? 'bg-tecnm-red/20 text-tecnm-red border border-tecnm-red/50' :
                        item.disponibilidad < 96 ? 'bg-amber-500/20 text-amber-500 border border-amber-500/50' :
                        'bg-tecnm-green/20 text-tecnm-green border border-tecnm-green/50'
                      }`}>
                        {item.disponibilidad < 92 ? '🔴 Crítico' : item.disponibilidad < 96 ? '🟡 Alerta' : '🟢 Estable'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* --- Section 4: Human Validation --- */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <SectionTitle subtitle="Lo que dicen los números vs lo que viven los estudiantes">
          Validación Humana y Sentimiento
        </SectionTitle>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass p-8 rounded-3xl">
             <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
               <Users className="text-tecnm-blue" />
               Voz del Estudiante (Citas Directas)
             </h3>
             <div className="space-y-6">
               {quotes.map((q, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="p-6 bg-slate-50 rounded-2xl border-l-4 border-tecnm-red italic relative"
                 >
                   <p className="text-lg text-slate-700 mb-2">"{q.text}"</p>
                   <div className="flex justify-between items-center text-sm">
                     <span className="font-bold text-tecnm-blue">{q.building}</span>
                     <span className="text-slate-400">— {q.author}</span>
                   </div>
                 </motion.div>
               ))}
             </div>
          </div>
          
          <div className="glass p-8 rounded-3xl bg-tecnm-blue text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Activity className="w-32 h-32" />
            </div>
            <h3 className="text-xl font-bold mb-6">Nube de Problemas</h3>
            <div className="flex flex-wrap gap-4 items-center justify-center">
              {[
                { text: "LENTITUD", size: "text-4xl", op: 1 },
                { text: "SIN SEÑAL", size: "text-2xl", op: 0.8 },
                { text: "SATURACIÓN", size: "text-3xl", op: 0.9 },
                { text: "INTERMITENCIA", size: "text-2xl", op: 0.7 },
                { text: "PING ALTO", size: "text-xl", op: 0.6 },
                { text: "CAÍDAS", size: "text-3xl", op: 1 },
                { text: "DNS ERROR", size: "text-lg", op: 0.5 },
                { text: "WIFI DÉBIL", size: "text-2xl", op: 0.8 },
              ].map((w, i) => (
                <motion.span 
                  key={i} 
                  className={`${w.size} font-black uppercase tracking-tighter`}
                  style={{ opacity: w.op }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 + i }}
                >
                  {w.text}
                </motion.span>
              ))}
            </div>
            <div className="mt-12 p-4 bg-white/10 rounded-xl border border-white/20">
              <p className="text-sm font-medium">82% de las menciones negativas provienen de los edificios de Ingeniería.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 5: Campus Map --- */}
      <section id="map" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-8">
          <SectionTitle subtitle="Mapa interactivo del estado de red por edificio">
            Mapa de Red ITVER
          </SectionTitle>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-center">
            <div className="lg:col-span-3 glass p-1 rounded-3xl overflow-hidden shadow-2xl relative bg-white">
               {/* Mock SVG Map */}
               <div className="aspect-[16/9] w-full bg-slate-100 flex items-center justify-center p-8">
                  <svg viewBox="0 0 800 450" className="w-full h-full">
                    {/* Simulated Buildings */}
                    <g className="buildings">
                      {[
                        { id: 'X', x: 100, y: 100, w: 120, h: 80, label: 'Edificio X', color: '#E63946', stat: '88.6%' },
                        { id: 'L', x: 250, y: 80, w: 100, h: 100, label: 'Edificio L', color: '#E63946', stat: '90.5%' },
                        { id: 'W', x: 400, y: 120, w: 120, h: 60, label: 'Edificio W', color: '#F59E0B', stat: '97.1%' },
                        { id: 'Biblio', x: 150, y: 250, w: 150, h: 120, label: 'Biblioteca', color: '#2A9D8F', stat: '99.8%' },
                        { id: 'Admin', x: 450, y: 250, w: 200, h: 100, label: 'Administrativos', color: '#2A9D8F', stat: '99.7%' },
                        { id: 'UDIM', x: 600, y: 50, w: 100, h: 150, label: 'UDIM', color: '#2A9D8F', stat: '99.8%' },
                      ].map((b, i) => (
                        <motion.g 
                          key={i} 
                          whileHover={{ scale: 1.05 }}
                          onClick={() => setSelectedBuilding(b)}
                          className="cursor-pointer"
                        >
                          <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={b.color} rx="8" className="shadow-sm opacity-80 hover:opacity-100 transition-opacity" />
                          <text x={b.x + b.w/2} y={b.y + b.h/2 - 5} textAnchor="middle" fill="white" className="text-[14px] font-bold">{b.label}</text>
                          <text x={b.x + b.w/2} y={b.y + b.h/2 + 15} textAnchor="middle" fill="white" className="text-[12px] opacity-80">{b.stat}</text>
                        </motion.g>
                      ))}
                    </g>
                    {/* Simplified Paths */}
                    <path d="M 160,140 L 300,130 L 460,150 L 550,300 L 225,310 Z" fill="none" stroke="#003366" strokeWidth="2" strokeDasharray="5 5" className="opacity-20" />
                  </svg>
               </div>
               
               {/* Tooltip Overlay */}
               <AnimatePresence>
                 {selectedBuilding && (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.9 }}
                     className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass p-6 rounded-2xl shadow-2xl w-72"
                   >
                     <div className="flex justify-between items-start mb-4">
                        <h4 className="text-xl font-bold text-tecnm-blue">{selectedBuilding.label}</h4>
                        <button onClick={() => setSelectedBuilding(null)}><X className="w-5 h-5 text-slate-400" /></button>
                     </div>
                     <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                           <span className="text-slate-500">Disponibilidad:</span>
                           <span className={`font-bold ${selectedBuilding.color === '#E63946' ? 'text-tecnm-red' : 'text-tecnm-green'}`}>{selectedBuilding.stat}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                           <span className="text-slate-500">Estado:</span>
                           <span className="font-bold">{selectedBuilding.color === '#E63946' ? 'Crítico' : 'Óptimo'}</span>
                        </div>
                        <button className="w-full mt-4 bg-tecnm-blue text-white py-2 rounded-lg text-sm font-bold">Ver Histórico</button>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                <h4 className="font-bold text-tecnm-blue mb-4">Leyenda de Estado</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-tecnm-red rounded"></div>
                    <span className="text-sm font-medium">Baja Calidad / Saturado</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-amber-500 rounded"></div>
                    <span className="text-sm font-medium">Capacidad Limitada</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-tecnm-green rounded"></div>
                    <span className="text-sm font-medium">Servicio Estable</span>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-tecnm-red/5 rounded-2xl border border-tecnm-red/20">
                <p className="text-xs font-bold text-tecnm-red uppercase mb-2">Observación Crítica</p>
                <p className="text-sm text-slate-700">
                  La zona norte (Mecatrónica y Química) presenta el mayor índice de degradación debido a la topología actual en cascada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 6: Solution --- */}
      <section id="solution" className="py-24 max-w-7xl mx-auto px-8">
        <SectionTitle subtitle="Propuesta de modernización basada en evidencias técnicas">
          Estrategia de Optimización
        </SectionTitle>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
           {/* Topology Comparison */}
           <div className="space-y-8">
              <h3 className="text-xl font-bold text-slate-800">Evolución de Topología</h3>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-slate-100 rounded-2xl border-2 border-slate-200">
                    <p className="text-center font-bold text-slate-500 text-xs uppercase mb-4">Actual (Cascada)</p>
                    <div className="flex flex-col items-center gap-2 opacity-60">
                       <div className="w-8 h-8 bg-slate-800 rounded"></div>
                       <div className="w-0.5 h-4 bg-slate-400"></div>
                       <div className="w-8 h-8 bg-slate-800 rounded"></div>
                       <div className="w-0.5 h-4 bg-slate-400"></div>
                       <div className="w-8 h-8 bg-tecnm-red rounded animate-pulse"></div>
                    </div>
                    <p className="text-[10px] text-center mt-4 text-slate-500">Puntos únicos de falla</p>
                 </div>
                 <div className="p-4 bg-tecnm-blue/5 rounded-2xl border-2 border-tecnm-blue/20">
                    <p className="text-center font-bold text-tecnm-blue text-xs uppercase mb-4">Propuesta (Estrella)</p>
                    <div className="relative h-24 flex items-center justify-center">
                       <div className="w-10 h-10 bg-tecnm-blue rounded-lg z-10"></div>
                       <div className="absolute w-12 h-0.5 bg-tecnm-blue/30 rotate-45"></div>
                       <div className="absolute w-12 h-0.5 bg-tecnm-blue/30 -rotate-45"></div>
                       <div className="absolute w-12 h-0.5 bg-tecnm-blue/30 rotate-90"></div>
                       <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-tecnm-green rounded"></div>
                       <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-tecnm-green rounded"></div>
                       <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-6 h-6 bg-tecnm-green rounded"></div>
                       <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-6 h-6 bg-tecnm-green rounded"></div>
                    </div>
                    <p className="text-[10px] text-center mt-4 text-tecnm-blue font-bold">Resiliencia y Redundancia</p>
                 </div>
              </div>
              
              <div className="space-y-4">
                 {recommendations.map((rec, i) => (
                   <div key={i} className="flex gap-4 p-4 glass rounded-2xl items-start">
                      <div className={`p-2 rounded-lg ${rec.priority === 'Alta' ? 'bg-tecnm-red/10 text-tecnm-red' : 'bg-tecnm-blue/10 text-tecnm-blue'}`}>
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                         <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-slate-800">{rec.title}</h4>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${rec.priority === 'Alta' ? 'bg-tecnm-red text-white' : 'bg-tecnm-blue text-white'}`}>
                               {rec.priority}
                            </span>
                         </div>
                         <p className="text-sm text-slate-600">{rec.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Roadmap */}
           <div className="glass p-8 rounded-3xl">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <Network className="text-tecnm-blue" />
                Hoja de Ruta de Implementación
              </h3>
              <div className="relative space-y-12">
                 <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-200"></div>
                 
                 {[
                   { phase: "Fase 1: Infraestructura Base", time: "Mes 1", tasks: ["Tendido de fibra monomodo", "Instalación de Rack Central"], status: "Próximo" },
                   { phase: "Fase 2: Equipamiento Core", time: "Mes 2-3", tasks: ["Configuración de VTP/STP", "Migración de Gateway"], status: "Pendiente" },
                   { phase: "Fase 3: Optimización QoS", time: "Mes 4", tasks: ["Políticas de tráfico SNMPv3", "Validación final de usuario"], status: "Pendiente" },
                 ].map((step, i) => (
                   <motion.div 
                     key={i} 
                     initial={{ opacity: 0, x: 20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.2 }}
                     className="relative pl-12"
                   >
                     <div className={`absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-white shadow-md flex items-center justify-center text-white text-xs font-bold ${i === 0 ? 'bg-tecnm-blue' : 'bg-slate-300'}`}>
                        {i + 1}
                     </div>
                     <div>
                        <div className="flex justify-between items-center mb-2">
                           <h4 className="font-bold text-slate-800">{step.phase}</h4>
                           <span className="text-xs font-bold text-tecnm-blue bg-tecnm-blue/10 px-2 py-1 rounded">{step.time}</span>
                        </div>
                        <ul className="text-sm text-slate-600 space-y-1">
                           {step.tasks.map((task, j) => <li key={j}>• {task}</li>)}
                        </ul>
                     </div>
                   </motion.div>
                 ))}
              </div>
              <button className="w-full mt-12 bg-tecnm-blue text-white py-4 rounded-2xl font-bold shadow-xl hover:shadow-tecnm-blue/20 transition-all flex items-center justify-center gap-3">
                 <FileText className="w-5 h-5" />
                 Descargar Proyecto Técnico Completo
              </button>
           </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-12 bg-slate-900 text-slate-400 px-8 text-center border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm mb-4">© 2026 Instituto Tecnológico de Veracruz - Departamento de Sistemas y Computación</p>
          <div className="flex justify-center space-x-6 text-xs uppercase tracking-widest font-bold">
            <a href="#" className="hover:text-white transition-colors">Taller de Investigación</a>
            <a href="#" className="hover:text-white transition-colors">SNMP Monitoring</a>
            <a href="#" className="hover:text-white transition-colors">UX Research</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
