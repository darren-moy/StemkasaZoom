const express = require('express');
const router = express.Router();    
const axios = require('axios');
const tokenManager = require('../util/tokenmanager');

// API endpoint to fetch meetings 
router.get('/meetings', async (req, res) => {
    try {
        const token = await tokenManager.getToken();
        console.log('Fetching meetings with token:', token);  // Log the token being used for the API call
        const response = await axios.get('https://api.zoom.us/v2/users/me/meetings', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Meetings response:', response.data);  // Log the response data
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching meetings', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error fetching meetings' });
    }
});

router.post('/createMeeting', async (req, res) => {
    const { topic, start_time, type, duration, timezone, agenda, attendees } = req.body;

    try {
        const token = await tokenManager.getToken();

        // Ensure the request body is a valid JSON object
        const meetingData = {
            topic,
            type,
            start_time,
            duration,
            timezone,
            agenda,
            settings: {
                host_video: true,
                participant_video: true,
                join_before_host: false,
                mute_upon_entry: true,
                watermark: false,
                use_pmi: false,
                approval_type: 0,
                audio: 'both',
                auto_recording: 'cloud'
            }
        };

        // Send the request to create the meeting
        const response = await axios.post('https://api.zoom.us/v2/users/me/meetings', meetingData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const meetingId = response.data.id;

        // Register the attendees (invitees)
        const registrationPromises = attendees.map(attendee => 
            axios.post(`https://api.zoom.us/v2/meetings/${meetingId}/registrants`, {
                email: attendee.email,
                first_name: 'FirstName', // Replace with actual data if available
                last_name: 'LastName'    // Replace with actual data if available
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
        );

        await Promise.all(registrationPromises);

        res.json({
            meetingData: response.data,
            message: 'Meeting created and invitation emails sent to all attendees'
        });
    } catch (error) {
        console.error('Error creating meeting or sending invitations:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error creating meeting or sending invitations' });
    }
});

module.exports = router;
