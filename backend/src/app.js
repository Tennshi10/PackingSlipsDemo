const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors'); // Add this line
const intuitRoutes = require('./routes/intuitRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Add this line
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', intuitRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});