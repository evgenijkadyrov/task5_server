const express = require('express');
const cors = require('cors');
const routes = require('../routes/routes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use('/', routes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});