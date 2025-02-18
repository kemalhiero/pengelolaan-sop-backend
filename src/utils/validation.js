/**
 * Validates if the given text starts with an alphabetic character.
 *
 * @param {string} text - The text to be validated.
 * @returns {boolean} - Returns true if the text starts with an alphabetic character, otherwise false.
 */
const validateText = (text) => {
    const regex = /^[^a-zA-Z]/;
    return !regex.test(text);
};

export { validateText };
