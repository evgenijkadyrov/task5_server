const faker = require('faker');
const {generateErrorDataRecords} = require("../services/errors");

const getUsers=async (req, res) => {
    const page = parseInt(req.query.page) ;
    const errorRate=req.query.errorRate
    const pageSize = 20;
    const startIndex = (page - 1) * pageSize;
    const seed = req.query.seed ? req.query.seed + page : page;
    const region = req.query.region;
    let locale;
    switch (region) {
        case 'USA':
            locale = 'en';
            break;
        case 'Poland':
            locale = 'pl';
            break;
        case 'Ukraine':
            locale = 'uk';
            break;
        default:
            locale = 'en';
    }
    const data = generateData(pageSize, seed, locale).map((record, index) => {
        record.counter = startIndex + index + 1;
        return record;
    });
    const errorData =  generateErrorDataRecords(data, errorRate, region)
    res.json(errorData);

}
const generateData = (count, seed, locale) => {
    faker.setLocale(locale);
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
    const countries = ['USA', 'Poland', 'UK'];
    const country = countries[Math.floor(Math.random() * countries.length)];
    switch (country) {
        case 'USA':
            return faker.phone.phoneNumberFormat(1);
        case 'Poland':
            return faker.phone.phoneNumberFormat(2);
        case 'UK':
            return faker.phone.phoneNumberFormat(0);
        default:
            return faker.phone.phoneNumber();
    }
};

module.exports = {
    generateData,
    generatePhoneNumber,getUsers
};