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
    updateAdvancedAnalytics();
});

tripForm.addEventListener('submit', handleTripSubmission);
document.getElementById('cancelTrip').addEventListener('click', resetForm);
document.getElementById('exportAllData').addEventListener('click', exportAllData);
document.getElementById('exportCSV').addEventListener('click', exportCSV);
document.getElementById('exportExcel').addEventListener('click', exportExcel);
document.getElementById('generateReport').addEventListener('click', generateReport);
document.getElementById('reportType').addEventListener('change', toggleCustomDateInputs);

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
        distance: parseFloat(document.getElementById('distance').value),
        chargePerKm: parseFloat(document.getElementById('chargePerKm').value),
        ambulanceNumber: document.getElementById('ambulanceNumber').value,
        amountCharged: parseFloat(document.getElementById('amountCharged').value),
        expenditure: parseFloat(document.getElementById('expenditure').value),
        driverExpenditure: parseFloat(document.getElementById('driverExpenditure').value),
        fuelExpenditure: parseFloat(document.getElementById('fuelExpenditure').value),
        maintenanceExpenditure: parseFloat(document.getElementById('maintenanceExpenditure').value),
        miscellaneousExpenditure: parseFloat(document.getElementById('miscellaneousExpenditure').value),
        nursingExpenditure: parseFloat(document.getElementById('nursingExpenditure').value),
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
    updateAdvancedAnalytics();
}

function resetForm() {
    tripForm.reset();
}

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
function deleteTrip(id) {
    trips = trips.filter(t => t.id !== id);
    localStorage.setItem('trips', JSON.stringify(trips));
    updateTripTable();
    updateAnalysis();
    updateFinancialRecords();
    updateTripTracking();
    updatePatientAnalysis();
    updateAdvancedAnalytics();
}

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

    const ctx = document.getElementById('incomeExpenditureChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Revenue', 'Expenditure'],
            datasets: [{
                label: 'Amount (INR)',
                data: [totalRevenue, totalExpenditure],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)']
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

    const ctx = document.getElementById('expenditureBreakdownChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Driver', 'Fuel', 'Maintenance', 'Miscellaneous', 'Nursing'],
            datasets: [{
                data: [driverExpenditure, fuelExpenditure, maintenanceExpenditure, miscellaneousExpenditure, nursingExpenditure],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)'
                ]
            }]
        }
    });
}

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

function updatePatientAnalysis() {
    const patientStatusCount = trips.reduce((count, trip) => {
        count[trip.patientStatus] = (count[trip.patientStatus] || 0) + 1;
        return count;
    }, {});

    patientAnalysisData.innerHTML = `
        <p>Object.entries(patientStatusCount).map(([status, count]) => {
        return `<p>${status}: ${count}</p>`;
    }).join('');

    const ctx = document.getElementById('patientStatusChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(patientStatusCount),
            datasets: [{
                label: 'Patient Status Count',
                data: Object.values(patientStatusCount),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)'
                ]
            }]
        }
    });
}

function updateAdvancedAnalytics() {
    // Additional analytics can be added here.
}

function exportAllData() {
    // Implement export logic for all data
}

function exportCSV() {
    // Implement CSV export logic
}

function exportExcel() {
    // Implement Excel export logic
}

function generateReport() {
    // Implement report generation logic
}

function toggleCustomDateInputs() {
    const reportType = document.getElementById('reportType').value;
    const customDateInputs = document.getElementById('customDateInputs');
    customDateInputs.style.display = reportType === 'custom' ? 'block' : 'none';
}
