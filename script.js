//Getting Elements
document.addEventListener('DOMContentLoaded', () => {
    const clock = document.getElementById('clock');
    const setAlarmBtn = document.getElementById('set-alarm');
    const alarmsList = document.getElementById('alarms');
    const alarmAudio = document.getElementById('alarm-audio');
    const stopAlarmBtn = document.getElementById('stop-alarm');

    //array to store multiple alarms
    let alarms = [];

    //get Hr, Min and Sec and display on screen
    function updateClock() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        clock.textContent = `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
        checkAlarms(now);
    }

    //check alarm with current time if true then play alarm method will called and remove alarm from list
    function checkAlarms(currentTime) {
        alarms.forEach((alarm, index) => {
            if (alarm.hours === currentTime.getHours() && alarm.minutes === currentTime.getMinutes() && alarm.seconds === currentTime.getSeconds()) {
                playAlarm();
                alarms.splice(index, 1);
                renderAlarms();
            }
        });
    }

    //play alarm if error occurs shows alert and also visibles stop button
    function playAlarm() {
        alarmAudio.play().catch(error => {
            console.log('Audio playback failed:', error);
            alert('Alarm triggered, but the sound could not play. Please check your browser settings.');
        });
        stopAlarmBtn.style.display = 'block';
    }

    //stops alarm
    function stopAlarm() {
        alarmAudio.pause();
        alarmAudio.currentTime = 0;
        stopAlarmBtn.style.display = 'none';
    }

    //get data from input fields and dropdown, create an object and push into the alarms array
    function setAlarm() {
        const hour = parseInt(document.getElementById('alarm-hour').value);
        const minute = parseInt(document.getElementById('alarm-minute').value);
        const second = parseInt(document.getElementById('alarm-second').value);
        const ampm = document.getElementById('alarm-ampm').value;

        if (isNaN(hour) || isNaN(minute) || isNaN(second)) {
            alert('Please enter valid time values.');
            return;
        }

        let alarmHour = hour % 12;
        if (ampm === 'PM') alarmHour += 12;
        if (ampm === 'AM' && alarmHour === 12) alarmHour = 0;

        const alarm = { hours: alarmHour, minutes: minute, seconds: second, ampm };
        alarms.push(alarm);
        renderAlarms();
    }

    //render list view from alarms array show delete button for each.
    function renderAlarms() {
        alarmsList.innerHTML = '';
        alarms.forEach((alarm, index) => {
            const alarmItem = document.createElement('li');
            alarmItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            const displayHours = alarm.hours % 12 || 12;
            alarmItem.textContent = `${displayHours.toString().padStart(2, '0')}:${alarm.minutes.toString().padStart(2, '0')}:${alarm.seconds.toString().padStart(2, '0')} ${alarm.ampm}`;
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-danger btn-sm';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
                alarms.splice(index, 1);
                renderAlarms();
            });
            alarmItem.appendChild(deleteBtn);
            alarmsList.appendChild(alarmItem);
        });
    }

    setAlarmBtn.addEventListener('click', setAlarm);
    stopAlarmBtn.addEventListener('click', stopAlarm);
    setInterval(updateClock, 1000);
    updateClock();
});
