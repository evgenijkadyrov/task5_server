const ErrorType = {
     "DeleteCharacter":0 ,
    "AddCharacter":1,
    "SwapCharacters":2,
};

const alphabet = 'abcdefghijklmnopqrstuvwxyz';

const getRandomCharacter = (characters) => {
    const index = Math.floor(Math.random() * characters.length);
    return characters[index];
};

const applyError = (data, errorType) => {
    const position = Math.floor(Math.random() * (data.length + 1));
    let newData = data;
    if (typeof data === 'string') {
        switch (errorType) {
            case ErrorType.DeleteCharacter:
                newData = data.slice(0, position) + data.slice(position + 1);
                break;
            case ErrorType.AddCharacter:
                const newCharacter = getRandomCharacter(alphabet);
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

const applyDigitsError = (value) => {
    const digitsRegex = /\d/g;
    const digits = value.match(digitsRegex);

    if (digits && digits.length > 1) {
        const index1 = Math.floor(Math.random() * digits.length);
        let index2 = Math.floor(Math.random() * digits.length);
        while (index2 === index1) {
            index2 = Math.floor(Math.random() * digits.length);
        }
        const digit1 = digits[index1];
        const digit2 = digits[index2];

        return value.replace(digit1, 'x').replace(digit2, digit1).replace('x', digit2);
    }
    return value;
};

const applyPhoneNumberError = (value, errorType) => {
    if (errorType === ErrorType.AddCharacter || errorType === ErrorType.DeleteCharacter) {
        return applyError(value, errorType);
    } else if (errorType === ErrorType.SwapCharacters) {
        return applyDigitsError(value);
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

const generateErrorDataRecord = (originalData, errorRate) => {
    const errorCount = generateErrorCount(errorRate);
    let modifiedData = { ...originalData };

    const fields = ['name', 'address', 'phoneNumber'];
    const shuffledFields = shuffleArray(fields);

    for (let i = 0; i < errorCount; i++) {
        const field = getRandomField(shuffledFields);
        const errorType = Math.floor(Math.random() * 3);
        const fieldValue = modifiedData[field];

        if (field === 'phoneNumber') {
            modifiedData[field] = applyPhoneNumberError(fieldValue, errorType);
        } else {
            modifiedData[field] = applyError(fieldValue, errorType);
        }
    }
    return modifiedData;
};

const getRandomField = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
};

const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

 const generateErrorDataRecords = (originalData, errorRate) => {
    if (originalData) {
        return originalData.map((record) =>
            generateErrorDataRecord(record, errorRate)
        );
    }
    return [];
};
module.exports = {
    generateErrorDataRecords
};