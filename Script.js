// Initialize local storage
if (!localStorage.getItem('trips')) {
    localStorage.setItem('trips', JSON.stringify([]));
}

// DOM elements
const tripForm = document.getElementById('tripForm');
const tripList = document.getElementById('tripList');
const searchInput = document.getElementById('searchInput');
const searchCriteria = document.getElementById('searchCriteria');
const searchButton = document.getElementById('searchButton');
const analysisResult = document.getElementById('analysisResult');
const tripChart = document.getElementById('tripChart');
const exportJSON = document.getElementById('exportJSON');
const exportCSV = document.getElementById('exportCSV');
const reportType = document.getElementById('reportType');
const customDateRange = document.getElementById('customDateRange');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const generateReport = document.getElementById('generateReport');

// Event listeners
tripForm.addEventListener('submit', addTrip);
searchButton.addEventListener('click', searchTrips);
exportJSON.addEventListener('click', exportAsJSON);
exportCSV.addEventListener('click', exportAsCSV);
reportType.addEventListener('change', toggleCustomDateRange);
generateReport.addEventListener('click', generateTripReport);

// Load trips on page load
loadTrips();
updateAnalysis();

// Add new trip
function addTrip(e) {
    e.preventDefault();
    const trip = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        patientName: document.getElementById('patientName').value,
        patientDetails: document.getElementById('patientDetails').value,
        fromCity: document.getElementById('fromCity').value,
        fromHospital: document.getElementById('fromHospital').value,
        toCity: document.getElementById('toCity').value,
        toHospital: document.getElementById('toHospital').value,
        driverName: document.getElementById('driverName').value,
        nursingStaff: document.getElementById('nursingStaff').value,
        patientStatus: document.getElementById('patientStatus').value,
        statusDescription: document.getElementById('statusDescription').value,
        distance: parseFloat(document.getElementById('distance').value),
        chargePerKm: parseFloat(document.getElementById('chargePerKm').value),
        ambulanceNumber: document.getElementById('ambulanceNumber').value,
        amountCharged: parseFloat(document.getElementById('amountCharged').value),
        paymentMethod: document.getElementById('paymentMethod').value,
        expenditure: parseFloat(document.getElementById('expenditure').value),
        driverExpenditure: parseFloat(document.getElementById('driverExpenditure').value),
        fuelExpenditure: parseFloat(document.getElementById('fuelExpenditure').value),
        maintenanceExpenditure: parseFloat(document.getElementById('maintenanceExpenditure').value),
        miscellaneousExpenditure: parseFloat(document.getElementById('miscellaneousExpenditure').value),
        nursingExpenditure: parseFloat(document.getElementById('nursingExpenditure').value)
    };

    const trips = JSON.parse(localStorage.getItem('trips'));
    trips.push(trip);
    localStorage.setItem('trips', JSON.stringify(trips));

    tripForm.reset();
    loadTrips();
    updateAnalysis();
}

// Load trips
function loadTrips() {
    const trips = JSON.parse(localStorage.getItem('trips'));
    displayTrips(trips);
}

// Display trips
function displayTrips(trips) {
    tripList.innerHTML = '';
    trips.forEach(trip => {
        const tripElement = document.createElement('div');
        tripElement.innerHTML = `
            <p><strong>Date:</strong> ${trip.date}</p>
            <p><strong>Patient:</strong> ${trip.patientName}</p>
            <p><strong>From:</strong> ${trip.fromCity} (${trip.fromHospital})</p>
            <p><strong>To:</strong> ${trip.toCity} (${trip.toHospital})</p>
            <p><strong>Ambulance:</strong> ${trip.ambulanceNumber}</p>
            <p><strong>Amount Charged:</strong> ₹${trip.amountCharged.toFixed(2)}</p>
            <p><strong>Status:</strong> ${trip.patientStatus}</p>
            <hr>
        `;
        tripList.appendChild(tripElement);
    });
}

// Search trips
function searchTrips() {
    const searchTerm = searchInput.value.toLowerCase();
    const criteria = searchCriteria.value;
    const trips = JSON.parse(localStorage.getItem('trips'));

    const filteredTrips = trips.filter(trip => {
        if (criteria === 'date') {
            return trip.date.includes(searchTerm);
        } else if (criteria === 'amountCharged') {
            return trip.amountCharged.toString().includes(searchTerm);
        } else {
            return trip[criteria].toLowerCase().includes(searchTerm);
        }
    });

    displayTrips(filteredTrips);
}

// Update analysis
function updateAnalysis() {
    const trips = JSON.parse(localStorage.getItem('trips'));
    const totalRevenue = trips.reduce((sum, trip) => sum + trip.amountCharged, 0);
    const totalExpenditure = trips.reduce((sum, trip) => sum + trip.expenditure, 0);
    const totalProfit = totalRevenue - totalExpenditure;

    analysisResult.innerHTML = `
        <p><strong>Total Revenue:</strong> ₹${totalRevenue.toFixed(2)}</p>
        <p><strong>Total Expenditure:</strong> ₹${totalExpenditure.toFixed(2)}</p>
        <p><strong>Total Profit:</strong> ₹${totalProfit.toFixed(2)}</p>
    `;

    updateChart(trips);
}

// Update chart
function updateChart(trips) {
    if (tripChart.chart) {
        tripChart.chart.destroy();
    }

    const ctx = tripChart.getContext('2d');
    const labels = trips.map(trip => trip.date);
    const revenues = trips.map(trip => trip.amountCharged);
    const expenditures = trips.map(trip => trip.expenditure);

    tripChart.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Revenue',
                    data: revenues,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                },
                {
                    label: 'Expenditure',
                    data: expenditures,
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Export as JSON
function exportAsJSON() {
    const trips = JSON.parse(localStorage.getItem('trips'));
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(trips));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "ambulance_trips.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Export as CSV
function exportAsCSV() {
    const trips = JSON.parse(localStorage.getItem('trips'));
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Patient Name,From City,From Hospital,To City,To Hospital,Driver Name,Nursing Staff,Patient Status,Distance,Charge per km,Ambulance Number,Amount Charged,Payment Method,Total Expenditure,Driver Expenditure,Fuel Expenditure,Maintenance Expenditure,Miscellaneous Expenditure,Nursing Expenditure\n";
    
    trips.forEach(trip => {
        const row = [
            trip.date, trip.patientName, trip.fromCity, trip.fromHospital, trip.toCity, trip.toHospital,
            trip.driverName, trip.nursingStaff, trip.patientStatus, trip.distance, trip.chargePerKm,
            trip.ambulanceNumber, trip.amountCharged, trip.paymentMethod, trip.expenditure,
            trip.driverExpenditure, trip.fuelExpenditure, trip.maintenanceExpenditure,
            trip.miscellaneousExpenditure, trip.nursingExpenditure
        ].join(',');
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ambulance_trips.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Toggle custom date range
function toggleCustomDateRange() {
    if (reportType.value === 'custom') {
        customDateRange.style.display = 'block';
    } else {
        customDateRange.style.display = 'none';
    }
}

// Generate trip report
function generateTripReport() {
    const trips = JSON.parse(localStorage.getItem('trips'));
    let filteredTrips = [];
    const currentDate = new Date();

    switch (reportType.value) {
        case 'daily':
            filteredTrips = trips.filter(trip => trip.date === currentDate.toISOString().split('T')[0]);
            break;
        case 'weekly':
            const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
            filteredTrips = trips.filter(trip => new Date(trip.date) >= oneWeekAgo);
            break;
        case 'monthly':
            const oneMonthAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
            filteredTrips = trips.filter(trip => new Date(trip.date) >= oneMonthAgo);
            break;
        case 'yearly':
            const oneYearAgo = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());
            filteredTrips = trips.filter(trip => new Date(trip.date) >= oneYearAgo);
            break;
        case 'custom':
            const start = new Date(startDate.value);
            const end = new Date(endDate.value);
            filteredTrips = trips.filter(trip => {
                const tripDate = new Date(trip.date);
                return tripDate >= start && tripDate <= end;
            });
            break;
    }

    displayTrips(filteredTrips);
    updateAnalysis();
}

// Initial load
loadTrips();
updateAnalysis();
