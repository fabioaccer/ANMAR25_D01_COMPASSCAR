/**
 * @param {string} plate 
 * @returns {boolean}
 */
function isValidPlate(plate) {

    if (!plate || typeof plate !== 'string' || plate.length !== 8) {
        return false;
    }

    const firstPart = plate.substring(0, 3);
    for (let i = 0; i < 3; i++) {
        const charCode = firstPart.charCodeAt(i);
        if (!((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122))) {
            return false;
        }
    }

    if (plate[3] !== '-') {
        return false;
    }

    const fifthCharCode = plate.charCodeAt(4);
    if (!(fifthCharCode >= 48 && fifthCharCode <= 57)) {
        return false;
    }

    const sixthCharCode = plate.charCodeAt(5);
    if (!((sixthCharCode >= 65 && sixthCharCode <= 90) || (sixthCharCode >= 97 && sixthCharCode <= 122))) {
        return false;
    }

    const seventhCharCode = plate.charCodeAt(6);
    if (!(seventhCharCode >= 48 && seventhCharCode <= 57)) {
        return false;
    }

    return true;

}

/**
 * @param {number} year 
 * @returns {boolean}
 */
function isValidYear(year) {
    const numYear = Number(year);
    return !isNaN(numYear) && numYear >= 2015 && numYear <= 2025;
}

module.exports = {
    isValidPlate,
    isValidYear
};