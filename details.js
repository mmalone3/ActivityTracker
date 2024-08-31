// Example start and end times (you would replace these with actual values)
let startTime = new Date('2023-04-01T08:00:00');
let endTime = new Date('2023-04-01T10:30:00');

// Calculate duration
let duration = new Date(endTime - startTime);

// Format duration to hours and minutes
let hours = duration.getUTCHours();
let minutes = duration.getUTCMinutes();
function loadJSON() {
    const input = document.getElementById('upload-json');
    const file = input.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const jsonData = JSON.parse(e.target.result);
            displayData(jsonData); // Assuming you have a function to display the data
        };

        reader.readAsText(file);
    }
}

function displayData(data) {
    // Example: Displaying a simple key-value pair from the JSON
    const detailsContainer = document.getElementById('activity-details');
    detailsContainer.innerHTML = `<p>${data.key}: ${data.value}</p>`;
}

// Update DOM elements
document.getElementById('start-time').innerText += ` ${startTime.toLocaleTimeString()}`;
document.getElementById('end-time').innerText += ` ${endTime.toLocaleTimeString()}`;
document.getElementById('duration').innerText += ` ${hours} hour(s) and ${minutes} minute(s)`;