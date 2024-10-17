// app.js

// Initialize local storage if it doesn't exist
if (!localStorage.getItem('trips')) {
    localStorage.setItem('trips', JSON.stringify([]));
}

// DOM Elements
const tripForm = document.getElementById('tripForm');
const tripHistory = document.getElementById('tripHistory');

// Event Listeners
tripForm.addEventListener('submit', recordTrip);

// Functions
function recordTrip(e) {
    e.preventDefault();

    const trip = {
        id: Date.now(),
        patientName: document.getElementById('patientName').value,
        patientStatus: document.getElementById('patientStatus').value,
        origin: document.getElementById('origin').value,
        destination: document.getElementById('destination').value,
        ambulanceNumber: document.getElementById('ambulanceNumber').value,
        distance: parseFloat(document.getElementById('distance').value),
        charge: parseFloat(document.getElementById('charge').value),
        date: new Date().toISOString()
    };

    // Save trip to local storage
    const trips = JSON.parse(localStorage.getItem('trips'));
    trips.push(trip);
    localStorage.setItem('trips', JSON.stringify(trips));

    // Clear form
    tripForm.reset();

    // Update trip history
    updateTripHistory();

    // Update dashboard
    updateDashboard();
}

function updateTripHistory() {
    const trips = JSON.parse(localStorage.getItem('trips'));
    tripHistory.innerHTML = '';

    if (trips.length === 0) {
        tripHistory.innerHTML = '<p>No trips recorded yet.</p>';
        return;
    }

    const table = document.createElement('table');
    table.className = 'min-w-full divide-y divide-gray-200';
    table.innerHTML = `
        <thead class="bg-gray-50">
            <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ambulance</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charge</th>
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        </tbody>
    `;

    const tbody = table.querySelector('tbody');

    trips.forEach(trip => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">${new Date(trip.date).toLocaleDateString()}</td>
            <td class="px-6 py-4 whitespace-nowrap">${trip.patientName}</td>
            <td class="px-6 py-4 whitespace-nowrap">${trip.origin}</td>
            <td class="px-6 py-4 whitespace-nowrap">${trip.destination}</td>
            <td class="px-6 py-4 whitespace-nowrap">${trip.ambulanceNumber}</td>
            <td class="px-6 py-4 whitespace-nowrap">${trip.distance} km</td>
            <td class="px-6 py-4 whitespace-nowrap">$${(trip.distance * trip.charge).toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });

    tripHistory.appendChild(table);
}

function updateDashboard() {
    const trips = JSON.parse(localStorage.getItem('trips'));

    // Trip count by ambulance
    const tripCounts = trips.reduce((acc, trip) => {
        acc[trip.ambulanceNumber] = (acc[trip.ambulanceNumber] || 0) + 1;
        return acc;
    }, {});

    // Revenue by ambulance
    const revenue = trips.reduce((acc, trip) => {
        acc[trip.ambulanceNumber] = (acc[trip.ambulanceNumber] || 0) + (trip.distance * trip.charge);
        return acc;
    }, {});

    // Update trip chart
    const tripChartCtx = document.getElementById('tripChart').getContext('2d');
    new Chart(tripChartCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(tripCounts),
            datasets: [{
                label: 'Number of Trips',
                data: Object.values(tripCounts),
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Trips'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Ambulance Number'
                    }
                }
            }
        }
    });

    // Update revenue chart
    const revenueChartCtx = document.getElementById('revenueChart').getContext('2d');
    new Chart(revenueChartCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(revenue),
            datasets: [{
                label: 'Revenue',
                data: Object.values(revenue),
                backgroundColor: 'rgba(153, 102, 255, 0.6)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Revenue ($)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Ambulance Number'
                    }
                }
            }
        }
    });
}

// Initial update
updateTripHistory();
updateDashboard();
