/**
 * Form Validation Logic for Educational Center Survey
 * Validates all 9 questions
 */

/**
 * Validates name (Question 1)
 */
export const validateName = (name) => {
    if (!name || name.trim().length === 0) {
        return {
            isValid: false,
            errorMessage: "Iltimos, ismingizni kiriting"
        };
    }

    if (name.trim().length < 2) {
        return {
            isValid: false,
            errorMessage: "Ism kamida 2 ta harfdan iborat bo'lishi kerak"
        };
    }

    return { isValid: true, errorMessage: '' };
};

/**
 * Validates center name (Question 2)
 */
export const validateCenterName = (centerName) => {
    if (!centerName || centerName.trim().length === 0) {
        return {
            isValid: false,
            errorMessage: "O'quv markazi nomini kiriting"
        };
    }

    if (centerName.trim().length < 3) {
        return {
            isValid: false,
            errorMessage: "Markaz nomi kamida 3 ta harfdan iborat bo'lishi kerak"
        };
    }

    return { isValid: true, errorMessage: '' };
};

/**
 * Validates center location (Question 3)
 */
export const validateCenterLocation = (location) => {
    if (!location || location.trim().length === 0) {
        return {
            isValid: false,
            errorMessage: "Hududni tanlang"
        };
    }

    return { isValid: true, errorMessage: '' };
};

/**
 * Validates operating status (Question 4)
 */
export const validateOperatingStatus = (status) => {
    if (!status) {
        return {
            isValid: false,
            errorMessage: "Faoliyat holatini tanlang"
        };
    }

    const validStatuses = ['ha', 'jarayonda', 'yoq'];
    if (!validStatuses.includes(status)) {
        return {
            isValid: false,
            errorMessage: "Noto'g'ri tanlov"
        };
    }

    return { isValid: true, errorMessage: '' };
};

/**
 * Validates student count (Question 5)
 */
export const validateStudentCount = (count) => {
    if (!count || count.toString().trim().length === 0) {
        return {
            isValid: false,
            errorMessage: "O'quvchilar sonini kiriting"
        };
    }

    const numCount = parseInt(count);
    if (isNaN(numCount) || numCount < 0) {
        return {
            isValid: false,
            errorMessage: "Musbat raqam kiriting"
        };
    }

    if (numCount > 10000) {
        return {
            isValid: false,
            errorMessage: "O'quvchilar soni juda ko'p ko'rinmoqda"
        };
    }

    return { isValid: true, errorMessage: '' };
};

/**
 * Validates languages offered (Question 6)
 */
export const validateLanguagesOffered = (languages) => {
    if (!languages) {
        return {
            isValid: false,
            errorMessage: "Xorijiy tillar sonini tanlang"
        };
    }

    const validOptions = ['1', '2', '3', '4'];
    if (!validOptions.includes(languages)) {
        return {
            isValid: false,
            errorMessage: "Noto'g'ri tanlov"
        };
    }

    return { isValid: true, errorMessage: '' };
};

/**
 * Validates achievements (Question 7)
 * This is optional, so always returns valid
 */
export const validateAchievements = (achievements) => {
    // Optional field - always valid
    return { isValid: true, errorMessage: '' };
};

/**
 * Validates foreign universities (Question 8)
 * This is optional
 */
export const validateForeignUniversities = (universities) => {
    // Optional field - always valid
    return { isValid: true, errorMessage: '' };
};

/**
 * Validates loan interest (Question 9)
 */
export const validateLoanInterest = (loanInterest) => {
    if (loanInterest === null || loanInterest === undefined) {
        return {
            isValid: false,
            errorMessage: "Iltimos, javob bering"
        };
    }

    return { isValid: true, errorMessage: '' };
};

/**
 * Validates all form fields
 * Returns an object with errors for each field
 */
export const validateAllFields = (formData) => {
    const errors = {};

    // Q1: Name
    const nameValidation = validateName(formData.name);
    if (!nameValidation.isValid) {
        errors.name = nameValidation.errorMessage;
    }

    // Q2: Center Name
    const centerNameValidation = validateCenterName(formData.centerName);
    if (!centerNameValidation.isValid) {
        errors.centerName = centerNameValidation.errorMessage;
    }

    // Q3: Center Location
    const locationValidation = validateCenterLocation(formData.centerLocation);
    if (!locationValidation.isValid) {
        errors.centerLocation = locationValidation.errorMessage;
    }

    // Q4: Operating Status
    const statusValidation = validateOperatingStatus(formData.operatingStatus);
    if (!statusValidation.isValid) {
        errors.operatingStatus = statusValidation.errorMessage;
    }

    // Q5: Student Count
    const studentCountValidation = validateStudentCount(formData.studentCount);
    if (!studentCountValidation.isValid) {
        errors.studentCount = studentCountValidation.errorMessage;
    }

    // Q6: Languages Offered
    const languagesValidation = validateLanguagesOffered(formData.languagesOffered);
    if (!languagesValidation.isValid) {
        errors.languagesOffered = languagesValidation.errorMessage;
    }

    // Q7: Achievements (optional)
    // No validation needed

    // Q8: Foreign Universities (optional)
    // No validation needed

    // Q9: Loan Interest
    const loanValidation = validateLoanInterest(formData.loanInterest);
    if (!loanValidation.isValid) {
        errors.loanInterest = loanValidation.errorMessage;
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
