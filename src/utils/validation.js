/**
 * SECURITY MODULE: INPUT VALIDATION
 * 
 * Pure validation functions with strict regex patterns.
 * Each function returns { isValid: boolean, errorMessage: string }
 * 
 * CRITICAL: These validations prevent malformed data from reaching the database.
 */

/**
 * Validates full name (F.I.Sh.)
 * Rules:
 * - Required (min 3 characters)
 * - No numbers or special symbols
 * - Only letters and spaces allowed
 */
export const validateFullName = (name) => {
    if (!name || name.trim().length < 3) {
        return {
            isValid: false,
            errorMessage: "F.I.Sh. kamida 3 ta belgidan iborat bo'lishi kerak"
        };
    }

    // Only letters (including Uzbek characters) and spaces
    const nameRegex = /^[a-zA-Z\u0400-\u04FF\s']+$/;
    if (!nameRegex.test(name)) {
        return {
            isValid: false,
            errorMessage: "F.I.Sh. faqat harflardan iborat bo'lishi kerak"
        };
    }

    return { isValid: true, errorMessage: '' };
};

/**
 * Validates age
 * Rules:
 * - Must be a number
 * - Strict range: 14-35 (inclusive)
 */
export const validateAge = (age) => {
    const ageNum = parseInt(age, 10);

    if (isNaN(ageNum)) {
        return {
            isValid: false,
            errorMessage: "Yoshni to'g'ri kiriting"
        };
    }

    if (ageNum < 14 || ageNum > 35) {
        return {
            isValid: false,
            errorMessage: "Yosh 14 dan 35 gacha bo'lishi kerak"
        };
    }

    return { isValid: true, errorMessage: '' };
};

/**
 * Validates Uzbek phone number
 * Rules:
 * - Must be 9 digits (without +998 prefix)
 * - Format: XX XXX XX XX or XXXXXXXXX
 * - The UI shows +998 as a fixed prefix, user only enters remaining digits
 */
export const validatePhone = (phone) => {
    if (!phone || phone.trim().length === 0) {
        return {
            isValid: false,
            errorMessage: "Telefon raqamini kiriting"
        };
    }

    // Remove all spaces and check if it's exactly 9 digits
    const cleanPhone = phone.replace(/\s/g, '');

    // Accept 9 digits only (the part after +998)
    const phoneRegex = /^\d{9}$/;

    if (!phoneRegex.test(cleanPhone)) {
        return {
            isValid: false,
            errorMessage: "Telefon raqami 9 ta raqamdan iborat bo'lishi kerak (masalan: 90 123 45 67)"
        };
    }

    return { isValid: true, errorMessage: '' };
};

/**
 * Validates region selection
 * Rules:
 * - Must be selected (not default empty option)
 */
export const validateRegion = (region) => {
    if (!region || region.trim().length === 0) {
        return {
            isValid: false,
            errorMessage: "Viloyatni tanlang"
        };
    }

    return { isValid: true, errorMessage: '' };
};

/**
 * Validates district/city
 * Rules:
 * - Required (min 2 characters)
 */
export const validateDistrict = (district) => {
    if (!district || district.trim().length < 2) {
        return {
            isValid: false,
            errorMessage: "Tuman/shaharni kiriting (kamida 2 ta harf)"
        };
    }

    return { isValid: true, errorMessage: '' };
};

/**
 * Validates planning center radio selection
 * Rules:
 * - Must be explicitly true or false (boolean)
 */
export const validatePlanningCenter = (value) => {
    if (value === null || value === undefined || value === '') {
        return {
            isValid: false,
            errorMessage: "Iltimos, javob tanlang"
        };
    }

    return { isValid: true, errorMessage: '' };
};

/**
 * Master validation function
 * Validates all form fields and returns consolidated errors
 * 
 * @param {Object} formData - Complete form data object
 * @returns {Object} errors - Object with field names as keys and error messages as values
 */
export const validateAllFields = (formData) => {
    const errors = {};

    const nameValidation = validateFullName(formData.fullName);
    if (!nameValidation.isValid) {
        errors.fullName = nameValidation.errorMessage;
    }

    const ageValidation = validateAge(formData.age);
    if (!ageValidation.isValid) {
        errors.age = ageValidation.errorMessage;
    }

    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid) {
        errors.phone = phoneValidation.errorMessage;
    }

    const regionValidation = validateRegion(formData.region);
    if (!regionValidation.isValid) {
        errors.region = regionValidation.errorMessage;
    }

    const districtValidation = validateDistrict(formData.district);
    if (!districtValidation.isValid) {
        errors.district = districtValidation.errorMessage;
    }

    const planningValidation = validatePlanningCenter(formData.planningCenter);
    if (!planningValidation.isValid) {
        errors.planningCenter = planningValidation.errorMessage;
    }

    return errors;
};
