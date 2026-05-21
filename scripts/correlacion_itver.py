import pandas as pd
import numpy as np

# ==================== CARGA DE DATOS ====================
print("📂 Cargando datos...")

try:
    metricas = pd.read_csv('metricas_itver.csv')
    encuestas = pd.read_csv('Diagnóstico de Calidad de Servicio (QoS) y Experiencia de Usuario - Red ITVER (Respuestas) - Respuestas de formulario 1.csv')
    print("✅ Archivos cargados correctamente.")
except FileNotFoundError as e:
    print(f"❌ Error: No se encontró el archivo. Verifica que los CSV estén en la misma carpeta.")
    exit()

# Limpieza inicial de nombres de columnas (elimina espacios extra al inicio/final)
encuestas.columns = encuestas.columns.str.strip()
metricas.columns = metricas.columns.str.strip()

# ==================== PROCESAMIENTO DE ENCUESTAS ====================
print("📊 Procesando encuestas...")

# 1. Mapeo de Edificios (Normalización de nombres)
mapeo_edificios = {
    'Edificio O': 'Edificio O (Biblioteca)',
    'Edificio E': 'Edificio E',
    'Edificio U': 'Edificio U',
    'Edificio W': 'Edificio W (Industrial)',
    'Edificio L': 'Edificio L (Química)',
    'Edificio X': 'Edificio X (Mecatrónica)',
    'Edificio K': 'Edificio K',
    'Palomar': 'Palomar',
    'Escuela': 'General',
    'Casa': 'Externo',
}

def extraer_edificio(valor):
    if pd.isna(valor): return 'No especificado'
    valor = str(valor).strip()
    if ',' in valor: valor = valor.split(',')[0].strip()
    if 'Edificios' in valor: valor = valor.replace('Edificios', 'Edificio').strip()
    return mapeo_edificios.get(valor, valor)

# Asumimos que la columna del edificio tiene este nombre (típico de Google Forms)
col_edificio = [c for c in encuestas.columns if 'Edificio' in c and 'conectado' in c][0]
encuestas['Edificio_Normalizado'] = encuestas[col_edificio].apply(extraer_edificio)

# 2. Procesamiento de Likert (Escala 1-5)
likert_map = {
    '1 (Totalmente en desacuerdo)': 1, '2 (En desacuerdo)': 2, 
    '3 (Neutral)': 3, '4 (De acuerdo)': 4, '5 (Totalmente de acuerdo)': 5
}

# Buscar automáticamente las columnas Likert
likert_cols = [c for c in encuestas.columns if 'afirmaciones sobre el servicio' in c]

for col in likert_cols:
    encuestas[col] = encuestas[col].map(likert_map)

# Calcular promedio general de satisfacción
encuestas['Satisfaccion_Promedio'] = encuestas[likert_cols].mean(axis=1)

# 3. Procesamiento de Frecuencia de Lentitud
col_frecuencia = [c for c in encuestas.columns if 'frecuencia' in c.lower()][0]
encuestas[col_frecuencia] = pd.to_numeric(encuestas[col_frecuencia], errors='coerce')

# Agrupación por edificio
satisfaccion_por_edificio = encuestas.groupby('Edificio_Normalizado').agg(
    Satisfaccion_Promedio=('Satisfaccion_Promedio', 'mean'),
    Total_Encuestas=('Edificio_Normalizado', 'count'),
    Frecuencia_Lentitud=(col_frecuencia, 'mean')
).round(2)

satisfaccion_por_edificio = satisfaccion_por_edificio.reset_index()

# ==================== PROCESAMIENTO DE MÉTRICAS TÉCNICAS ====================
print("⚙️ Procesando métricas técnicas...")

metricas_por_edificio = metricas.groupby('Edificio').agg(
    InOctets_Promedio=('InOctets (Mbps)', 'mean'),
    InOctets_Maximo=('InOctets (Mbps)', 'max'),
    InErrors_Promedio=('InErrors', 'mean'),
    OutErrors_Promedio=('OutErrors', 'mean'),
    Disponibilidad_Promedio=('Disponibilidad (%)', 'mean')
).round(2).reset_index()

# Calcular tasa de error relativa
metricas_por_edificio['Tasa_Error_Promedio'] = (
    (metricas_por_edificio['InErrors_Promedio'] + metricas_por_edificio['OutErrors_Promedio']) / 
    (metricas_por_edificio['InOctets_Promedio'] + metricas_por_edificio['InOctets_Promedio']) * 100
).round(3) # Corrección lógica: usar tráfico total como denominador

# ==================== CORRELACIÓN ====================
print("🔗 Cruzando datos (Técnico vs Usuario)...")

correlacion = pd.merge(metricas_por_edificio, satisfaccion_por_edificio, 
                       left_on='Edificio', right_on='Edificio_Normalizado', how='outer')

# Diagnóstico Automático
def diagnosticar(row):
    if pd.isna(row['Disponibilidad_Promedio']): return 'Sin datos técnicos'
    if row['Disponibilidad_Promedio'] < 92: return 'CRÍTICO - Fallas técnicas'
    if row['InOctets_Maximo'] > 150: return 'SATURACIÓN - Tráfico alto'
    if row['Tasa_Error_Promedio'] > 1.0: return 'CALIDAD - Errores de red'
    return 'NORMAL'

correlacion['Diagnostico_Tecnico'] = correlacion.apply(diagnosticar, axis=1)

# Nivel de Correlación
def nivel_corr(row):
    if pd.isna(row['Satisfaccion_Promedio']) or pd.isna(row['Disponibilidad_Promedio']): return 'N/A'
    if row['Disponibilidad_Promedio'] < 92 and row['Satisfaccion_Promedio'] < 2.5: return '✅ ALTA (Coincide)'
    if row['Disponibilidad_Promedio'] > 98 and row['Satisfaccion_Promedio'] > 3.5: return '✅ BAJA (Estable)'
    return '️ MEDIA (Revisar cobertura)'

correlacion['Correlacion'] = correlacion.apply(nivel_corr, axis=1)

# ==================== EXPORTAR RESULTADOS ====================
final_cols = ['Edificio', 'Disponibilidad_Promedio', 'Tasa_Error_Promedio', 'InOctets_Maximo', 
              'Satisfaccion_Promedio', 'Total_Encuestas', 'Frecuencia_Lentitud', 'Diagnostico_Tecnico', 'Correlacion']

resultado_final = correlacion[final_cols].sort_values('Satisfaccion_Promedio')
resultado_final.to_csv('matriz_correlacion_ITVER.csv', index=False, encoding='utf-8-sig')

print("\n" + "="*60)
print("🚀 ¡ANÁLISIS COMPLETADO CON ÉXITO!")
print("="*60)
print("📄 Se ha generado: 'matriz_correlacion_ITVER.csv'")
print(" Edificios Críticos (Disp < 92%):")
print(correlacion[correlacion['Disponibilidad_Promedio'] < 92][['Edificio', 'Disponibilidad_Promedio', 'Satisfaccion_Promedio']])
print("="*60)