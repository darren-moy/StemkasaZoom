require('dotenv').config();
const tokenManager = require('./util/tokenmanager');

(async () => {
    console.log(await tokenManager.getToken()); // Test the token retrieval
    console.log(await getMeetings()); // Log the updated list of meetings
})();

// If you had any other code in `index.js`, include it here
