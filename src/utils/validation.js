/**
 * Form Validation Logic for Educational Center Survey
 * Validates all 11 questions
 */

export const validateName = (name) => {
    if (!name || name.trim().length === 0) {
        return { isValid: false, errorMessage: "Iltimos, ism familiyangizni kiriting" };
    }
    if (name.trim().length < 2) {
        return { isValid: false, errorMessage: "Ism kamida 2 ta harfdan iborat bo'lishi kerak" };
    }
    return { isValid: true, errorMessage: '' };
};

export const validateCenterLocation = (location) => {
    if (!location || location.trim().length === 0) {
        return { isValid: false, errorMessage: "Hududni tanlang" };
    }
    return { isValid: true, errorMessage: '' };
};

export const validateOperatingStatus = (status) => {
    if (!status) {
        return { isValid: false, errorMessage: "Faoliyat holatini tanlang" };
    }
    if (!['ha', 'yoq'].includes(status)) {
        return { isValid: false, errorMessage: "Noto'g'ri tanlov" };
    }
    return { isValid: true, errorMessage: '' };
};

export const validateOperatingStartDate = (status, startDate) => {
    if (status === 'yoq' && (!startDate || startDate.trim().length === 0)) {
        return { isValid: false, errorMessage: "Qachon boshlash rejalashtirilganini tanlang" };
    }
    return { isValid: true, errorMessage: '' };
};

export const validateUnclearReason = (status, startDate, reason) => {
    if (status === 'yoq' && startDate === 'noaniq' && (!reason || reason.trim().length === 0)) {
        return { isValid: false, errorMessage: "Iltimos, muammoni qisqacha yozing" };
    }
    return { isValid: true, errorMessage: '' };
};

export const validateCenterName = (centerName) => {
    if (!centerName || centerName.trim().length === 0) {
        return { isValid: false, errorMessage: "O'quv markazi nomini kiriting" };
    }
    if (centerName.trim().length < 2) {
        return { isValid: false, errorMessage: "Markaz nomi kamida 2 ta harfdan iborat bo'lishi kerak" };
    }
    return { isValid: true, errorMessage: '' };
};

export const validateStudentCount = (count) => {
    if (!count || count.toString().trim().length === 0) {
        return { isValid: false, errorMessage: "O'quvchilar sonini kiriting" };
    }
    const numCount = parseInt(count);
    if (isNaN(numCount) || numCount < 0) {
        return { isValid: false, errorMessage: "Musbat raqam kiriting" };
    }
    return { isValid: true, errorMessage: '' };
};

export const validateEmployeeCount = (count) => {
    if (!count || count.toString().trim().length === 0) {
        return { isValid: false, errorMessage: "Xodimlar sonini kiriting" };
    }
    const numCount = parseInt(count);
    if (isNaN(numCount) || numCount < 0) {
        return { isValid: false, errorMessage: "Musbat raqam kiriting" };
    }
    return { isValid: true, errorMessage: '' };
};

export const validateStringField = (value, errorMessage) => {
    if (!value || value.trim().length === 0) {
        return { isValid: false, errorMessage: errorMessage };
    }
    return { isValid: true, errorMessage: '' };
};

export const validateAllFields = (formData) => {
    const errors = {};

    const nameValidation = validateName(formData.name);
    if (!nameValidation.isValid) errors.name = nameValidation.errorMessage;

    const locationValidation = validateCenterLocation(formData.centerLocation);
    if (!locationValidation.isValid) errors.centerLocation = locationValidation.errorMessage;

    const statusValidation = validateOperatingStatus(formData.operatingStatus);
    if (!statusValidation.isValid) errors.operatingStatus = statusValidation.errorMessage;

    const startDateValidation = validateOperatingStartDate(formData.operatingStatus, formData.operatingStartDate);
    if (!startDateValidation.isValid) errors.operatingStartDate = startDateValidation.errorMessage;

    const unclearReasonValidation = validateUnclearReason(formData.operatingStatus, formData.operatingStartDate, formData.unclearReason);
    if (!unclearReasonValidation.isValid) errors.unclearReason = unclearReasonValidation.errorMessage;

    const centerNameValidation = validateCenterName(formData.centerName);
    if (!centerNameValidation.isValid) errors.centerName = centerNameValidation.errorMessage;

    const studentCountValidation = validateStudentCount(formData.studentCount);
    if (!studentCountValidation.isValid) errors.studentCount = studentCountValidation.errorMessage;

    const employeeCountValidation = validateEmployeeCount(formData.employeeCount);
    if (!employeeCountValidation.isValid) errors.employeeCount = employeeCountValidation.errorMessage;

    const problemsValidation = validateStringField(formData.problemsFaced, "Muammolarni kiriting");
    if (!problemsValidation.isValid) errors.problemsFaced = problemsValidation.errorMessage;

    const topicsValidation = validateStringField(formData.trainingTopics, "Mavzularni kiriting");
    if (!topicsValidation.isValid) errors.trainingTopics = topicsValidation.errorMessage;

    const formatValidation = validateStringField(formData.trainingFormat, "Formatni tanlang");
    if (!formatValidation.isValid) errors.trainingFormat = formatValidation.errorMessage;

    const mentorValidation = validateStringField(formData.mentorPreference, "Kutayotgan mentorni kiriting");
    if (!mentorValidation.isValid) errors.mentorPreference = mentorValidation.errorMessage;

    const suggestionsValidation = validateStringField(formData.suggestions, "Takliflarni kiriting");
    if (!suggestionsValidation.isValid) errors.suggestions = suggestionsValidation.errorMessage;

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
