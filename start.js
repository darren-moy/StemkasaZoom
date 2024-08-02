// starts the Server, listens on the specified port for incoming requests.
const app = require('./server');
const port = 3000;

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

/*
https://zoom.us/oauth/authorize?response_type=code&client_id=5_oTkr1PR5mTxI5fC4mTww&redirect_uri=http://localhost:3000/zoom
*/