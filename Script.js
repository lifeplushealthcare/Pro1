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
        // Populate form with trip data for editing
        Object.keys(trip).forEach(key => {
            const element = document.getElementById(key);
            if (element) element.value = trip[key];
        });
        // Remove the old trip and add the updated one on form submission
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

    // Create income vs expenditure chart
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

    // Create expenditure breakdown chart
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
        <p>Stable Patients: ${patientStatusCount['stable'] || 0}</p>
        <p>Critical Patients: ${patientStatusCount['critical'] || 0}</p>
        <p>Unpredictable Patients: ${patientStatusCount['unpredictable'] || 0}</p>
    `;

    // Create patient status chart
    const ctx = document.getElementById('patientStatusChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(patientStatusCount),
            datasets: [{
                data: Object.values(patientStatusCount),
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(255, 206, 86, 0.6)'
                ]
            }]
        }
    });
}

function updateAdvancedAnalytics() {
    updateTimeSeriesAnalysis();
    updateGeographicDistribution();
    updateFinancialTrends();
}

function updateTimeSeriesAnalysis() {
    const dates = trips.map(trip => new Date(trip.date).toLocaleDateString());
    const revenues = trips.map(trip => trip.amountCharged);

    const ctx = document.getElementById('timeSeriesChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Revenue Over Time',
                data: revenues,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                }
            }
        }
    });
}

function updateGeographicDistribution() {
    const cities = [...new Set(trips.map(trip => trip.fromCity).concat(trips.map(trip => trip.toCity)))];
    const tripCounts = cities.map(city => 
        trips.filter(trip => trip.fromCity === city || trip.toCity === city).length
    );

    const ctx = document.getElementById('geographicDistribution').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: cities,
            datasets: [{
                label: 'Number of Trips',
                data: tripCounts,
                backgroundColor: 'rgba(54, 162, 235, 0.6)'
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

function updateFinancialTrends() {
    const monthlyData = trips.reduce((acc, trip) => {
        const month = new Date(trip.date).toLocaleString('default', { month: 'long' });
        if (!acc[month]) {
            acc[month] = { revenue: 0, expenditure: 0 };
        }
        acc[month].revenue += trip.amountCharged;
        acc[month].expenditure += trip.expenditure;
        return acc;
    }, {});

    const months = Object.keys(monthlyData);
    const revenues = months.map(month => monthlyData[month].revenue);
    const expenditures = months.map(month => monthlyData[month].expenditure);

    const ctx = document.getElementById('financialTrends').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Monthly Revenue',
                    data: revenues,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: false
                },
                {
                    label: 'Monthly Expenditure',
                    data: expenditures,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    fill: false
                }
            ]
        }
    });
}

function exportAllData() {
    const dataStr = JSON.stringify(trips, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'ambulance_trips_data.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function exportCSV() {
    const csv = Papa.unparse(trips);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "ambulance_trips_data.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function exportExcel() {
    const worksheet = XLSX.utils.json_to_sheet(trips);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trips");
    XLSX.writeFile(workbook, "ambulance_trips_data.xlsx");
}

function generateReport() {
    const reportType = document.getElementById('reportType').value;
    let startDate, endDate;

    switch (reportType) {
        case 'daily':
            startDate = moment().startOf('day');
            endDate = moment().endOf('day');
            break;
        case 'weekly':
            startDate = moment().startOf('week');
            endDate = moment().endOf('week');
            break;
        case 'monthly':
            startDate = moment().startOf('month');
            endDate = moment().endOf('month');
            break;
        case 'yearly':
            startDate = moment().startOf('year');
            endDate = moment().endOf('year');
            break;
        case 'custom':
            startDate = moment(document.getElementById('startDate').value);
            endDate = moment(document.getElementById('endDate').value);
            break;
    }

    const filteredTrips = trips.filter(trip => {
        const tripDate = moment(trip.date);
        return tripDate.isBetween(startDate, endDate, null, '[]');
    });

    const reportData = {
        totalTrips: filteredTrips.length,
        totalRevenue: filteredTrips.reduce((sum, trip) => sum + trip.amountCharged, 0),
        totalExpenditure: filteredTrips.reduce((sum, trip) => sum + trip.expenditure, 0),
        averageDistance: filteredTrips.reduce((sum, trip) => sum + trip.distance, 0) / filteredTrips.length || 0,
        patientStatusBreakdown: filteredTrips.reduce((acc, trip) => {
            acc[trip.patientStatus] = (acc[trip.patientStatus] || 0) + 1;
            return acc;
        }, {})
    };

    displayReport(reportData, startDate, endDate);
}

function displayReport(data, startDate, endDate) {
    const reportContainer = document.createElement('div');
    reportContainer.innerHTML = `
        <h3>Report: ${startDate.format('YYYY-MM-DD')} to ${endDate.format('YYYY-MM-DD')}</h3>
        <p>Total Trips: ${data.totalTrips}</p>
        <p>Total Revenue: ₹${data.totalRevenue.toFixed(2)}</p>
        <p>Total Expenditure: ₹${data.totalExpenditure.toFixed(2)}</p>
        <p>Net Profit: ₹${(data.totalRevenue - data.totalExpenditure).toFixed(2)}</p>
        <p>Average Trip Distance: ${data.averageDistance.toFixed(2)} km</p>
        <h4>Patient Status Breakdown:</h4>
        <ul>
            ${Object.entries(data.patientStatusBreakdown).map(([status, count]) => 
                `<li>${status}: ${count}</li>`
            ).join('')}
        </ul>
    `;

    const existingReport = document.getElementById('reportResult');
    if (existingReport) {
        existingReport.remove();
    }

    reportContainer.id = 'reportResult';
    document.getElementById('dataExportSection').appendChild(reportContainer);
}

function toggleCustomDateInputs() {
    const reportType = document.getElementById('reportType').value;
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');

    if (reportType === 'custom') {
        startDateInput.style.display = 'inline-block';
        endDateInput.style.display = 'inline-block';
    } else {
        startDateInput.style.display = 'none';
        endDateInput.style.display = 'none';
    }
}

// Initial setup
updateTripTable();
updateAnalysis();
updateFinancialRecords();
updateTripTracking();
updatePatientAnalysis();
updateAdvancedAnalytics();
