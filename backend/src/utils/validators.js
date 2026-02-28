// UUID Validator
const isValidUUID = (id) => {
    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
};

// Date Validators
const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
};

const isDateInPast = (dateString) => {
    return new Date(dateString) < new Date();
};

const isDateInFuture = (dateString) => {
    return new Date(dateString) > new Date();
};

module.exports = {
    isValidUUID,
    isValidDate,
    isDateInPast,
    isDateInFuture,
};
