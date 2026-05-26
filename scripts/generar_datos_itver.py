import csv
import random
import datetime

# Configuración de edificios del ITVER (basado en tu mapa)
edificios = [
    {"nombre": "Edificio A (UDIM)", "base_traffic": 50, "error_rate": 0.1},
    {"nombre": "Edificio L (Lab. de química general)", "base_traffic": 80, "error_rate": 2.5}, # Crítico: Alta saturación
    {"nombre": "Edificio X (Lab. de Mecatrónica)", "base_traffic": 90, "error_rate": 4.0}, # Crítico: Falla cascada
    {"nombre": "Edificio W (Lab. de industrial)", "base_traffic": 60, "error_rate": 1.5},
    {"nombre": "Edificio Q (Aulas Ciencias económico administrativas)", "base_traffic": 70, "error_rate": 0.5},
    {"nombre": "Edificio O (Biblioteca, Centro de información, Gestión tecnológica y vinculación)", "base_traffic": 45, "error_rate": 0.2},
    {"nombre": "Edificio U (Sistemas y computación, Centro de cómputo)", "base_traffic": 60, "error_rate": 0.2},
    {"nombre": "Edificio N (Planta alta: Dirección, Subdirección de planeación y vinculación, Subdirección de servicios administrativos, Recursos financieros. Planta baja: Servicios escolares, Recursos humanos, Planeación, programación y presupuestación)", "base_traffic": 30, "error_rate": 0.1},
    {"nombre": "Edificio M (Subdirección académica, Desarrollo académico, División de estudios profesionales, División de estudios de posgrado e investigación)", "base_traffic": 30, "error_rate": 0.1},
    {"nombre": "Edificio T (Lab. de eléctrica-electrónica)", "base_traffic": 50, "error_rate": 0.5},
    {"nombre": "Edificio D (Lab. de química pesada, Lab. de electrónica, Planta Piloto de Bioetanol 2G)", "base_traffic": 50, "error_rate": 0.3}
]

# Horarios: 8:00 a 18:00
horarios = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

# Abrir archivo CSV
with open('metricas_itver.csv', mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    # Encabezados
    writer.writerow(["Fecha", "Hora", "Edificio", "InOctets (Mbps)", "OutOctets (Mbps)", "InErrors", "OutErrors", "Disponibilidad (%)"])

    for hora in horarios:
        h_int = int(hora.split(":")[0])
        
        for ed in edificios:
            # Simulación de hora pico (Intermedia 11:00 - 15:00)
            factor_hora = 1.0
            if 11 <= h_int <= 15:
                factor_hora = 1.8 # Aumento de tráfico
            
            # Generación de tráfico (Mbit/s)
            traffic_in = (ed["base_traffic"] * factor_hora) + random.uniform(-5, 5)
            traffic_out = (traffic_in * 0.4) + random.uniform(-2, 2)
            
            # Generación de Errores (simulando inestabilidad en X y L)
            # Si es edificio crítico, aumentamos errores en hora pico
            base_errors = ed["error_rate"]
            if hora in ["11:00", "12:00", "13:00", "14:00"] and ed["nombre"] in ["Edificio L (Lab. de química general)", "Edificio X (Lab. de Mecatrónica)"]:
                base_errors *= 3 # Triplicamos errores en cascada
            
            errors_in = max(0, base_errors * random.uniform(0.5, 2.0))
            errors_out = errors_in * 0.8
            
            # Disponibilidad (Si hay muchos errores, baja la disponibilidad)
            disp = 100 - (errors_in * 2)
            if disp < 85: disp = 85 # Límite inferior para la simulación

            writer.writerow([
                "2026-04-29", 
                hora, 
                ed["nombre"], 
                f"{traffic_in:.2f}", 
                f"{traffic_out:.2f}", 
                f"{errors_in:.2f}", 
                f"{errors_out:.2f}", 
                f"{disp:.2f}"
            ])

print("[OK] Archivo 'metricas_itver.csv' generado con exito.")