<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ambulance Business Trip Manager</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js"></script>
</head>
<body class="bg-gray-100">
    <nav class="bg-blue-600 text-white p-4">
        <h1 class="text-2xl font-bold">Ambulance Business Trip Manager</h1>
    </nav>

    <div class="container mx-auto mt-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Trip Recording Form -->
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-xl font-semibold mb-4">Record New Trip</h2>
                <form id="tripForm">
                    <div class="mb-4">
                        <label for="patientName" class="block text-sm font-medium text-gray-700">Patient Name</label>
                        <input type="text" id="patientName" name="patientName" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                    </div>
                    <div class="mb-4">
                        <label for="patientStatus" class="block text-sm font-medium text-gray-700">Patient Status</label>
                        <select id="patientStatus" name="patientStatus" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                            <option value="stable">Stable</option>
                            <option value="critical">Critical</option>
                            <option value="unpredictable">Unpredictable</option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label for="origin" class="block text-sm font-medium text-gray-700">Origin</label>
                        <input type="text" id="origin" name="origin" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                    </div>
                    <div class="mb-4">
                        <label for="destination" class="block text-sm font-medium text-gray-700">Destination</label>
                        <input type="text" id="destination" name="destination" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                    </div>
                    <div class="mb-4">
                        <label for="ambulanceNumber" class="block text-sm font-medium text-gray-700">Ambulance Number</label>
                        <select id="ambulanceNumber" name="ambulanceNumber" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                            <option value="1">Ambulance 1</option>
                            <option value="2">Ambulance 2</option>
                            <option value="3">Ambulance 3</option>
                            <option value="4">Ambulance 4</option>
                            <option value="5">Ambulance 5</option>
                            <option value="6">Ambulance 6</option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label for="distance" class="block text-sm font-medium text-gray-700">Distance (km)</label>
                        <input type="number" id="distance" name="distance" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                    </div>
                    <div class="mb-4">
                        <label for="charge" class="block text-sm font-medium text-gray-700">Charge (per km)</label>
                        <input type="number" id="charge" name="charge" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                    </div>
                    <button type="submit" class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                        Record Trip
                    </button>
                </form>
            </div>

            <!-- Trip History -->
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-xl font-semibold mb-4">Trip History</h2>
                <div id="tripHistory" class="overflow-x-auto">
                    <!-- Trip history will be populated here -->
                </div>
            </div>
        </div>

        <!-- Dashboard -->
        <div class="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold mb-4">Dashboard</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <canvas id="tripChart"></canvas>
                </div>
                <div>
                    <canvas id="revenueChart"></canvas>
                </div>
            </div>
        </div>
    </div>

    <script src="app.js"></script>
</body>
</html>
