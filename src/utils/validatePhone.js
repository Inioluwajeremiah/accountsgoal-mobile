export const isValidatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
  return phoneRegex.test(phoneNumber);
};
