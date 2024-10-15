// Initialize trips array from localStorage or create an empty array
let trips = JSON.parse(localStorage.getItem('trips')) || [];

// DOM elements
const tripForm = document.getElementById('tripForm');
const tripTable = document.getElementById('tripData');
const analysisResult = document.getElementById('analysisResult');
const incomeExpenditureChart = document.getElementById('incomeExpenditureChart');
const financialAnalysis = document.getElementById('financialAnalysis');
const tripTrackingData = document.getElementById('tripTrackingData');
const patientAnalysisData = document.getElementById('patientAnalysisData');

// Event listeners
tripForm.addEventListener('submit', handleTripSubmission);
document.getElementById('cancelTrip').addEventListener('click', handleTripCancellation);
document.getElementById('exportAllData').addEventListener('click', exportAllData);
document.getElementById('generateReport').addEventListener('click', generateReport);

// Handle trip submission
function handleTripSubmission(e) {
    e.preventDefault();
    
    const newTrip = {
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
        distance: parseFloat(document.getElementById('distance').value) || 0,
        chargePerKm: parseFloat(document.getElementById('chargePerKm').value) || 0,
        ambulanceNumber: document.getElementById('ambulanceNumber').value,
        amountCharged: parseFloat(document.getElementById('amountCharged').value),
        expenditure: parseFloat(document.getElementById('expenditure').value),
        driverExpenditure: parseFloat(document.getElementById('driverExpenditure').value),
        fuelExpenditure: parseFloat(document.getElementById('fuelExpenditure').value),
        maintenanceExpenditure: parseFloat(document.getElementById('maintenanceExpenditure').value),
        miscellaneousExpenditure: parseFloat(document.getElementById('miscellaneousExpenditure').value),
        nursingExpenditure: parseFloat(document.getElementById('nursingExpenditure').value),
        status: 'Completed',
        date: new Date().toISOString()
    };

    trips.push(newTrip);
    saveTrips();
    updateTripTable();
    updateAnalysis();
    updateFinancialAnalysis();
    updateTripTracking();
    updatePatientAnalysis();
    tripForm.reset();
}

// Handle trip cancellation
function handleTripCancellation() {
    const cancelledTrip = {
        patientName: document.getElementById('patientName').value,
        fromCity: document.getElementById('fromCity').value,
        toCity: document.getElementById('toCity').value,
        status: 'Cancelled',
        date: new Date().toISOString()
    };

    trips.push(cancelledTrip);
    saveTrips();
    updateTripTable();
    updateAnalysis();
    updateFinancialAnalysis();
    updateTripTracking();
    updatePatientAnalysis();
    tripForm.reset();
}

// Save trips to localStorage
function saveTrips() {
    localStorage.setItem('trips', JSON.stringify(trips));
}

// Update trip table
function updateTripTable() {
    tripTable.innerHTML = '';
    trips.forEach((trip, index) => {
        const row = tripTable.insertRow();
        row.innerHTML = `
            <td>${trip.patientName}</td>
            <td>${trip.fromCity}</td>
            <td>${trip.toCity}</td>
            <td>${trip.amountCharged || 'N/A'}</td>
            <td>${trip.expenditure || 'N/A'}</td>
            <td>${trip.status}</td>
            <td><button onclick="viewTripDetails(${index})">View Details</button></td>
        `;
    });
}

// ... (previous code remains the same)

// View trip details
function viewTripDetails(index) {
    const trip = trips[index];
    const detailsWindow = window.open('', 'Trip Details', 'width=600,height=600');
    detailsWindow.document.write(`
        <h2>Trip Details</h2>
        <pre>${JSON.stringify(trip, null, 2)}</pre>
        <button onclick="window.print()">Print</button>
    `);
}

// Update analysis
function updateAnalysis() {
    const completedTrips = trips.filter(trip => trip.status === 'Completed');
    const totalIncome = completedTrips.reduce((sum, trip) => sum + trip.amountCharged, 0);
    const totalExpenditure = completedTrips.reduce((sum, trip) => sum + trip.expenditure, 0);
    const netProfit = totalIncome - totalExpenditure;

    analysisResult.innerHTML = `
        <p>Total Income: ₹${totalIncome.toFixed(2)}</p>
        <p>Total Expenditure: ₹${totalExpenditure.toFixed(2)}</p>
        <p>Net Profit: ₹${netProfit.toFixed(2)}</p>
    `;

    updateIncomeExpenditureChart(totalIncome, totalExpenditure);
}

// Update income/expenditure chart
function updateIncomeExpenditureChart(income, expenditure) {
    const ctx = incomeExpenditureChart.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Income', 'Expenditure'],
            datasets: [{
                label: 'Amount (INR)',
                data: [income, expenditure],
                backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1
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

// Update financial analysis
function updateFinancialAnalysis() {
    const completedTrips = trips.filter(trip => trip.status === 'Completed');
    const totalDriverExpenditure = completedTrips.reduce((sum, trip) => sum + trip.driverExpenditure, 0);
    const totalFuelExpenditure = completedTrips.reduce((sum, trip) => sum + trip.fuelExpenditure, 0);
    const totalMaintenanceExpenditure = completedTrips.reduce((sum, trip) => sum + trip.maintenanceExpenditure, 0);
    const totalMiscellaneousExpenditure = completedTrips.reduce((sum, trip) => sum + trip.miscellaneousExpenditure, 0);
    const totalNursingExpenditure = completedTrips.reduce((sum, trip) => sum + trip.nursingExpenditure, 0);

    financialAnalysis.innerHTML = `
        <h3>Expenditure Breakdown</h3>
        <p>Driver Expenditure: ₹${totalDriverExpenditure.toFixed(2)}</p>
        <p>Fuel Expenditure: ₹${totalFuelExpenditure.toFixed(2)}</p>
        <p>Maintenance Expenditure: ₹${totalMaintenanceExpenditure.toFixed(2)}</p>
        <p>Miscellaneous Expenditure: ₹${totalMiscellaneousExpenditure.toFixed(2)}</p>
        <p>Nursing Expenditure: ₹${totalNursingExpenditure.toFixed(2)}</p>
    `;

    // Expenditure breakdown chart
    const ctx = document.getElementById('expenditureBreakdownChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Driver', 'Fuel', 'Maintenance', 'Miscellaneous', 'Nursing'],
            datasets: [{
                data: [totalDriverExpenditure, totalFuelExpenditure, totalMaintenanceExpenditure, totalMiscellaneousExpenditure, totalNursingExpenditure],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)'
                ]
            }]
        }
    });
}

// Update trip tracking
function updateTripTracking() {
    const cityData = {};
    const hospitalData = {};

    trips.forEach(trip => {
        cityData[trip.fromCity] = (cityData[trip.fromCity] || 0) + 1;
        cityData[trip.toCity] = (cityData[trip.toCity] || 0) + 1;
        hospitalData[trip.fromHospital] = (hospitalData[trip.fromHospital] || 0) + 1;
        hospitalData[trip.toHospital] = (hospitalData[trip.toHospital] || 0) + 1;
    });

    tripTrackingData.innerHTML = `
        <h3>Most Visited Cities</h3>
        <ul>${Object.entries(cityData).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([city, count]) => `<li>${city}: ${count} trips</li>`).join('')}</ul>
        <h3>Most Visited Hospitals</h3>
        <ul>${Object.entries(hospitalData).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([hospital, count]) => `<li>${hospital}: ${count} trips</li>`).join('')}</ul>
    `;
}

// Update patient analysis
function updatePatientAnalysis() {
    const statusData = {};
    trips.forEach(trip => {
        statusData[trip.patientStatus] = (statusData[trip.patientStatus] || 0) + 1;
    });

    patientAnalysisData.innerHTML = `
        <h3>Patient Status Distribution</h3>
        <ul>${Object.entries(statusData).map(([status, count]) => `<li>${status}: ${count} patients</li>`).join('')}</ul>
    `;

    // Patient status chart
    const ctx = document.getElementById('patientStatusChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(statusData),
            datasets: [{
                data: Object.values(statusData),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)'
                ]
            }]
        }
    });
}

// Generate report
function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const reportData = getReportData(reportType);
    
    const reportWindow = window.open('', 'Report', 'width=800,height=600');
    reportWindow.document.write(`
        <h2>${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</h2>
        <pre>${JSON.stringify(reportData, null, 2)}</pre>
        <button onclick="window.print()">Print</button>
    `);
}

// Get report data
function getReportData(reportType) {
    const now = new Date();
    let startDate;

    switch(reportType) {
        case 'daily':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        case 'weekly':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
            break;
        case 'monthly':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        case 'yearly':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
    }

    const filteredTrips = trips.filter(trip => new Date(trip.date) >= startDate);
    const totalIncome = filteredTrips.reduce((sum, trip) => sum + trip.amountCharged, 0);
    const totalExpenditure = filteredTrips.reduce((sum, trip) => sum + trip.expenditure, 0);

    return {
        period: reportType,
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
        totalTrips: filteredTrips.length,
        totalIncome,
        totalExpenditure,
        netProfit: totalIncome - totalExpenditure
    };
}

// Export all data
function exportAllData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(trips, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "ambulance_trip_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Initialize the page
updateTripTable();
updateAnalysis();
updateFinancialAnalysis();
updateTripTracking();
updatePatientAnalysis();
