let currentSession = null;
let interval;
let startTime;
const activityHistory = JSON.parse(localStorage.getItem('activityHistory')) || [];

function startTracking(activity, color) {
    if (currentSession !== null) {
        currentSession.endTime = new Date().toLocaleString();
    }

    clearInterval(interval); // Clear any ongoing intervals

    document.getElementById('activity-title').textContent = activity;
    document.getElementById('activity-title').style.color = color;

    document.querySelectorAll('.activity').forEach(act => {
        act.classList.remove('active');
    });
    document.getElementById(activity.toLowerCase().replace(/\s+/g, '-')).classList.add('active');

    startTime = Date.now();
    interval = setInterval(updateTime, 1000); // Start the timer

    const session = {
        name: activity,
        startTime: new Date().toLocaleString(),
        endTime: undefined
    };
    activityHistory.push(session);
    currentSession = session;

    localStorage.setItem('activityHistory', JSON.stringify(activityHistory));
    displayActivityHistory();
}

function toggleTracking() {
    if (interval) {
        // Stop tracking
        clearInterval(interval);
        interval = null;
        if (currentSession !== null) {
            currentSession.endTime = new Date().toLocaleString();
        }
        document.getElementById('activity-title').textContent = 'Tracking Stopped';
        document.getElementById('activity-title').style.color = 'red';
        localStorage.setItem('activityHistory', JSON.stringify(activityHistory));
        displayActivityHistory();
    } else {
        // Start tracking
        startTracking('Work', 'blue'); // Example call to start tracking
    }
}

function stopTracking() {
    if (currentSession !== null) {
        currentSession.endTime = new Date().toLocaleString();
        clearInterval(interval);
        interval = null;
        localStorage.setItem('activityHistory', JSON.stringify(activityHistory));
        displayActivityHistory();
    }
}

function updateTime() {
    const elapsedTime = Date.now() - startTime;
    document.getElementById('timer').textContent = new Date(elapsedTime).toISOString().substr(11, 8);
}

function displayActivityHistory() {
    const historyElement = document.getElementById('activity-history');
    historyElement.innerHTML = activityHistory.map(session => 
        `<div>${session.name}: ${session.startTime} - ${session.endTime || 'Ongoing'}</div>`
    ).join('');
}

function saveTimes() {
    const data = JSON.stringify(activityHistory, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'activityHistory.json';
    a.click();
    URL.revokeObjectURL(url);
}

function clearTimes() {
    activityHistory.length = 0; // Clear the array
    localStorage.removeItem('activityHistory'); // Remove from localStorage
    displayActivityHistory(); // Update the display
    document.getElementById('activity-title').textContent = 'No Activity';
    document.getElementById('timer').textContent = '00:00:00';
}

document.querySelectorAll('.activity').forEach(activity => {
    activity.onclick = function() {
        startTracking(activity.textContent, 'blue');
    };
});

document.getElementById('toggle-button').onclick = toggleTracking;
document.getElementById('stop-button').onclick = stopTracking;
document.getElementById('save-button').onclick = saveTimes;
document.getElementById('clear-button').onclick = clearTimes;

function editActivity(activityId) {
    const activityDiv = document.getElementById(activityId);
    const currentText = activityDiv.childNodes[0].nodeValue.trim();
    activityDiv.innerHTML = `
        <input type="text" id="edit-${activityId}" value="${currentText}">
        <button onclick="saveActivity('${activityId}')">Save</button>
    `;
}

function saveActivity(activityId) {
    const inputField = document.getElementById(`edit-${activityId}`);
    const newText = inputField.value.trim();
    const activityDiv = document.getElementById(activityId);
    activityDiv.innerHTML = `
        ${newText}
        <button class="edit-button" onclick="editActivity('${activityId}')">Edit</button>
    `;
}