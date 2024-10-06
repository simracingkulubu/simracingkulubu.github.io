function millisecondsToLapTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
}

function calculateBodyToWeightRatio(weight, horsepower) {
    return (weight / horsepower).toFixed(2);
}

function generateTableRows(data) {
    const tbody = document.getElementById('lap-times-body');
    tbody.innerHTML = ''; // Clear existing rows
    data.forEach(lap => {
        const bodyToWeightRatio = calculateBodyToWeightRatio(lap["Car Weight (kg)"], lap["Car Horsepower (hp)"]);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${lap.Track}</td>
            <td>${lap.Date}</td>
            <td>${lap.Time}</td>
            <td>${lap.Driver}</td>
            <td>${lap.Car}</td>
            <td>${lap["Car Drivetrain"]}</td>
            <td>${lap["Car Weight (kg)"]}</td>
            <td>${lap["Car Horsepower (hp)"]}</td>
            <td>${bodyToWeightRatio}</td>
            <td>${millisecondsToLapTime(lap["Lap Time (ms)"])}</td>
        `;
        tbody.appendChild(row);
    });
}

function populateFilterOptions() {
    const tracks = new Set();
    const drivers = new Set();
    const cars = new Set();
    const drivetrains = new Set();

    racingTimings.forEach(lap => {
        tracks.add(lap.Track);
        drivers.add(lap.Driver);
        cars.add(lap.Car);
        drivetrains.add(lap["Car Drivetrain"]);
    });

    const trackSelect = document.getElementById('filter-track');
    tracks.forEach(track => {
        const option = document.createElement('option');
        option.value = track;
        option.textContent = track;
        trackSelect.appendChild(option);
    });

    const driverSelect = document.getElementById('filter-driver');
    drivers.forEach(driver => {
        const option = document.createElement('option');
        option.value = driver;
        option.textContent = driver;
        driverSelect.appendChild(option);
    });

    const carSelect = document.getElementById('filter-car');
    cars.forEach(car => {
        const option = document.createElement('option');
        option.value = car;
        option.textContent = car;
        carSelect.appendChild(option);
    });

    const drivetrainSelect = document.getElementById('filter-drivetrain');
    drivetrains.forEach(drivetrain => {
        const option = document.createElement('option');
        option.value = drivetrain;
        option.textContent = drivetrain;
        drivetrainSelect.appendChild(option);
    });
}

function applyFilters() {
    const track = document.getElementById('filter-track').value;
    const driver = document.getElementById('filter-driver').value;
    const car = document.getElementById('filter-car').value;
    const drivetrain = document.getElementById('filter-drivetrain').value;
    const weightMin = document.getElementById('filter-weight-min').value;
    const weightMax = document.getElementById('filter-weight-max').value;
    const horsepowerMin = document.getElementById('filter-horsepower-min').value;
    const horsepowerMax = document.getElementById('filter-horsepower-max').value;

    const filteredData = racingTimings.filter(lap => {
        return (!track || lap.Track === track) &&
               (!driver || lap.Driver === driver) &&
               (!car || lap.Car === car) &&
               (!drivetrain || lap["Car Drivetrain"] === drivetrain) &&
               (!weightMin || lap["Car Weight (kg)"] >= weightMin) &&
               (!weightMax || lap["Car Weight (kg)"] <= weightMax) &&
               (!horsepowerMin || lap["Car Horsepower (hp)"] >= horsepowerMin) &&
               (!horsepowerMax || lap["Car Horsepower (hp)"] <= horsepowerMax);
    });

    generateTableRows(filteredData);
}

function resetFilters() {
    document.getElementById('filter-track').value = '';
    document.getElementById('filter-driver').value = '';
    document.getElementById('filter-car').value = '';
    document.getElementById('filter-drivetrain').value = '';
    document.getElementById('filter-weight-min').value = '';
    document.getElementById('filter-weight-max').value = '';
    document.getElementById('filter-horsepower-min').value = '';
    document.getElementById('filter-horsepower-max').value = '';
    generateTableRows(racingTimings);
}

function sortTable(column) {
    const sortedData = [...racingTimings].sort((a, b) => {
        if (column === 'Lap Time') {
            return a["Lap Time (ms)"] - b["Lap Time (ms)"];
        } else if (column === 'Body to Weight Ratio') {
            const ratioA = calculateBodyToWeightRatio(a["Car Weight (kg)"], a["Car Horsepower (hp)"]);
            const ratioB = calculateBodyToWeightRatio(b["Car Weight (kg)"], b["Car Horsepower (hp)"]);
            return ratioA - ratioB;
        } else if (typeof a[column] === 'string') {
            return a[column].localeCompare(b[column]);
        } else {
            return a[column] - b[column];
        }
    });

    generateTableRows(sortedData);
}

// Populate filter options and generate initial table rows on page load
window.onload = () => {
    populateFilterOptions();
    generateTableRows(racingTimings);
};