const express = require('express');
require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

const meetingsRoutes = require('./routes/meetings');
app.use('/api', meetingsRoutes);

const tokenManager = require('./util/tokenmanager');  


app.get('/zoom', async (req, res) => {
    const code = req.query.code;
    console.log('Received authorization code:', code);  // Ensure this is correct
    if (!code) {
        return res.send('Authorization code not found');
    }

    try {
        const newToken = await tokenManager.fetchNewToken(code);  // Pass the code here
        console.log('New token from OAuth callback:', newToken);  // Log the new token
        res.send('Access token has been saved.');
    } catch (error) {
        console.error("Error exchanging code for access token:", error.response ? error.response.data : error.message);
        res.send('Error retrieving access token');
    }
});




app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/create.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'create.html'));
});

module.exports = app;
