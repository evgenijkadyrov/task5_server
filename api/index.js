const express = require('express');
const cors = require('cors');
const routes = require('../routes');

const app = express();
const PORT = 3000;

app.use(cors({
    origin: "https://task5-client-gules.vercel.app"
}));
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/', routes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});