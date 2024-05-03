const faker = require('faker');
const {generateErrorDataRecords} = require("../services/errors");

const addHyphens = (value) => {
    const positions = [3, 5, 7];
    let newValue = '';

    for (let i = 0; i < value?.length; i++) {
        newValue += value[i];
        if (positions.includes(i + 1)) {
            newValue += '-';
        }
    }

    return newValue;
};

const insertSpace = (newData) => {
    const position = Math.floor(Math.random() * 10) + 1;
    if (newData.length > 15) {
        return newData.slice(0, position) + ' ' + newData.slice(position);
    }
    return newData
};
const getUsers = async (req, res) => {
    const page = parseInt(req.query.page);
    const errorRate = req.query.errorRate
    const pageSize = 20;
    const startIndex = (page - 1) * pageSize;
    const seedValue = req.query.seedValue ? parseInt(req.query.seedValue) + page : page;
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
    const data = generateData(pageSize, seedValue, locale).map((record, index) => {
        record.counter = startIndex + index + 1;
        return record;
    });
    const errorData = generateErrorDataRecords(data, errorRate, region)
    errorData.map((item) => {
        item.phoneNumber = addHyphens(item.phoneNumber)
        item.name = insertSpace(item.name)
        item.address = insertSpace(item.address)
        return item
    })

    res.json(errorRate > 0 ? errorData : data);

}
const generateData = (count, seedValue, locale) => {
    faker.setLocale(locale);
    faker.seed(seedValue);
    const data = [];
    for (let i = 0; i < count; i++) {
        const record = {
            counter: i + 1,
            id: faker.datatype.uuid(),
            name: faker.name.findName(),
            address: faker.address.streetAddress(),
            //phoneNumber: generatePhoneNumber(),
            phoneNumber: faker.phone.phoneNumberFormat(),
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
    generatePhoneNumber, getUsers
};