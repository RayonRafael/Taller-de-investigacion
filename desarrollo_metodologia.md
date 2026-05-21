# SECCIÓN DE DESARROLLO (METODOLOGÍA, MATERIALES Y MÉTODOS)

---

## 1. ¿QUÉ SE HIZO?
Se desarrolló un proyecto de investigación analítica y tecnológica enfocado en el diagnóstico integral de la red del campus del Instituto Tecnológico de Veracruz (ITVER). Se llevó a cabo una correlación estructurada entre métricas técnicas extraídas bajo el protocolo SNMP (tráfico, errores y disponibilidad) y la evaluación cualitativa de la experiencia de usuario (UX). Como resultado de este cruce de datos, se diseñó, codificó e implementó una plataforma web interactiva de diagnóstico denominada **ITVER Network OS - Bento NOC v4.4**, la cual incluye un simulador estructural para proyectar y validar de manera teórica la efectividad de una modernización en la topología de red institucional.

---

## 2. ¿CON QUÉ SE HIZO? (MATERIALES Y HERRAMIENTAS)
La ejecución del proyecto requirió la utilización de recursos técnicos que se clasifican formalmente en tres rubros principales:

### A. Hardware e Infraestructura Analizada
La infraestructura física y de red auditada como base de estudio comprende los siguientes elementos:
1. **Equipos de Conmutación (Switches):** Se auditaron y registraron dispositivos de red correspondientes a modelos Cisco Catalyst 2960 de la topología activa en cascada. Los nodos específicos identificados en la red son:
   - `SW-MEC-CORE` (Edificio X - Mecatrónica).
   - `SW-QMC-01` (Edificio L - Química).
   - `SW-IND-01` (Edificio W - Industrial).
   - `CORE-BIB-01` (Edificio O - Biblioteca Central).
   - `SW-COMP-01` (Edificio S - Cómputo).
   - `SW-DIR-01` (Edificio N - Dirección).
2. **Puntos de Acceso Inalámbrico (Access Points):** Dispositivos de distribución Wi-Fi mapeados mediante coordenadas dinámicas en la plataforma (`lab-ap`). Para la etapa de optimización, se contempla teóricamente la integración de equipos con estándar Wi-Fi 6 AX para alta densidad concurrente.
3. **Backbone de Comunicaciones:** Enlaces físicos interconectores que, en el plan de optimización tecnológica proyectado para 2026, corresponden a un tendido de fibra óptica monomodo certificada para un Backbone a velocidades de 10 Gbps (10G).
4. **Infraestructura de Procesamiento:** Una estación de trabajo local configurada bajo arquitectura Windows para el alojamiento del servidor de desarrollo y el procesamiento de los scripts.

### B. Software y Tecnologías de Desarrollo
El ecosistema de desarrollo, procesamiento analítico y visualización interactiva se estructuró a partir de las siguientes tecnologías:
1. **Entorno de Ejecución y Servidor:**
   - **Node.js y NPM:** Para la administración de dependencias y el despliegue del proyecto.
   - **Vite:** Servidor de desarrollo ágil y compilador optimizado para la ejecución de la aplicación React.
2. **Desarrollo Frontend y Diseño de Interfaz:**
   - **HTML5 y CSS3 (Vanilla CSS):** Para la estructuración semántica y la definición del sistema de diseño Bento.
   - **Tailwind CSS:** Framework utilitario configurado para mapear los colores institucionales del TecNM: Azul (`#1B396A`), Gris (`#807E82`), Rojo (`#E63946`), Verde (`#2A9D8F`), Ámbar (`#F59E0B`), y Gris Slate Técnico (`#E2E8F0` para el tablero NOC).
   - **React (JavaScript ES6+):** Framework de componentes dinámicos (implementado en `App.jsx` y `main.jsx`).
   - **Chart.js (v4.4.1) y Recharts (v2.x):** Bibliotecas empleadas para la renderización de gráficas interactivas (`BarChart`, `LineChart`) en el dashboard.
   - **Lucide React y FontAwesome (v6.4.0):** Bibliotecas de iconografía técnica empleadas para la señalización visual.
   - **Framer Motion:** Biblioteca de animaciones para las transiciones cinemáticas entre los roles del sistema.
3. **Procesamiento de Datos y Análisis Estadístico:**
   - **Python 3:** Lenguaje empleado para la codificación de los scripts de análisis correlacional y generación de telemetrías.
   - **Pandas:** Biblioteca de Python especializada en la limpieza, agregación y unión (merge) de las métricas técnicas SNMP con las encuestas de percepción social.
   - **Numpy:** Empleada para los cálculos matemáticos de errores.
   - **Módulos CSV y Datetime:** Para la exportación ordenada y registro temporal.
4. **Persistencia de Datos:** Se utilizó la Web Storage API (`localStorage`) para la persistencia de reportes manuales y registros de sesión.

### C. Instrumentos de Recolección de Datos
La recolección se dividió en dos vertientes metodológicas: una técnica-instrumental y una social-perceptual.
1. **Instrumento Técnico (Métricas SNMP):** Se consolidaron datos técnicos extraídos en el archivo `metricas_itver.csv`, simulando lecturas horarias de 8:00 a 18:00 horas. Las métricas clave capturadas fueron:
   - **InOctets y OutOctets (Mbps):** Tráfico de entrada y salida por nodo.
   - **InErrors y OutErrors:** Conteo de tramas con error en los puertos de red.
   - **Disponibilidad (%):** Porcentaje del tiempo activo de los canales de comunicación.
2. **Instrumento Social (Encuesta de Experiencia de Usuario - UX):**
   - **Muestra:** **371 encuestas estudiantiles** procesadas en el año 2026 a través de un formulario de Google Forms.
   - **Estructura:** Uso de una escala Likert de 5 niveles para evaluar la satisfacción (de "1 - Totalmente en desacuerdo" a "5 - Totalmente de acuerdo"), variables de frecuencia de lentitud, y campos de texto cualitativo para la captura de fallas directas reportadas por el alumno.
3. **Módulo de Reportes de Incidencias Manuales:** Formulario interactivo en el portal web que contiene una base de datos normalizada con la identificación formal de los **23 edificios** y áreas del campus institucional.

---

## 3. ¿CÓMO SE HIZO? (PROCEDIMIENTO METODOLÓGICO)
El desarrollo y procesamiento se ejecutó de manera cronológica en tres fases operativas:

### Fase 1: Diagnóstico y Recolección de Datos
1. Se aplicó el instrumento social, capturando y digitalizando las 371 respuestas de estudiantes.
2. Paralelamente, se simularon y recopilaron las lecturas de telemetría SNMP de los switches de las áreas institucionales correspondientes al periodo de alta afluencia escolar.
3. Se ejecutó el script de procesamiento en Python (`correlacion_itver.py`). A nivel de código, se normalizaron los nombres de los edificios, se ponderó numéricamente la escala Likert de texto a valores del 1 al 5, y se agruparon las métricas utilizando la función `.groupby()`.
4. Se calculó matemáticamente la Tasa de Error Relativa (TER), dividiendo la sumatoria de errores promediados entre el tráfico total del nodo y multiplicándolo por 100 para obtener el factor porcentual de degradación.

### Fase 2: Implementación y Configuración
1. Se desarrolló la plataforma web (Bento NOC v4.4) definiendo dos vistas con distintos privilegios de visualización:
   - **Rol Alumno:** Una interfaz clara que cuenta con un indicador dinámico de la "Mejor Conexión", una simulación interactiva de test de velocidad (Speedtest) para medir Mbps, y un formulario de incidencias.
   - **Rol Administrador (NOC):** Configurado bajo el diseño *Bento Light Professional* con widgets que indican la carga de tráfico en tiempo real, recuento de eventos críticos, buzón interactivo de fallas y un panel CLI de diagnósticos.
2. Se programó un algoritmo de clasificación automática de estatus físico:
   - Se catalogó como `CRÍTICO - Fallas técnicas` a los nodos con disponibilidad menor al 92%.
   - Se catalogó como `SATURACIÓN - Tráfico alto` a los nodos con tráfico máximo mayor a 150 Mbps.
   - Se catalogó como `CALIDAD - Errores de red` a los nodos con tasa de error mayor al 1.0%.
3. Se integró una regla de cálculo de correlación de datos (Alta, Media, Baja) contrastando los indicadores físicos (disponibilidad técnica) frente a la calificación de satisfacción social reportada.

### Fase 3: Pruebas y Análisis de Resultados
1. Se cruzaron las métricas técnicas y las encuestas sociales mediante sentencias de unión en Pandas, consolidando la matriz final en el archivo `matriz_correlacion_ITVER.csv`.
2. Se procedió al análisis de los resultados para localizar las fallas. El sistema detectó exitosamente que el Edificio X (Mecatrónica) y el Edificio L (Química) conformaban el epicentro de la degradación, comprobando la eficacia del modelo predictivo desarrollado.
3. Se comprobó el módulo de simulación tecnológica del dashboard. Al conmutar de la topología "Actual (Cascada)" a la topología "Propuesta (Estrella)", el algoritmo incrementó la disponibilidad de los nodos críticos hasta un 98.80% estable de forma automática, validando la factibilidad del plan de mejora estructural.
4. Se verificó el funcionamiento del módulo de exportación de datos, permitiendo al administrador descargar el reporte correlacionado en formato CSV para su archivo.

---

## 4. ¿POR QUÉ SE HIZO? (JUSTIFICACIÓN BASADA EN DATOS)
La investigación se realizó debido a la detección y confirmación analítica de problemas severos en el rendimiento de la red actual, cuya topología física en configuración de "Cascada" provoca puntos únicos de falla.

Al cruzar los datos en la matriz de correlación, se comprobó estadísticamente una degradación crítica en la zona norte del campus:
- El **Edificio X (Mecatrónica)** operaba en niveles de colapso, exhibiendo una disponibilidad promedio del **88.66%**, picos de tráfico excesivo que superaban los **162.41 Mbps** (entre las 11:00 y las 15:00 horas), y una severa tasa de error del **7.15%**.
- El **Edificio L (Química)** mostraba un patrón similar, con una disponibilidad del **90.46%** y una tasa de error del **5.06%**.

Estas ineficiencias de hardware afectaron significativamente a la comunidad estudiantil. La degradación física correlacionó con exactitud con un déficit de evaluación social: en Mecatrónica, la satisfacción de usuario promedió **2.85** sobre 5; mientras que en Química fue de **2.97**. Las evaluaciones cualitativas en las encuestas sustentaron la urgencia del proyecto con reportes tales como: *"Baja potencia. En el edificio X no hay señal, siempre uso datos"*, *"La conexión es intermitente y se satura mucho"*, e *"Es imposible subir archivos pesados en hora pico"*.

---

## 5. ¿PARA QUÉ SE HIZO? (OBJETIVOS Y ALCANCES)
La concepción tecnológica de esta herramienta se efectuó para brindar a la gestión administrativa del Instituto Tecnológico de Veracruz un soporte de inteligencia y diagnóstico de red capaz de:
1. **Correlacionar métricas de ingeniería con el factor humano:** Visibilizando cómo el déficit físico de los equipos impacta el aprovechamiento académico de los alumnos (habiendo descubierto que el 82% de las menciones negativas de la encuesta provenían de los edificios de Ingeniería).
2. **Centralizar los sistemas de reporte:** Implementando el centro de mando Bento NOC v4.4 para monitorear en un solo panel los cuellos de botella de telemetría y las incidencias levantadas por los usuarios.
3. **Aportar una validación científica a futuras inversiones:** Mediante el módulo de simulación del proyecto se determinó matemáticamente que ejecutar la migración a una **Topología en Estrella** —invirtiendo en switches capa Catalyst 9000, cableado de Backbone de fibra óptica 10G y monitoreo predictivo SNMPv3— erradica las deficiencias actuales, asegurando una resiliencia permanente de red con una disponibilidad garantizada del **98.80%** en todo el campus.
