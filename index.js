const express = require('express');
const faker = require('faker');

const app = express();
const PORT = 3000;

// Generate fake data
const generateData = (count, seed) => {
    faker.seed(seed);
    const data = [];
    for (let i = 0; i < count; i++) {
        const record = {
            counter: i + 1,
            id: faker.datatype.uuid(),
            name: faker.name.findName(),
            address: faker.address.streetAddress(),
            phoneNumber: generatePhoneNumber(),
        };
        data.push(record);
    }
    return data;
};

const generatePhoneNumber = () => {
    const countries = ['USA', 'Belarus', 'UK'];
    const country = countries[Math.floor(Math.random() * countries.length)];
    switch (country) {
        case 'USA':
            return faker.phone.phoneNumberFormat(1);
        case 'Belarus':
            return faker.phone.phoneNumberFormat(2);
        case 'UK':
            return faker.phone.phoneNumberFormat(0);
        default:
            return faker.phone.phoneNumber();
    }
};

// API endpoint to get fake data
app.get('/data', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = page === 1 ? 20 : 10;
    const startIndex = (page - 1) * pageSize;
    const seed = req.query.seed ? parseInt(req.query.seed) : faker.datatype.number(); // Get seed from request query parameter or generate a new one

    const data = generateData(pageSize, seed).map((record, index) => {
        record.counter = startIndex + index + 1;
        return record;
    });
    res.json(data);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});