const { isValidPlate, isValidYear } = require('../utils/validators');

function validateCarCreate(req, res, next) {
    const { brand, model, plate, year } = req.body;

    const errors = [];

    if (!brand) {
        errors.push('brand is required');
    }

    if (!model) {
        errors.push('model is required');
    }

    if (!plate) {
        errors.push('plate is required');
    } else if (!isValidPlate(plate)) {
        errors.push('plate must be in the correct format ABC-1C34');
    }

    if (!year) {
        errors.push('year is required');
    } else if (!isValidYear(year)) {
        errors.push('year must be between 2015 and 2025');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
}

function validateCarUpdate(req, res, next) {
    const { brand, model, plate, year } = req.body;
    const errors = [];

    if (brand !== undefined && brand !== null && brand !== '' &&
        (model === undefined || model === null || model === '')) {
        errors.push('model must also be informed');
    }

    if (plate !== undefined && plate !== null && plate !== '') {
        if (!isValidPlate(plate)) {
            errors.push('plate must be in the correct format ABC-1C34');
        }
    }

    if (year !== undefined && year !== null && year !== '') {
        if (!isValidYear(year)) {
            errors.push('year must be between 2015 and 2025');
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
}

function validateCarItems(req, res, next) {
    const { items } = req.body;
    const errors = [];

    if (!Array.isArray(items)) {
        errors.push('items must be an array');
    } else {
        if (items.length > 5) {
            errors.push('maximum of 5 items allowed');
        }

        const itemNames = items.map(item => item.name);
        const uniqueItems = new Set(itemNames);

        if (uniqueItems.size !== items.length) {
            errors.push('duplicate items are not allowed');
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
}

module.exports = {
    validateCarCreate,
    validateCarUpdate,
    validateCarItems
};