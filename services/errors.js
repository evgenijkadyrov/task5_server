
const seedrandom = require('seedrandom');
const rng= seedrandom('hello')
const ErrorType = {
     "DeleteCharacter":0 ,
    "AddCharacter":1,
    "SwapCharacters":2,
};

const alphabetUSA = 'abcdefghijklmnopqrstuvwxyz';
const alphabetPOL = "aąbcćdeęfghijklłmnńoóprsśtuwyzźż";
const alphabetUKR = "абвгґдеєжзиіїйклмнопрстуфхцчшщьюя";

function getAlphabetByRegion(region) {
    if (region === 'USA') {
        return alphabetUSA;
    } else if (region === 'Poland') {
        return alphabetPOL;
    } else if (region === 'Ukraine') {
        return alphabetUKR;
    }
    return alphabetUSA;
}
const getRandomCharacter = (characters) => {
    const index = Math.floor(rng() * characters.length);
    return characters[index];
};

const applyError = (data, errorType, region) => {
    const position = Math.floor(rng() * (data.length + 1));
    let newData = data;
    if (typeof data === 'string') {
        switch (errorType) {
            case ErrorType.DeleteCharacter:
                newData = data.slice(0, position) + data.slice(position + 1);
                break;
            case ErrorType.AddCharacter:
                const newCharacter = getRandomCharacter(getAlphabetByRegion(region));
                newData = data.slice(0, position) + newCharacter + data.slice(position);
                break;
            case ErrorType.SwapCharacters:
                if (position < data.length - 1) {
                    newData =
                        data.slice(0, position) +
                        data[position + 1] +
                        data[position] +
                        data.slice(position + 2);
                }
                break;
        }
    }
    return newData;
};

const applyPhoneNumberError = (value, errorType) => {
    if (errorType === ErrorType.SwapCharacters) {
        return applyDigitsError(value);
    } else if (errorType === ErrorType.AddCharacter) {
        return applyAddCharacterError(value);
    } else if (errorType === ErrorType.DeleteCharacter) {
        return applyDeleteCharacterError(value);
    }
    return value;
};

const applyDigitsError = (value) => {
    const digits = '0123456789';
    let newValue = '';
    for (let i = 0; i < value.length; i++) {
        if (digits.includes(value[i])) {
            newValue += value[i];
        }
    }
    return newValue;
};

const applyAddCharacterError = (value) => {
    const digits = '0123456789';
    const randomDigit = digits[Math.floor(rng() * digits.length)];
    return value + randomDigit;
};

const applyDeleteCharacterError = (value) => {
    if (value.length > 0) {
        return value.substring(0, value.length - 1);
    }
    return value;
};

const generateErrorCount = (errorRate) => {
    const integerPart = Math.floor(errorRate);
    const fractionalPart = errorRate - integerPart;
    let errorCount = integerPart;

    if (Math.random() < fractionalPart) {
        errorCount += 1;
    }
    return errorCount;
};

const generateErrorDataRecord = (originalData, errorRate,region) => {
    const errorCount = generateErrorCount(errorRate);
    let modifiedData = { ...originalData };

    const fields = ['name', 'address', 'phoneNumber'];
    const shuffledFields = shuffleArray(fields);

    for (let i = 0; i < errorCount; i++) {
        const field = getRandomField(shuffledFields);
        const errorType = Math.floor(rng() * 3);
        const fieldValue = modifiedData[field];

        if (field === 'phoneNumber') {
            modifiedData[field] = applyPhoneNumberError(fieldValue, errorType);
        } else {
            modifiedData[field] = applyError(fieldValue, errorType, region);
        }
    }
    return modifiedData;
};

const getRandomField = (array) => {
    const randomIndex = Math.floor(rng() * array.length);
    return array[randomIndex];
};

const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

 const generateErrorDataRecords = (originalData, errorRate, region) => {
    if (originalData) {
        return originalData.map((record) =>
            generateErrorDataRecord(record, errorRate, region)
        );
    }
    return [];
};
module.exports = {
    generateErrorDataRecords
};