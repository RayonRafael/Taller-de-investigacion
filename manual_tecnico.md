# MANUAL TÉCNICO OFICIAL
## Proyecto: Monitoreo de la red de forma activa y pasiva en el Instituto Tecnológico de Veracruz
**Versión del Sistema:** ITVER Network OS - Bento NOC v4.4

---

### 1. INTRODUCCIÓN Y ARQUITECTURA DE RED

#### 1.1 Propósito del Sistema
El ITVER Network OS (Bento NOC v4.4) es una plataforma de análisis integral diseñada para correlacionar matemáticamente el comportamiento de los equipos físicos de red con la percepción subjetiva de los estudiantes.
- **Monitoreo Pasivo (QoS):** Se basa en la captura y análisis silencioso de las métricas de telemetría del protocolo SNMP (Simple Network Management Protocol). Evalúa los puertos físicos midiendo los octetos de entrada/salida y los descartes/errores sin generar tráfico adicional de prueba.
- **Monitoreo Activo (UX):** Ejecuta transacciones interactivas iniciadas por los usuarios (como el Speedtest interno del portal) y procesa encuestas estructuradas (Likert 1-5).
El objetivo es transformar datos fríos (Mbps, % de disponibilidad) en diagnósticos accionables que demuestren cómo una tasa de error del 7.15% en hardware resulta directamente en una calificación de 2.85/5 en la satisfacción del estudiante.

#### 1.2 Topología Lógica y Física
- **Arquitectura de Software (Lógica):** La solución opera bajo un esquema desacoplado. Por un lado, los scripts de Python 3 (`correlacion_itver.py` y `generar_datos_itver.py`) fungen como el motor de ETL (Extracción, Transformación y Carga) procesando los logs CSV. Por otro lado, un servidor Node.js/Vite levanta una aplicación React que renderiza estos datos en un dashboard interactivo en tiempo real.
- **Topología Física Actual (Cascada):** La infraestructura actual de los 12 edificios principales se rige por un esquema en cascada. Esto ha sido diagnosticado como el causante de una severa degradación en la zona norte (Edificio X - Lab. de Mecatrónica y Edificio L - Lab. de química general), donde los fallos de un nodo se propagan, generando cuellos de botella superiores a los 160 Mbps en horas pico (11:00 a 15:00 h).
- **Topología Propuesta (Estrella Simulada):** El sistema proyecta la migración hacia una arquitectura en Estrella. En este diseño, todos los nodos de distribución se conectan independientemente al Core de Biblioteca (`CORE-BIB-01`) a través de un Backbone de fibra monomodo de 10G. Al conmutar el simulador del NOC a esta topología, la lógica del sistema recalcula y garantiza una mitigación de fallas, elevando la disponibilidad de la red al 98.80%.

---

### 2. REQUISITOS DEL ENTORNO E INFRAESTRUCTURA

#### 2.1 Hardware de Red Monitoreado
La plataforma trackea el estatus de los siguientes equipos de interconexión. El mapeo en la plataforma asocia un dispositivo principal a cada zona:
- `SW-MEC-CORE`: Cisco Catalyst 2960 (Edificio X - Lab. de Mecatrónica) - *Estado Crítico.*
- `SW-QMC-01`: Cisco Catalyst 2960 (Edificio L - Lab. de química general) - *Estado Crítico.*
- `SW-IND-01`: Cisco Catalyst 2960 (Edificio W - Lab. de industrial).
- `SW-COMP-01`: Cisco Catalyst 2960 (Edificio U - Sistemas y computación, Centro de cómputo).
- `SW-DIR-01`: Cisco Catalyst 2960 (Edificio N - Planta alta: Dirección, Subdirección de planeación y vinculación, Subdirección de servicios administrativos, Recursos financieros. Planta baja: Servicios escolares, Recursos humanos, Planeación, programación y presupuestación).
- `CORE-BIB-01`: Nodo Core (Biblioteca Central) - *Nodo de control estable.*
Adicionalmente, se administran de forma dinámica puntos de acceso inalámbrico representados en el mapa mediante la clase `.lab-ap`. Se prevé teóricamente una actualización a Switches Catalyst 9000 y APs Wi-Fi 6 AX.

#### 2.2 Servidor de Monitoreo y Procesamiento
El host que aloje el ITVER Network OS debe contar con las siguientes especificaciones de software:
- **Motor de Análisis (Backend Python):**
  - Python 3.8 o superior.
  - Biblioteca `pandas` (Fundamental para el método `.groupby()` y los `merge` de los dataframes de encuestas y métricas).
  - Biblioteca `numpy` (Para operaciones aritméticas de error).
  - Módulos estándar `csv`, `random`, y `datetime` (Utilizados en el motor de simulación de carga `generar_datos_itver.py`).
- **Servidor Web y Frontend (React / Vite):**
  - Node.js (v16+) y el gestor NPM.
  - Framework React (`App.jsx` y `main.jsx`).
  - **Tailwind CSS:** Para el renderizado de la interfaz gráfica "Bento Light Professional" (Utilizando los colores configurados: `#1B396A`, `#807E82`, `#E63946`, `#2A9D8F`, `#F59E0B`, `#E2E8F0`).
  - **Bibliotecas de Visualización:** Chart.js v4.4.1 (Gráficos standalone en HTML) y Recharts v2.x (BarChart, LineChart para React).
  - **Bibliotecas UI:** Lucide React y FontAwesome v6.4.0 (Iconos vectoriales), Framer Motion (Transiciones de opacidad y `clip-path`), React-scroll (Navegación fluida).
- **Almacenamiento de Datos:** Bases de datos de archivos planos (`metricas_itver.csv`, `matriz_correlacion_ITVER.csv`) y Web Storage API (`localStorage`) para persistencia local de reportes e incidencias.

---

### 3. GUÍA DE INSTALACIÓN Y CONFIGURACIÓN

#### 3.1 Preparación Inicial del Servidor Frontend
Para poner en marcha la interfaz visual desde cero en una máquina nueva, siga el procedimiento estricto desde la raíz del proyecto:
1. Abra una terminal de sistema (PowerShell o Bash).
2. Descargue e instale el árbol completo de dependencias definidas en el `package.json`:
   ```bash
   npm install
   ```
3. Inicialice el servidor Vite para desarrollo con recarga automática (Hot Module Replacement):
   ```bash
   npm run dev
   ```
4. *Opcional para Producción:* Para compilar una versión estática y optimizada del portal, ejecute `npm run build`.

#### 3.2 Generación y Correlación de Datos de Red (Scripts Python)
El corazón del análisis recae en la carpeta `/scripts`. La inyección de datos a la plataforma sigue este flujo:
1. **Generación de Tráfico Base:**
   Ejecute el simulador de SNMP. Este script lee la constante `edificios` interna y genera fluctuaciones de tráfico considerando un factor multiplicador de 1.8x durante el pico de 11:00 a 15:00 horas, limitando la disponibilidad física mínima al 85%.
   ```bash
   python scripts/generar_datos_itver.py
   ```
   *Salida:* `metricas_itver.csv`
2. **Procesamiento de Correlación (ETL):**
   Este script cruza las métricas de red con el archivo original de Google Forms.
   **Importante:** El archivo de encuestas debe llamarse `Diagnóstico de Calidad de Servicio (QoS) y Experiencia de Usuario - Red ITVER (Respuestas) - Respuestas de formulario 1.csv` o similar, y debe contener columnas que incluyan las palabras "Edificio conectado" y "afirmaciones sobre el servicio" (para las preguntas Likert).
   ```bash
   python scripts/correlacion_itver.py
   ```
   *El script normaliza automáticamente los nombres mediante un diccionario (ej. 'Edificio O' -> 'Edificio O (Biblioteca, Centro de información, Gestión tecnológica y vinculación)'), convierte textos Likert ('1 (Totalmente en desacuerdo)') a enteros numéricos (1), y compila el archivo final.*
   *Salida:* `matriz_correlacion_ITVER.csv`

#### 3.3 Integración de Nuevos Dispositivos al Frontend
Si la infraestructura del ITVER crece, los administradores deben registrar manualmente los nuevos equipos tanto en la lógica standalone como en React:
1. **En la vista Standalone (`index.html`):** Localice el arreglo `buildings` (aprox. línea 272). Agregue el objeto JSON detallando el id, nombre, disponibilidad, errores, tráfico, nivel de satisfacción, coordenadas visuales (x, y), y el arreglo `devices` con el nombre de host del switch.
2. **En la vista React (`src/data/mockData.js`):** Actualice las constantes exportables `metricsData` (para las gráficas de barras principales), `hourlyTraffic` (para las curvas de consumo), y `quotes` (para inyectar comentarios textuales de los alumnos respecto a esa nueva zona).

---

### 4. OPERACIÓN Y MÉTRICAS ALGORÍTMICAS

#### 4.1 Lógica de Diagnóstico Técnico (Backend)
El script de correlación evalúa el CSV y asigna de forma automatizada un estatus mediante la función `diagnosticar(row)`:
- `CRÍTICO - Fallas técnicas`: Si la Disponibilidad_Promedio < 92%.
- `SATURACIÓN - Tráfico alto`: Si el InOctets_Maximo excede los 150 Mbps.
- `CALIDAD - Errores de red`: Si la Tasa_Error_Promedio > 1.0%.
- `NORMAL`: Si no se vulnera ninguno de los umbrales anteriores.

#### 4.2 Lógica de Correlación (QoS vs UX)
El motor de inteligencia del sistema, alojado en la función `nivel_corr(row)`, emite un dictamen final de congruencia:
- **✅ ALTA (Coincide):** Ocurre si la infraestructura reporta una disponibilidad menor a 92% y los estudiantes califican la UX con menos de 2.5 estrellas (comprueba que el hardware dañado sí afecta severamente al alumno).
- **✅ BAJA (Estable):** Ocurre si el hardware supera el 98% de disponibilidad y los estudiantes califican con más de 3.5 estrellas (Red sana, alumno conforme).
- **⚠️ MEDIA (Revisar cobertura):** Cualquier otro escenario (ej. Red sana pero alumno inconforme, sugiriendo problemas de interferencia física ajenos al switch).

#### 4.3 Operación del Terminal CLI (NOC Light OS)
La interfaz del administrador (activada ingresando con credenciales `admin` / `itver2026`) cuenta con una consola integrada en el panel Drilldown del mapa. Actualmente soporta los siguientes comandos operativos para diagnósticos rápidos:
- `status`: Retorna el valor en duro `CORE_UP`, confirmando comunicación simulada con el nodo core.
- `help`: Despliega los comandos disponibles (`status, clear`).
- `clear`: Limpia el historial visual (DOM) del contenedor del terminal.

---

### 5. MANTENIMIENTO Y SOLUCIÓN DE PROBLEMAS (TROUBLESHOOTING)

#### 5.1 Errores Comunes de Desarrollo y Operación
| Escenario de Falla / Síntoma | Causa Técnica | Procedimiento de Resolución |
| :--- | :--- | :--- |
| **Error `FileNotFoundError` al ejecutar el script de correlación en Python.** | El script no localiza las dependencias de datos en la ruta de ejecución actual. | 1. Valide que los archivos `metricas_itver.csv` y el CSV de respuestas de Google Forms existan en la misma carpeta desde donde ejecuta el comando.<br>2. Verifique que los nombres de los archivos no posean caracteres extraños o dobles extensiones (`.csv.csv`). |
| **El script de Python falla lanzando `IndexError: list index out of range`.** | El script no puede hallar las columnas esperadas en el CSV de la encuesta UX de Google Forms. | El código busca dinámicamente columnas usando comprensiones de listas (`[c for c in encuestas.columns if 'Edificio' in c]`). Verifique que la primera fila del CSV original contenga las palabras clave requeridas ("Edificio", "conectado", "frecuencia", "afirmaciones sobre el servicio"). |
| **El panel del administrador web muestra "Acceso Denegado".** | Autenticación modal fallida (validacion condicional estricta). | Ingrese al modal de *NOC Authentication*, introduzca `admin` en usuario y `itver2026` en contraseña, respetando mayúsculas y minúsculas. |
| **El historial de incidencias manuales y APs de Laboratorio (`lab-ap`) se borra repentinamente.** | Los datos de inserción web interactiva se persisten exclusivamente en la Web Storage API (caché del navegador local). | Al estar basado en frontend local, la limpieza del caché borra las claves `itver_logs` e `itver_aps`. Si desea resetear fallas visuales, ejecute `localStorage.clear()` en la consola del navegador (F12). |

#### 5.2 Procedimientos de Respaldo
1. **Respaldo de Resultados Analíticos (CSV):**
   El administrador debe ingresar periódicamente al tablero Bento del NOC. En el módulo inferior de "Reporte Ejecutivo", al accionar el botón **"Generar CSV"**, el navegador ejecutará la instrucción DOM `exportCSV()`. Esto iterará el arreglo `buildings` en memoria, construyendo un blob de tipo `text/csv` y forzando la descarga del archivo físico `itver_noc.csv` al disco duro.
2. **Respaldo de Estructura de Código Base:**
   El mantenimiento exige respaldar periódicamente el código fuente en las rutas `/src` (que contiene toda la lógica React, los estilos `index.css` y la data de pruebas simuladas en `/src/data/mockData.js`) y `/scripts` (núcleo matemático en Python).
   *Advertencia técnica:* Durante la migración de servidores, está prohibido respaldar el directorio `/node_modules` (dado su alto volumen de bytes). Solo se deben trasladar el `package.json` y el `package-lock.json`, ejecutando posteriormente `npm install` en el servidor destino para recompilar un entorno limpio.
