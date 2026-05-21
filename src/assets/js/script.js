// --- Datos del Proyecto ---

const buildings = [
    { id: 'X', name: 'Edificio X (Mecatrónica)', disp: 88.66, err: 7.15, sat: 2.8, status: 'critico', quote: "En el edificio X no hay señal, siempre uso datos para mis clases de diseño." },
    { id: 'L', name: 'Edificio L (Química)', disp: 90.46, err: 5.05, sat: 2.9, status: 'critico', quote: "La conexión es intermitente cuando estamos en los laboratorios pesados." },
    { id: 'W', name: 'Edificio W (Industrial)', disp: 97.06, err: 1.66, sat: 3.0, status: 'estable', quote: "Es aceptable, aunque se satura en horas pico de mediodía." },
    { id: 'A', name: 'Edificio A (UDIM)', disp: 99.77, err: 0.15, sat: 4.2, status: 'estable', quote: "Excelente conexión para investigación." },
    { id: 'S', name: 'Edificio S (Cómputo)', disp: 99.45, err: 0.30, sat: 4.1, status: 'estable', quote: "Muy estable para las prácticas de programación." },
    { id: 'B', name: 'Biblioteca', disp: 99.77, err: 0.20, sat: 4.5, status: 'estable', quote: "La mejor zona para estudiar con internet fluido." },
    { id: 'N', name: 'Edificio N (Dirección)', disp: 99.74, err: 0.28, sat: 4.3, status: 'estable', quote: "Servicio prioritario sin interrupciones detectadas." }
];

const proposedData = {
    'X': { disp: 99.2, err: 0.5 },
    'L': { disp: 98.8, err: 0.4 },
    'W': { disp: 99.5, err: 0.2 }
};

const hourlyTraffic = [
    { hora: '08:00', X: 94, L: 75, P: 55 },
    { hora: '10:00', X: 110, L: 85, P: 60 },
    { hora: '12:00', X: 159, L: 139, P: 91 },
    { hora: '14:00', X: 161, L: 147, P: 93 },
    { hora: '16:00', X: 89, L: 77, P: 51 },
    { hora: '18:00', X: 93, L: 83, P: 54 }
];

// --- Variables Globales ---
let barChart, lineChart;
let currentTopology = 'actual';
let presentationInterval;

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    renderTable(buildings);
    initMapMarkers();
});

// --- Funcionalidad 1: Mapa Interactivo ---
function initMapMarkers() {
    // Los marcadores ya están en el HTML con sus posiciones absolutas.
}

function openModal(buildingId) {
    const building = buildings.find(b => b.id === buildingId);
    if (!building) return;

    document.getElementById('modal-title').textContent = building.name;
    document.getElementById('modal-disp').textContent = `${building.disp}%`;
    document.getElementById('modal-err').textContent = `${building.err} avg/h`;
    document.getElementById('modal-quote-text').textContent = `"${building.quote}"`;

    const modal = document.getElementById('map-modal');
    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('map-modal').classList.add('hidden');
}

// --- Funcionalidad 2: Simulador Antes vs Después ---
function setTopology(type) {
    currentTopology = type;
    
    // UI Update
    document.getElementById('toggle-actual').classList.toggle('active', type === 'actual');
    document.getElementById('toggle-propuesta').classList.toggle('active', type === 'propuesta');

    // Update Charts
    updateChartsData(type);

    // Update KPIs
    if (type === 'propuesta') {
        document.getElementById('kpi-criticos').textContent = 'Ninguno';
        document.getElementById('kpi-disponibilidad').textContent = '98.80%';
        document.getElementById('kpi-latencia').textContent = '4.2 ms';
        document.getElementById('kpi-latencia').classList.add('text-tecnm-green');
    } else {
        document.getElementById('kpi-criticos').textContent = 'Edificio X, L';
        document.getElementById('kpi-disponibilidad').textContent = '88.66%';
        document.getElementById('kpi-latencia').textContent = '24.85 ms';
        document.getElementById('kpi-latencia').classList.remove('text-tecnm-green');
    }
}

function updateChartsData(type) {
    const newData = buildings.map(b => {
        if (type === 'propuesta' && proposedData[b.id]) {
            return proposedData[b.id].disp;
        }
        return b.disp;
    });

    barChart.data.datasets[0].data = newData;
    
    // Cambiar colores si es propuesta
    barChart.data.datasets[0].backgroundColor = newData.map(v => 
        v < 92 ? '#E63946' : v < 96 ? '#F59E0B' : '#2A9D8F'
    );

    barChart.update('none'); // Update without full re-render for smoothness

    // Simulamos que el tráfico mejora (menos variabilidad)
    if (type === 'propuesta') {
        lineChart.data.datasets[0].data = hourlyTraffic.map(d => d.X * 0.8);
        lineChart.data.datasets[1].data = hourlyTraffic.map(d => d.L * 0.85);
    } else {
        lineChart.data.datasets[0].data = hourlyTraffic.map(d => d.X);
        lineChart.data.datasets[1].data = hourlyTraffic.map(d => d.L);
    }
    lineChart.update();
}

// --- Funcionalidad 3: Filtros en Tiempo Real ---
function filterTable(status) {
    // Update Filter Buttons
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase().includes(status) || (status === 'all' && btn.textContent === 'Todos'));
    });

    // Filter Logic
    const filteredBuildings = status === 'all' ? buildings : buildings.filter(b => b.status === status);
    renderTable(filteredBuildings);

    // Filter Bar Chart
    barChart.data.labels = filteredBuildings.map(b => b.name.split(' ')[1]);
    barChart.data.datasets[0].data = filteredBuildings.map(b => b.disp);
    barChart.data.datasets[0].backgroundColor = filteredBuildings.map(b => 
        b.disp < 92 ? '#E63946' : b.disp < 96 ? '#F59E0B' : '#2A9D8F'
    );
    barChart.update();
}

function renderTable(data) {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = '';

    data.forEach(b => {
        const tr = document.createElement('tr');
        tr.setAttribute('data-status', b.status);
        tr.innerHTML = `
            <td><strong>${b.name}</strong></td>
            <td>${b.disp}%</td>
            <td>${b.sat} / 5</td>
            <td><span class="badge badge-${b.status}">${b.status}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

// --- Funcionalidad 4: Modo Presentación (Kiosk) ---
let isKiosk = false;
function togglePresentation() {
    isKiosk = !isKiosk;
    const body = document.body;
    const timerEl = document.getElementById('presentation-timer');

    if (isKiosk) {
        body.classList.add('kiosk-mode');
        timerEl.classList.remove('hidden');
        startTimer(300); // 5 minutes
        document.getElementById('presentation-btn').textContent = "❌ Salir Presentación";
    } else {
        body.classList.remove('kiosk-mode');
        timerEl.classList.add('hidden');
        clearInterval(presentationInterval);
        document.getElementById('presentation-btn').textContent = "📽️ Modo Presentación";
    }
}

function startTimer(seconds) {
    let timeLeft = seconds;
    const timerEl = document.getElementById('presentation-timer');

    presentationInterval = setInterval(() => {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        timerEl.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

        if (timeLeft <= 0) {
            clearInterval(presentationInterval);
            timerEl.classList.add('text-tecnm-red');
        } else {
            timeLeft--;
        }
    }, 1000);
}

// --- Chart JS Init ---
function initCharts() {
    const barCtx = document.getElementById('barChart').getContext('2d');
    barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: buildings.map(b => b.name.split(' ')[1]),
            datasets: [{
                label: 'Disponibilidad %',
                data: buildings.map(b => b.disp),
                backgroundColor: buildings.map(b => b.disp < 92 ? '#E63946' : b.disp < 96 ? '#F59E0B' : '#2A9D8F'),
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: false, min: 80, max: 100 }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });

    const lineCtx = document.getElementById('lineChart').getContext('2d');
    lineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: hourlyTraffic.map(d => d.hora),
            datasets: [
                {
                    label: 'Edificio X',
                    data: hourlyTraffic.map(d => d.X),
                    borderColor: '#E63946',
                    backgroundColor: 'rgba(230, 57, 70, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Edificio L',
                    data: hourlyTraffic.map(d => d.L),
                    borderColor: '#F59E0B',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}
