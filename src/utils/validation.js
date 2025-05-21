import { validate } from 'uuid';

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

/**
 * Validates if the given string is a valid UUID.
 *
 * @param {string} uuid - The string to be validated.
 * @returns {boolean} - Returns true if the string is a valid UUID, otherwise false.
 */
const validateUUID = (uuid) => {
    return validate(uuid);
};

export { validateText, validateUUID };
