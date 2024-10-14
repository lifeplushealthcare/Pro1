// Existing code...

// New functions for advanced analytics
function updateAdvancedAnalytics() {
    updateTimeSeriesChart();
    updateGeographicDistribution();
    updateFinancialTrends();
}

function updateTimeSeriesChart() {
    const ctx = document.getElementById('timeSeriesChart').getContext('2d');
    const dailyData = getDailyTripData();

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dailyData.dates,
            datasets: [{
                label: 'Number of Trips',
                data: dailyData.tripCounts,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Daily Trip Count'
            }
        }
    });
}

function getDailyTripData() {
    const tripDates = trips.map(trip => moment(trip.date).format('YYYY-MM-DD'));
    const uniqueDates = [...new Set(tripDates)].sort();
    const tripCounts = uniqueDates.map(date => 
        trips.filter(trip => moment(trip.date).format('YYYY-MM-DD') === date).length
    );

    return { dates: uniqueDates, tripCounts };
}

function updateGeographicDistribution() {
    const cityData = {};
    trips.forEach(trip => {
        cityData[trip.fromCity] = (cityData[trip.fromCity] || 0) + 1;
        cityData[trip.toCity] = (cityData[trip.toCity] || 0) + 1;
    });

    const ctx = document.getElementById('geographicDistribution').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(cityData),
            datasets: [{
                label: 'Number of Trips',
                data: Object.values(cityData),
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Geographic Distribution of Trips'
            }
        }
    });
}

function updateFinancialTrends() {
    const monthlyData = getMonthlyFinancialData();

    const ctx = document.getElementById('financialTrends').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthlyData.months,
            datasets: [{
                label: 'Income',
                data: monthlyData.income,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }, {
                label: 'Expenditure',
                data: monthlyData.expenditure,
                borderColor: 'rgba(255, 99, 132, 1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Monthly Financial Trends'
            }
        }
    });
}

function getMonthlyFinancialData() {
    const monthlyData = trips.reduce((acc, trip) => {
        const month = moment(trip.date).format('YYYY-MM');
        if (!acc[month]) {
            acc[month] = { income: 0, expenditure: 0 };
        }
        acc[month].income += trip.amountCharged;
        acc[month].expenditure += trip.expenditure;
        return acc;
    }, {});

    const sortedMonths = Object.keys(monthlyData).sort();
    const income = sortedMonths.map(month => monthlyData[month].income);
    const expenditure = sortedMonths.map(month => monthlyData[month].expenditure);

    return { months: sortedMonths, income, expenditure };
}

// Enhanced export functions
function exportAllData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(trips, null, 2));
    downloadFile(dataStr, 'ambulance_trip_data.json');
}

function exportCSV() {
    const csv = Papa.unparse(trips);
    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    downloadFile(dataStr, 'ambulance_trip_data.csv');
}

function exportExcel() {
    const worksheet = XLSX.utils.json_to_sheet(trips);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trips");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataStr = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," + btoa(String.fromCharCode.apply(null, new Uint8Array(excelBuffer)));
    downloadFile(dataStr, 'ambulance_trip_data.xlsx');
}

function downloadFile(dataStr, filename) {
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", filename);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Enhanced report generation
function generateReport() {
    const reportType = document.getElementById('reportType').value;
    let startDate, endDate;

    if (reportType === 'custom') {
        startDate = new Date(document.getElementById('startDate').value);
        endDate = new Date(document.getElementById('endDate').value);
    } else {
        const dateRange = getDateRange(reportType);
        startDate = dateRange.startDate;
        endDate = dateRange.endDate;
    }

    const reportData = getReportData(startDate, endDate);
    
    const reportWindow = window.open('', 'Report', 'width=800,height=600');
    reportWindow.document.write(`
        <h2>${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</h2>
        <p>Period: ${startDate.toDateString()} - ${endDate.toDateString()}</p>
        <pre>${JSON.stringify(reportData, null, 2)}</pre>
        <button onclick="window.print()">Print</button>
    `);
}

function getDateRange(reportType) {
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

    return { startDate, endDate: now };
}

function getReportData(startDate, endDate) {
    const filteredTrips = trips.filter(trip => {
        const tripDate = new Date(trip.date);
        return tripDate >= startDate && tripDate <= endDate;
    });

    const totalIncome = filteredTrips.reduce((sum, trip) => sum + trip.amountCharged, 0);
    const totalExpenditure = filteredTrips.reduce((sum, trip) => sum + trip.expenditure, 0);

    return {
        totalTrips: filteredTrips.length,
        totalIncome,
        totalExpenditure,
        netProfit: totalIncome - totalExpenditure,
        averageTripDistance: getAverageTripDistance(filteredTrips),
        mostVisitedCities: getMostVisitedCities(filteredTrips, 5),
        patientStatusDistribution: getPatientStatusDistribution(filteredTrips)
    };
}

function getAverageTripDistance(trips) {
    const totalDistance = trips.reduce((sum, trip) => sum + trip.distance, 0);
    return totalDistance / trips.length;
}

function getMostVisitedCities(trips, limit) {
    const cityCount = {};
    trips.forEach(trip => {
        cityCount[trip.fromCity] = (cityCount[trip.fromCity] || 0) + 1;
        cityCount[trip.toCity] = (cityCount[trip.toCity] || 0) + 1;
    });
    return Object.entries(cityCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([city, count]) => ({ city, count }));
}

function getPatientStatusDistribution(trips) {
    const statusCount = {};
    trips.forEach(trip => {
        statusCount[trip.patientStatus] = (statusCount[trip.patientStatus] || 0) + 1;
    });
    return Object.entries(statusCount).map(([status, count]) => ({ status, count }));
}

// Event listeners
document.getElementById('exportCSV').addEventListener('click', exportCSV);
document.getElementById('exportExcel').addEventListener('click', exportExcel);
document.getElementById('reportType').addEventListener('change', function() {
    const customDateInputs = document.getElementById('startDate').style;
    const endDateInput = document.getElementById('endDate').style;
    if (this.value === 'custom') {
        customDateInputs.display = 'inline-block';
        endDateInput.display = 'inline-block';
    } else {
        customDateInputs.display = 'none';
        endDateInput.display = 'none';
    }
});

// Initialize the page
updateTripTable();
updateAnalysis();
updateFinancialAnalysis();
updateTripTracking();
updatePatientAnalysis();
updateAdvancedAnalytics();
