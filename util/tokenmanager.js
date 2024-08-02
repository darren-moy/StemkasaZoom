const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let token = process.env.TOKEN;

function updateEnv(newToken) {
    const envFilePath = path.resolve(__dirname, '../.env');  // Updated path to point to the root directory
    const envVars = fs.readFileSync(envFilePath, 'utf8').split('\n');
    const newEnvVars = envVars.map(line => {
        if (line.startsWith('TOKEN=')) {
            return `TOKEN=${newToken}`;
        }
        return line;
    });
    fs.writeFileSync(envFilePath, newEnvVars.join('\n'));
    token = newToken;
}


async function fetchNewToken(code) {
    try {
        console.log('Fetching new token with code:', code);  // Log the authorization code being used

        const response = await axios.post('https://zoom.us/oauth/token', null, {
            params: {
                grant_type: 'authorization_code',
                code: code || process.env.ZOOM_AUTH_CODE,  // Log this value
                redirect_uri: process.env.REDIRECT_URI  // Log this value
            },
            headers: {
                'Authorization': `Basic ${Buffer.from(`${process.env.ZOOM_API_KEY}:${process.env.ZOOM_API_SECRET}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        console.log('Token response:', response.data);  // Log the entire response to see if the token is returned

        const newToken = response.data.access_token;
        updateEnv(newToken);
        console.log('New token saved:', newToken);  // Confirm the new token is saved
        return newToken;
    } catch (error) {
        console.error('Error fetching new token:', error.response ? error.response.data : error.message);
    }
}


async function getToken() {
    console.log('Current token:', token);  // Log the current token before checking its validity
    if (!token || !await isTokenValid(token)) {
        console.log('Token is invalid or expired, fetching a new token...');
        token = await fetchNewToken();
    }
    console.log('Using token:', token);  // Log the token that will be used
    return token;
}


async function isTokenValid(token) {
    try {
        const response = await axios.get('https://api.zoom.us/v2/users/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.status === 200;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            return false;
        }
        console.error('Error checking token validity:', error.response ? error.response.data : error.message);
        return false;
    }
}

module.exports = {
    getToken,
    fetchNewToken
};
