document.getElementById('fetchMeetings').addEventListener('click', async () => {
    const response = await fetch('/api/meetings');  // Call your backend proxy
    const meetings = await response.json();
    const meetingsList = document.getElementById('meetingsList');
    meetingsList.innerHTML = '';

    if (meetings.meetings && meetings.meetings.length > 0) {
        meetings.meetings.forEach(meeting => {
            const meetingDiv = document.createElement('div');
            meetingDiv.classList.add('meeting');

            const meetingTitle = document.createElement('h2');
            meetingTitle.textContent = meeting.topic;
            meetingDiv.appendChild(meetingTitle);

            const meetingTime = document.createElement('p');
            meetingTime.textContent = `Start Time: ${new Date(meeting.start_time).toLocaleString()}`;
            meetingDiv.appendChild(meetingTime);

            const meetingAgenda = document.createElement('p');
            meetingAgenda.textContent = `Agenda: ${meeting.agenda || 'No agenda provided'}`;
            meetingDiv.appendChild(meetingAgenda);

            const joinLink = document.createElement('a');
            joinLink.href = meeting.join_url;
            joinLink.textContent = 'Join Meeting';
            joinLink.target = '_blank';
            meetingDiv.appendChild(joinLink);

            meetingsList.appendChild(meetingDiv);
        });
    } else {
        meetingsList.textContent = 'No meetings found.';
    }
});

document.getElementById('createMeeting').addEventListener('click', () => {
    window.location.href = '/create.html';
});
