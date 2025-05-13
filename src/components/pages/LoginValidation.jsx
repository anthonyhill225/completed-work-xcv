function validation(values) {
  let errors = {}; // Changed to 'errors' for consistency

  const email_pattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{6,}$/;

  // Email validation
  if (values.email === "") {
    errors.email = "Email should not be empty";
  } else if (!email_pattern.test(values.email)) {
    errors.email = "Email format is invalid";
  }

  // Password validation
  if (values.password === "") {
    errors.password = "Password should not be empty";
  } else if (!password_pattern.test(values.password)) {
    errors.password =
      "Password must contain at least one number, one lowercase letter, one uppercase letter, and be at least 6 characters long";
  }

  return errors;
}

export default validation;
