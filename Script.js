// Initialize Supabase client
const supabaseUrl = 'https://izzsrjmsplyjrtzdjqds.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6enNyam1zcGx5anJ0emRqcWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkwMDIwNTYsImV4cCI6MjA0NDU3ODA1Nn0.VAQohVppf0bDpIX0FA-8SWGPJq-jAz_2Q5Y5QQmLvdA';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// DOM elements
const newTripForm = document.getElementById('newTripForm');
const tripHistoryList = document.getElementById('tripHistoryList');
const totalEarnings = document.getElementById('totalEarnings');
const totalExpenditures = document.getElementById('totalExpenditures');
const netProfit = document.getElementById('netProfit');

// Event listeners
newTripForm.addEventListener('submit', handleNewTrip);

// Functions to show/hide sections
function showSection(sectionId) {
    const sections = ['tripForm', 'tripHistory', 'financialDashboard', 'analytics'];
    sections.forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');

    if (sectionId === 'tripHistory') {
        loadTripHistory();
    } else if (sectionId === 'financialDashboard') {
        loadFinancialDashboard();
    } else if (sectionId === 'analytics') {
        loadAnalytics();
    }
}

// Handle new trip submission
async function handleNewTrip(event) {
    event.preventDefault();
    const formData = new FormData(newTripForm);
    const tripData = Object.fromEntries(formData.entries());

    // Calculate total charges
    tripData.totalCharges = tripData.distance * tripData.chargePerKm;

    try {
        const { data, error } = await supabase
            .from('trips')
            .insert([tripData]);

        if (error) throw error;
        alert('Trip submitted successfully!');
        newTripForm.reset();
    } catch (error) {
        console.error('Error submitting trip:', error);
        alert('Failed to submit trip. Please try again.');
    }
}

// Load trip history
async function loadTripHistory() {
    try {
        const { data, error } = await supabase
            .from('trips')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        tripHistoryList.innerHTML = '';
        data.forEach(trip => {
            const tripElement = document.createElement('div');
            tripElement.className = 'bg-white p-4 rounded shadow mb-4';
            tripElement.innerHTML = `
                <h3 class="font-semibold">${trip.patientName}</h3>
                <p>From: ${trip.fromCity} (${trip.fromHospital})</p>
                <p>To: ${trip.toCity} (${trip.toHospital})</p>
                <p>Amount Charged: $${trip.amountCharged}</p>
                <p>Status: ${trip.patientStatus}</p>
                <p>Driver: ${trip.driverName}</p>
                <p>Nursing Staff: ${trip.nursingStaff}</p>
                <p>Ambulance: ${trip.ambulance}</p>
                <p>Distance: ${trip.distance} km</p>
                <p>Total Charges: $${trip.totalCharges}</p>
                <button onclick="cancelTrip(${trip.id})" class="bg-red-500 text-white px-2 py-1 rounded mt-2">Cancel Trip</button>
            `;
            tripHistoryList.appendChild(tripElement);
        });
    } catch (error) {
        console.error('Error loading trip history:', error);
        alert('Failed to load trip history. Please try again.');
    }
}

// Cancel a trip
async function cancelTrip(tripId) {
    try {
        const { data, error } = await supabase
            .from('trips')
            .update({ cancelled: true })
            .eq('id', tripId);

        if (error) throw error;
        alert('Trip cancelled successfully!');
        loadTripHistory(); // Reload trip history
    } catch (error) {
        console.error('Error cancelling trip:', error);
        alert('Failed to cancel trip. Please try again.');
    }
}
// Load financial dashboard
async function loadFinancialDashboard() {
    try {
        const { data, error } = await supabase
            .from('trips')
            .select('amountCharged, driverExpense, fuelExpense, maintenanceExpense, nursingStaffExpense')
            .eq('cancelled', false);

        if (error) throw error;

        const earnings = data.reduce((sum, trip) => sum + trip.amountCharged, 0);
        const expenditures = data.reduce((sum, trip) => 
            sum + trip.driverExpense + trip.fuelExpense + trip.maintenanceExpense + trip.nursingStaffExpense, 0);
        const profit = earnings - expenditures;

        totalEarnings.textContent = `$${earnings.toFixed(2)}`;
        totalExpenditures.textContent = `$${expenditures.toFixed(2)}`;
        netProfit.textContent = `$${profit.toFixed(2)}`;

        updateFinancialChart(earnings, expenditures, profit);
        loadFinancialBreakdown();
    } catch (error) {
        console.error('Error loading financial dashboard:', error);
        alert('Failed to load financial dashboard. Please try again.');
    }
}

// Update financial chart
function updateFinancialChart(earnings, expenditures, profit) {
    const ctx = document.getElementById('financialChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Earnings', 'Expenditures', 'Profit'],
            datasets: [{
                label: 'Financial Overview',
                data: [earnings, expenditures, profit],
                backgroundColor: ['#4CAF50', '#F44336', '#2196F3']
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

// Load financial breakdown
async function loadFinancialBreakdown() {
    try {
        const { data, error } = await supabase
            .from('trips')
            .select('driverExpense, fuelExpense, maintenanceExpense, nursingStaffExpense')
            .eq('cancelled', false);

        if (error) throw error;

        const breakdown = data.reduce((acc, trip) => {
            acc.driverExpense += trip.driverExpense;
            acc.fuelExpense += trip.fuelExpense;
            acc.maintenanceExpense += trip.maintenanceExpense;
            acc.nursingStaffExpense += trip.nursingStaffExpense;
            return acc;
        }, { driverExpense: 0, fuelExpense: 0, maintenanceExpense: 0, nursingStaffExpense: 0 });

        updateFinancialBreakdownChart(breakdown);
    } catch (error) {
        console.error('Error loading financial breakdown:', error);
        alert('Failed to load financial breakdown. Please try again.');
    }
}

// Update financial breakdown chart
function updateFinancialBreakdownChart(breakdown) {
    const ctx = document.getElementById('financialBreakdownChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Driver', 'Fuel', 'Maintenance', 'Nursing Staff'],
            datasets: [{
                data: [
                    breakdown.driverExpense,
                    breakdown.fuelExpense,
                    breakdown.maintenanceExpense,
                    breakdown.nursingStaffExpense
                ],
                backgroundColor: ['#FF9800', '#2196F3', '#4CAF50', '#9C27B0']
            }]
        }
    });
}

// Load analytics
async function loadAnalytics() {
    loadTripsPerDay();
    loadPatientStatusDistribution();
    loadTripPerformance();
    loadGeographicAnalysis();
}

// Load trips per day chart
async function loadTripsPerDay() {
    try {
        const { data, error } = await supabase
            .from('trips')
            .select('created_at')
            .eq('cancelled', false);

        if (error) throw error;

        const tripsPerDay = data.reduce((acc, trip) => {
            const date = new Date(trip.created_at).toLocaleDateString();
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        updateTripsPerDayChart(tripsPerDay);
    } catch (error) {
        console.error('Error loading trips per day:', error);
        alert('Failed to load trips per day. Please try again.');
    }
}

// Update trips per day chart
function updateTripsPerDayChart(tripsPerDay) {
    const ctx = document.getElementById('tripsPerDayChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(tripsPerDay),
            datasets: [{
                label: 'Trips per Day',
                data: Object.values(tripsPerDay),
                borderColor: '#2196F3',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}
// Load patient status distribution
async function loadPatientStatusDistribution() {
    try {
        const { data, error } = await supabase
            .from('trips')
            .select('patientStatus')
            .eq('cancelled', false);

        if (error) throw error;

        const statusDistribution = data.reduce((acc, trip) => {
            acc[trip.patientStatus] = (acc[trip.patientStatus] || 0) + 1;
            return acc;
        }, {});

        updatePatientStatusChart(statusDistribution);
    } catch (error) {
        console.error('Error loading patient status distribution:', error);
        alert('Failed to load patient status distribution. Please try again.');
    }
}

// Update patient status chart
function updatePatientStatusChart(statusDistribution) {
    const ctx = document.getElementById('patientStatusChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(statusDistribution),
            datasets: [{
                data: Object.values(statusDistribution),
                backgroundColor: ['#4CAF50', '#F44336', '#FFC107']
            }]
        }
    });
}

// Load trip performance
async function loadTripPerformance() {
    try {
        const { data, error } = await supabase
            .from('trips')
            .select('ambulance, distance, amountCharged')
            .eq('cancelled', false);

        if (error) throw error;

        const performanceData = data.reduce((acc, trip) => {
            if (!acc[trip.ambulance]) {
                acc[trip.ambulance] = { totalDistance: 0, totalAmount: 0, tripCount: 0 };
            }
            acc[trip.ambulance].totalDistance += trip.distance;
            acc[trip.ambulance].totalAmount += trip.amountCharged;
            acc[trip.ambulance].tripCount += 1;
            return acc;
        }, {});

        updateTripPerformanceChart(performanceData);
    } catch (error) {
        console.error('Error loading trip performance:', error);
        alert('Failed to load trip performance. Please try again.');
    }
}

// Update trip performance chart
function updateTripPerformanceChart(performanceData) {
    const ctx = document.getElementById('tripPerformanceChart').getContext('2d');
    const labels = Object.keys(performanceData);
    const avgDistances = labels.map(ambulance => performanceData[ambulance].totalDistance / performanceData[ambulance].tripCount);
    const avgAmounts = labels.map(ambulance => performanceData[ambulance].totalAmount / performanceData[ambulance].tripCount);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Avg Distance (km)',
                    data: avgDistances,
                    backgroundColor: '#2196F3'
                },
                {
                    label: 'Avg Amount ($)',
                    data: avgAmounts,
                    backgroundColor: '#4CAF50'
                }
            ]
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

// Load geographic analysis
async function loadGeographicAnalysis() {
    try {
        const { data, error } = await supabase
            .from('trips')
            .select('fromCity, toCity')
            .eq('cancelled', false);

        if (error) throw error;

        const cityData = data.reduce((acc, trip) => {
            acc[trip.fromCity] = (acc[trip.fromCity] || 0) + 1;
            acc[trip.toCity] = (acc[trip.toCity] || 0) + 1;
            return acc;
        }, {});

        updateGeographicAnalysisChart(cityData);
    } catch (error) {
        console.error('Error loading geographic analysis:', error);
        alert('Failed to load geographic analysis. Please try again.');
    }
}

// Update geographic analysis chart
function updateGeographicAnalysisChart(cityData) {
    const ctx = document.getElementById('geographicAnalysisChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(cityData),
            datasets: [{
                label: 'Trips per City',
                data: Object.values(cityData),
                backgroundColor: '#9C27B0'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Export data to CSV
function exportToCSV() {
    supabase
        .from('trips')
        .select('*')
        .eq('cancelled', false)
        .then(({ data, error }) => {
            if (error) throw error;

            const csvContent = "data:text/csv;charset=utf-8," 
                + Object.keys(data[0]).join(",") + "\n"
                + data.map(row =>
