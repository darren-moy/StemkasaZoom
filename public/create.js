document.getElementById('createMeetingForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const formProps = Object.fromEntries(formData);

    // Include the email as an attendee
    formProps.attendees = [{ email: formProps.email }];

    const response = await fetch('/api/createMeeting', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formProps)
    });

    if (response.ok) {
        alert('Meeting created successfully and invitation sent');
        window.location.href = '/';
    } else {
        alert('Error creating meeting');
    }
});

document.getElementById('back').addEventListener('click', () =>{
    window.location.href = '/';
})
