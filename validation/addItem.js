const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateAddItemInput(data) {
  let errors = {};
// Convert empty fields to an empty string so we can use validator functions
  data.id = !isEmpty(data.id) ? data.id : "";
  data.attributes.name = !isEmpty(data.attributes.name) ? data.attributes.name : "";
// Name checks
  if (Validator.isEmpty(data.id)) {
    errors.productCode = "Product Code field is required";
  }
  if (Validator.isEmpty(data.attributes.name)) {
    errors.productName = "Product Code field is required";
  }
return {
    errors,
    isValid: isEmpty(errors)
  };
};