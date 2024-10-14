// Initialize trips array from localStorage or create an empty array
let trips = JSON.parse(localStorage.getItem('trips')) || [];

// DOM elements
const tripForm = document.getElementById('tripForm');
const analysisResult = document.getElementById('analysisResult');
const tripData = document.getElementById('tripData');
const financialAnalysis = document.getElementById('financialAnalysis');
const tripTrackingData = document.getElementById('tripTrackingData');
const patientAnalysisData = document.getElementById('patientAnalysisData');

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    updateTripTable();
    updateAnalysis();
    updateFinancialRecords();
    updateTripTracking();
    updatePatientAnalysis();
});

tripForm.addEventListener('submit', handleTripSubmission);
document.getElementById('cancelTrip').addEventListener('click', resetForm);
document.getElementById('exportAllData').addEventListener('click', exportAllData);
document.getElementById('exportCSV').addEventListener('click', exportCSV);
document.getElementById('exportExcel').addEventListener('click', exportExcel);
document.getElementById('generateReport').addEventListener('click', generateReport);

// Trip submission
function handleTripSubmission(e) {
    e.preventDefault();
    const newTrip = {
        id: Date.now(),
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
        distance: validateNumber('distance'),
        chargePerKm: validateNumber('chargePerKm'),
        ambulanceNumber: document.getElementById('ambulanceNumber').value,
        amountCharged: validateNumber('amountCharged'),
        expenditure: validateNumber('expenditure'),
        driverExpenditure: validateNumber('driverExpenditure'),
        fuelExpenditure: validateNumber('fuelExpenditure'),
        maintenanceExpenditure: validateNumber('maintenanceExpenditure'),
        miscellaneousExpenditure: validateNumber('miscellaneousExpenditure'),
        nursingExpenditure: validateNumber('nursingExpenditure'),
        date: new Date().toISOString()
    };

    trips.push(newTrip);
    localStorage.setItem('trips', JSON.stringify(trips));
    resetForm();
    updateTripTable();
    updateAnalysis();
    updateFinancialRecords();
    updateTripTracking();
    updatePatientAnalysis();
}

function validateNumber(id) {
    const value = parseFloat(document.getElementById(id).value);
    return isNaN(value) ? 0 : value;
}

// Reset form
function resetForm() {
    tripForm.reset();
}

// Update Trip Table
function updateTripTable() {
    tripData.innerHTML = '';
    trips.forEach(trip => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${trip.patientName}</td>
            <td>${trip.fromCity} - ${trip.fromHospital}</td>
            <td>${trip.toCity} - ${trip.toHospital}</td>
            <td>${trip.amountCharged}</td>
            <td>${trip.expenditure}</td>
            <td>${trip.patientStatus}</td>
            <td>
                <button onclick="editTrip(${trip.id})">Edit</button>
                <button onclick="deleteTrip(${trip.id})">Delete</button>
            </td>
        `;
        tripData.appendChild(row);
    });
}

// Edit Trip
function editTrip(id) {
    const trip = trips.find(t => t.id === id);
    if (trip) {
        Object.keys(trip).forEach(key => {
            const element = document.getElementById(key);
            if (element) element.value = trip[key];
        });
        trips = trips.filter(t => t.id !== id);
    }
}
// Delete Trip
function deleteTrip(id) {
    trips = trips.filter(t => t.id !== id);
    localStorage.setItem('trips', JSON.stringify(trips));
    updateTripTable();
    updateAnalysis();
    updateFinancialRecords();
    updateTripTracking();
    updatePatientAnalysis();
}

// Analysis and Charts
function updateAnalysis() {
    const totalTrips = trips.length;
    const totalRevenue = trips.reduce((sum, trip) => sum + trip.amountCharged, 0);
    const totalExpenditure = trips.reduce((sum, trip) => sum + trip.expenditure, 0);
    const profit = totalRevenue - totalExpenditure;

    analysisResult.innerHTML = `
        <p>Total Trips: ${totalTrips}</p>
        <p>Total Revenue: ₹${totalRevenue.toFixed(2)}</p>
        <p>Total Expenditure: ₹${totalExpenditure.toFixed(2)}</p>
        <p>Profit: ₹${profit.toFixed(2)}</p>
    `;
    renderChart('incomeExpenditureChart', ['Revenue', 'Expenditure'], [totalRevenue, totalExpenditure], 'bar');
}

function updateFinancialRecords() {
    const totalRevenue = trips.reduce((sum, trip) => sum + trip.amountCharged, 0);
    const totalExpenditure = trips.reduce((sum, trip) => sum + trip.expenditure, 0);
    const driverExpenditure = trips.reduce((sum, trip) => sum + trip.driverExpenditure, 0);
    const fuelExpenditure = trips.reduce((sum, trip) => sum + trip.fuelExpenditure, 0);
    const maintenanceExpenditure = trips.reduce((sum, trip) => sum + trip.maintenanceExpenditure, 0);
    const miscellaneousExpenditure = trips.reduce((sum, trip) => sum + trip.miscellaneousExpenditure, 0);
    const nursingExpenditure = trips.reduce((sum, trip) => sum + trip.nursingExpenditure, 0);

    financialAnalysis.innerHTML = `
        <p>Total Revenue: ₹${totalRevenue.toFixed(2)}</p>
        <p>Total Expenditure: ₹${totalExpenditure.toFixed(2)}</p>
        <p>Net Profit: ₹${(totalRevenue - totalExpenditure).toFixed(2)}</p>
    `;
    renderChart('expenditureBreakdownChart', ['Driver', 'Fuel', 'Maintenance', 'Miscellaneous', 'Nursing'],
        [driverExpenditure, fuelExpenditure, maintenanceExpenditure, miscellaneousExpenditure, nursingExpenditure], 'pie');
}

// Tracking trips
function updateTripTracking() {
    const totalDistance = trips.reduce((sum, trip) => sum + trip.distance, 0);
    const averageDistance = totalDistance / trips.length || 0;
    const mostFrequentRoute = getMostFrequentRoute();

    tripTrackingData.innerHTML = `
        <p>Total Distance Covered: ${totalDistance.toFixed(2)} km</p>
        <p>Average Trip Distance: ${averageDistance.toFixed(2)} km</p>
        <p>Most Frequent Route: ${mostFrequentRoute}</p>
    `;
}

function getMostFrequentRoute() {
    const routeCounts = {};
    trips.forEach(trip => {
        const route = `${trip.fromCity} to ${trip.toCity}`;
        routeCounts[route] = (routeCounts[route] || 0) + 1;
    });
    return Object.entries(routeCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
}

// Patient analysis
function updatePatientAnalysis() {
    const patientStatusCount = trips.reduce((count, trip) => {
        count[trip.patientStatus] = (count[trip.patientStatus] || 0) + 1;
        return count;
    }, {});

    patientAnalysisData.innerHTML = Object.entries(patientStatusCount).map(([status, count]) => {
        return `<p>${status}: ${count}</p>`;
    }).join('');

    renderChart('patientStatusChart', Object.keys(patientStatusCount), Object.values(patientStatusCount), 'doughnut');
}

// Generic Chart rendering function
function renderChart(elementId, labels, data, type) {
    const ctx = document.getElementById(elementId).getContext('2d');
    new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: 'Amount (INR)',
                data: data,
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)']
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
