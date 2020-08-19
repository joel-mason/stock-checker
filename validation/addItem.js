const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateAddItemInput(data) {
  let errors = {};
// Convert empty fields to an empty string so we can use validator functions
  data.productCode = !isEmpty(data.productCode) ? data.productCode : "";
  data.productName = !isEmpty(data.productName) ? data.productName : "";
// Name checks
  if (Validator.isEmpty(data.productCode)) {
    errors.productCode = "Product Code field is required";
  }
  if (Validator.isEmpty(data.productName)) {
    errors.productName = "Product Code field is required";
  }
return {
    errors,
    isValid: isEmpty(errors)
  };
};