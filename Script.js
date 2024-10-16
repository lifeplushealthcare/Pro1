document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('tripEntryForm');
    const tripTableBody = document.querySelector('#tripTable tbody');

    // Load existing trips from localStorage
    const trips = JSON.parse(localStorage.getItem('trips')) || [];

    // Display existing trips
    function displayTrips() {
        tripTableBody.innerHTML = '';
        trips.forEach((trip, index) => {
            const row = `<tr>
                <td>${trip.patientName}</td>
                <td>${trip.originCity}</td>
                <td>${trip.destinationHospital}</td>
                <td>${trip.ambulanceSelect}</td>
                <td>${trip.tripStatus}</td>
            </tr>`;
            tripTableBody.innerHTML += row;
        });
    }

    // Handle form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const tripData = {
            patientName: form.patientName.value,
            contactInfo: form.contactInfo.value,
            patientStatus: form.patientStatus.value,
            originCity: form.originCity.value,
            destinationHospital: form.destinationHospital.value,
            staffDriver: form.staffDriver.value,
            staffNurse: form.staffNurse.value,
            distance: form.distance.value,
            charges: form.charges.value,
            ambulanceSelect: form.ambulanceSelect.value,
            paymentMode: form.paymentMode.value,
            expenses: form.expenses.value,
            tripStatus: form.tripStatus.value,
        };

        // Save trip data in localStorage
        trips.push(tripData);
        localStorage.setItem('trips', JSON.stringify(trips));

        // Display updated trips
        displayTrips();

        // Reset the form
        form.reset();
    });

    // Initialize trip display
    displayTrips();
});
