# Portal de Red ITVER - Monitoreo de Diagnóstico

Este proyecto es una herramienta interactiva para la visualización de diagnósticos de red del Instituto Tecnológico de Veracruz, correlacionando métricas SNMP con la percepción del usuario (UX).

## 📂 Nueva Estructura del Proyecto

El proyecto ha sido organizado para facilitar su mantenimiento y distribución:

```text
/
├── docs/               # Documentación y versiones previas (standalone HTML).
├── public/             # Archivos estáticos servidos directamente por Vite.
│   └── assets/
│       └── img/        # Logotipos, mapas e imágenes del campus.
├── scripts/            # Herramientas de procesamiento de datos (Python, BAT).
├── src/                # Código fuente de la aplicación React.
│   ├── assets/
│   │   ├── css/        # Estilos globales y archivos CSS.
│   │   └── js/         # Scripts auxiliares JavaScript.
│   ├── components/     # Componentes modulares de React (próximamente).
│   ├── data/           # Archivos de datos (CSV) y mocks.
│   ├── App.jsx         # Componente principal de la aplicación.
│   └── main.jsx        # Punto de entrada de React.
├── index.html          # Punto de entrada principal (HTML).
├── package.json        # Dependencias y scripts de NPM.
├── tailwind.config.js  # Configuración de estilos institucionales.
└── vite.config.js      # Configuración del servidor de desarrollo.
```

## 🚀 Cómo empezar

### Requisitos previos
- [Node.js](https://nodejs.org/) instalado.
- [Python 3](https://www.python.org/) (opcional, para ejecutar los scripts de procesamiento en `/scripts`).

### Instalación
1. Clona o descarga el proyecto.
2. Abre una terminal en la carpeta raíz.
3. Instala las dependencias:
   ```bash
   npm install
   ```

### Desarrollo
Para iniciar el servidor local con recarga automática:
```bash
npm run dev
```

### Producción
Para generar los archivos optimizados para distribución:
```bash
npm run build
```

## 📊 Scripts de Datos
Los scripts ubicados en `/scripts` permiten regenerar los archivos CSV de métricas y realizar análisis de correlación utilizando Python.

---
**Desarrollado por Rafael Rayón** - 2026
Taller de Investigación - ITVER
