const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateUpdateUserInput(data) {
  let errors = {};
// Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.postcode = !isEmpty(data.postcode) ? data.postcode : "";
// Email checks

  if(Validator.isEmpty(data.name)) {
      errors.name = "Name field is required"
  }

  if (Validator.isEmpty(data.postcode)) {
    errors.postcode = "Postcode field is required";
  } else if (!data.postcode.match(/[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}/g)) {
    errors.postcode = "Postcode is invalid";
  }
return {
    errors,
    isValid: isEmpty(errors)
  };
};