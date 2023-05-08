const Validator = require("validator");
const isEmpty = require("is-empty");

const validateTodoInput = data => {
	let errors = {};

	// convert empty fields to an empty string so we can use validator functions
	data.title = !isEmpty(data.title) ? data.title : "";

	// name check
	if (Validator.isEmpty(data.title)) {
		errors.name = "Title is required";
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};

module.exports = validateTodoInput;

