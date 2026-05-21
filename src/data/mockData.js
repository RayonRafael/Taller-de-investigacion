export const metricsData = [
  { edificio: 'Edificio A (UDIM)', disponibilidad: 99.77, errores: 0.15, traficoMax: 93.45, satisfaccion: 4.2 },
  { edificio: 'Edificio L (Química)', disponibilidad: 90.46, errores: 5.05, traficoMax: 148.73, satisfaccion: 2.97 },
  { edificio: 'Edificio X (Mecatrónica)', disponibilidad: 88.66, errores: 7.15, traficoMax: 162.41, satisfaccion: 2.85 },
  { edificio: 'Edificio W (Industrial)', disponibilidad: 97.06, errores: 1.66, traficoMax: 107.79, satisfaccion: 3.03 },
  { edificio: 'Edificio Q (Económico)', disponibilidad: 98.7, errores: 0.62, traficoMax: 127.21, satisfaccion: 3.8 },
  { edificio: 'Biblioteca', disponibilidad: 99.77, errores: 0.2, traficoMax: 75.01, satisfaccion: 4.5 },
  { edificio: 'Edificio S (Cómputo)', disponibilidad: 99.45, errores: 0.3, traficoMax: 109.18, satisfaccion: 4.1 },
  { edificio: 'Edificio N (Dirección)', disponibilidad: 99.74, errores: 0.28, traficoMax: 58.45, satisfaccion: 4.3 },
  { edificio: 'Edificio M (Admin)', disponibilidad: 99.79, errores: 0.21, traficoMax: 58.74, satisfaccion: 4.4 },
  { edificio: 'Edificio O (Biblioteca)', disponibilidad: 99.53, errores: 0.35, traficoMax: 80.1, satisfaccion: 3.1 },
  { edificio: 'Edificio T (Eléctrica)', disponibilidad: 98.7, errores: 0.86, traficoMax: 91.53, satisfaccion: 3.9 },
  { edificio: 'Edificio D (Química/Lab)', disponibilidad: 99.17, errores: 0.54, traficoMax: 94.33, satisfaccion: 3.7 },
];

export const hourlyTraffic = [
  { hora: '08:00', X: 94.9, L: 75.2, Promedio: 55.4 },
  { hora: '09:00', X: 89.7, L: 83.0, Promedio: 52.8 },
  { hora: '10:00', X: 94.2, L: 78.8, Promedio: 54.1 },
  { hora: '11:00', X: 160.0, L: 139.2, Promedio: 92.5 },
  { hora: '12:00', X: 159.2, L: 139.0, Promedio: 91.8 },
  { hora: '13:00', X: 158.2, L: 148.1, Promedio: 92.3 },
  { hora: '14:00', X: 161.8, L: 147.6, Promedio: 93.0 },
  { hora: '15:00', X: 162.4, L: 148.7, Promedio: 94.1 },
  { hora: '16:00', X: 89.4, L: 77.2, Promedio: 51.5 },
  { hora: '17:00', X: 93.8, L: 82.1, Promedio: 53.2 },
  { hora: '18:00', X: 93.5, L: 83.2, Promedio: 54.4 },
];

export const quotes = [
  { text: "En el edificio X no hay señal, siempre uso datos", building: "Edificio X", author: "Estudiante de Mecatrónica" },
  { text: "La conexión es intermitente y se satura mucho", building: "Edificio L", author: "Estudiante de Química" },
  { text: "Es imposible subir archivos pesados en hora pico", building: "Edificio X", author: "Estudiante de Posgrado" },
];

export const recommendations = [
  {
    title: "Migrar a Topología en Estrella",
    desc: "Eliminar puntos únicos de falla conectando cada edificio directamente al núcleo (Core).",
    priority: "Alta",
  },
  {
    title: "Implementar SNMPv3",
    desc: "Asegurar la gestión de red con cifrado y autenticación fuerte.",
    priority: "Media",
  },
  {
    title: "Sustitución de Equipamiento",
    desc: "Reemplazar switches Cisco 2960 obsoletos por modelos Catalyst 9000.",
    priority: "Alta",
  },
];
