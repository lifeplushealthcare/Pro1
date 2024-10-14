// Initialize trips array from localStorage or create an empty array
let trips = JSON.parse(localStorage.getItem('trips')) || [];

// DOM elements
const tripForm = document.getElementById('tripForm');
const tripTable = document.getElementById('tripData');
const analysisResult = document.getElementById('analysisResult');
const incomeExpenditureChart = document.getElementById('incomeExpenditureChart');
const patientStatusChart = document.getElementById('patientStatusChart');
const financialAnalysis = document.getElementById('financialAnalysis');
const exportButton = document.getElementById('exportButton');

// Event listeners
tripForm.addEventListener('submit', handleTripSubmission);
exportButton.addEventListener('click', exportToCSV);

// Handle trip submission
function handleTripSubmission(e) {
    e.preventDefault();
    
    // Validate form inputs
    const patientName = document.getElementById('patientName').value;
    const amountCharged = parseFloat(document.getElementById('amountCharged').value);
    const expenditure = parseFloat(document.getElementById('expenditure').value);

    if (!patientName || isNaN(amountCharged) || isNaN(expenditure)) {
        alert('Please fill in all required fields correctly.');
        return;
    }

    const newTrip = {
        patientName,
        fromCity: document.getElementById('fromCity').value,
        toCity: document.getElementById('toCity').value,
        amountCharged,
        expenditure,
        patientStatus: document.getElementById('patientStatus').value,
        paymentMethod: document.getElementById('paymentMethod').value,
        status: 'Completed',
        date: new Date().toISOString()
    };

    trips.push(newTrip);
    saveTrips();
    updateTripTable();
    updateAnalysis();
    updateFinancialAnalysis();
    updateDashboard();
    tripForm.reset();
}

// Save trips to localStorage
function saveTrips() {
    localStorage.setItem('trips', JSON.stringify(trips));
}

// Update trip table
function updateTripTable() {
    tripTable.innerHTML = '';
    trips.forEach((trip) => {
        const row = tripTable.insertRow();
        row.innerHTML = `
            <td>${trip.patientName}</td>
            <td>${trip.fromCity}</td>
            <td>${trip.toCity}</td>
            <td>₹${trip.amountCharged.toFixed(2)}</td>
            <td>₹${trip.expenditure.toFixed(2)}</td>
            <td>${trip.status}</td>
            <td>${trip.paymentMethod}</td>
        `;
    });
}

// Update analysis
function updateAnalysis() {
    const totalIncome = trips.reduce((sum, trip) => sum + trip.amountCharged, 0);
    const totalExpenditure = trips.reduce((sum, trip) => sum + trip.expenditure, 0);
    const netProfit = totalIncome - totalExpenditure;

    analysisResult.innerHTML = `
        <p>Total Income: ₹${totalIncome.toFixed(2)}</p>
        <p>Total Expenditure: ₹${totalExpenditure.toFixed(2)}</p>
        <p>Net Profit: ₹${netProfit.toFixed(2)}</p>
    `;

    updateIncomeExpenditureChart(totalIncome, totalExpenditure);
    updatePatientStatusChart();
}

// Update income expenditure chart
function updateIncomeExpenditureChart(income, expenditure) {
    new Chart(incomeExpenditureChart, {
        type: 'bar',
        data: {
            labels: ['Income', 'Expenditure'],
            datasets: [{
                label: 'Amount (₹)',
                data: [income, expenditure],
                backgroundColor: ['#2ecc71', '#e74c3c']
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

// Update patient status chart
function updatePatientStatusChart() {
    const statusCounts = trips.reduce((counts, trip) => {
        counts[trip.patientStatus] = (counts[trip.patientStatus] || 0) + 1;
        return counts;
    }, {});

    new Chart(patientStatusChart, {
        type: 'pie',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: ['#3498db', '#f1c40f', '#e74c3c']
            }]
        }
    });
}

// Update financial analysis
function updateFinancialAnalysis() {
    const totalIncome = trips.reduce((sum, trip) => sum + trip.amountCharged, 0);
    const totalExpenses = trips.reduce((sum, trip) => sum + trip.expenditure, 0);
    const profit = totalIncome - totalExpenses;
    const onlinePayments = trips.filter(trip => trip.paymentMethod === 'online').reduce((sum, trip) => sum + trip.amountCharged, 0);
    const offlinePayments = trips.filter(trip => trip.paymentMethod === 'offline').reduce((sum, trip) => sum + trip.amountCharged, 0);

    financialAnalysis.innerHTML = `
        <p>Total Income: ₹${totalIncome.toFixed(2)}</p>
        <p>Total Expenses: ₹${totalExpenses.toFixed(2)}</p>
        <p>Profit: ₹${profit.toFixed(2)}</p>
        <p>Online Payments: ₹${onlinePayments.toFixed(2)}</p>
        <p>Offline Payments: ₹${offlinePayments.toFixed(2)}</p>
    `;
}

// Update dashboard
function updateDashboard() {
    document.getElementById('kpiTotalTrips').textContent = trips.length;
    document.getElementById('kpiTotalRevenue').textContent = `₹${trips.reduce((sum, trip) => sum + trip.amountCharged, 0).toFixed(2)}`;
    document.getElementById('kpiTotalExpenses').textContent = `₹${trips.reduce((sum, trip) => sum + trip.expenditure, 0).toFixed(2)}`;
}

// Export to CSV
function exportToCSV() {
    const csvContent = [
        ['Patient Name', 'From City', 'To City', 'Amount Charged', 'Expenditure', 'Patient Status', 'Payment Method', 'Status', 'Date'],
        ...trips.map(trip => [
            trip.patientName,
            trip.fromCity,
            trip.toCity,
            trip.amountCharged,
            trip.expenditure,
            trip.patientStatus,
            trip.paymentMethod,
            trip.status,
            trip.date
        ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'trip_data.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Initial update
updateTripTable();
updateAnalysis();
updateFinancialAnalysis();
updateDashboard();
