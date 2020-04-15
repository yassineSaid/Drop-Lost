function getValidationErrors(error) {
    var errors = [];
    for (let [key, value] of Object.entries(error)) {
        var error1 = {
            path: key,
            message: value.message
        }
        errors.push(error1)
    }
    return errors
}
module.exports = getValidationErrors;