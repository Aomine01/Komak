/**
 * KO'MAK+ LOYIHASI - EDUCATIONAL CENTER SURVEY
 * 
 * Features:
 * - 11-question survey for educational centers
 * - Multi-language support (UZ/RU/EN)
 * - Modern form layout with validation
 * - Telegram redirect after submission
 */

import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { validateAllFields } from './utils/validation';
import { checkCooldown, setCooldown } from './utils/cooldown';
import { REGIONS, OPERATING_STATUS, TRAINING_FORMAT } from './data/formOptions';
import { translations } from './utils/translations';

function App() {
    // ========== STATE MANAGEMENT ==========
    const [language, setLanguage] = useState('uz');
    const t = translations[language];

    const [formData, setFormData] = useState({
        name: '',                    // Q1: Ism Familiyangiz
        centerLocation: '',          // Q2: O'quv markazi hududi
        operatingStatus: '',         // Q3: Faoliyat ko'rsatyaptimi
        operatingStartDate: '',      // Q3.1: Qachon boshlaydi
        centerName: '',              // Q4: Markaz nomi
        studentCount: '',            // Q5: O'quvchilar soni
        employeeCount: '',           // Q6: Xodimlar soni
        problemsFaced: '',           // Q7: Muammolar
        trainingTopics: '',          // Q8: Trening mavzulari
        trainingFormat: '',          // Q9: Trening formati
        mentorPreference: '',        // Q10: Mentor
        suggestions: ''              // Q11: Takliflar
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [cooldownRemaining, setCooldownRemaining] = useState(0);
    const [formErrors, setFormErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState(null);

    // ========== COOLDOWN TIMER ==========
    useEffect(() => {
        const { inCooldown, remainingSeconds } = checkCooldown();
        if (inCooldown) {
            setCooldownRemaining(remainingSeconds);
        }

        let interval;
        if (cooldownRemaining > 0) {
            interval = setInterval(() => {
                const { inCooldown, remainingSeconds } = checkCooldown();
                if (inCooldown) {
                    setCooldownRemaining(remainingSeconds);
                } else {
                    setCooldownRemaining(0);
                }
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [cooldownRemaining]);

    // ========== EVENT HANDLERS ==========
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus(null);

        // Validation
        const validation = validateAllFields(formData);
        if (!validation.isValid) {
            setFormErrors(validation.errors);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Cooldown check
        const { inCooldown, remainingSeconds } = checkCooldown();
        if (inCooldown) {
            setCooldownRemaining(remainingSeconds);
            setSubmitStatus('cooldown');
            return;
        }

        // Submit
        setIsSubmitting(true);
        setFormErrors({});

        try {
            const payload = {
                name: formData.name.trim(),
                center_location: formData.centerLocation,
                operating_status: formData.operatingStatus,
                operating_start_date: formData.operatingStatus === 'yoq' ? formData.operatingStartDate.trim() : null,
                center_name: formData.centerName.trim(),
                student_count: parseInt(formData.studentCount, 10),
                employee_count: parseInt(formData.employeeCount, 10),
                problems_faced: formData.problemsFaced.trim(),
                training_topics: formData.trainingTopics.trim(),
                training_format: formData.trainingFormat,
                mentor_preference: formData.mentorPreference.trim(),
                suggestions: formData.suggestions.trim()
            };

            const { data, error } = await supabase
                .from('center_survey')
                .insert([payload])
                .select();

            if (error) {
                throw error;
            }

            // Success
            setCooldown();
            setCooldownRemaining(60);
            setSubmitStatus('success');

            // Reset form
            setFormData({
                name: '',
                centerLocation: '',
                operatingStatus: '',
                operatingStartDate: '',
                centerName: '',
                studentCount: '',
                employeeCount: '',
                problemsFaced: '',
                trainingTopics: '',
                trainingFormat: '',
                mentorPreference: '',
                suggestions: ''
            });

            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            console.error('Submission error:', error);
            setSubmitStatus('error');
            setFormErrors({
                submit: error.message || "Xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // ========== RENDER ==========
    return (
        <div className="min-h-screen bg-background-light flex flex-col">

            {/* Header */}
            <header className="header-sticky px-6 md:px-20 lg:px-40 py-4">
                <div className="flex items-center justify-between max-w-[1200px] mx-auto">
                    <div className="flex items-center gap-3">
                        <img src="/logo.svg" alt="KO'MAK LOYIHASI" className="h-10 md:h-14 w-auto" />
                    </div>

                    {/* Language Switcher */}
                    <div className="flex gap-2">
                        {['uz', 'ru', 'en'].map((lang) => (
                            <button
                                key={lang}
                                onClick={() => setLanguage(lang)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${language === lang
                                    ? 'bg-primary text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {lang.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow max-w-[1200px] mx-auto px-4 md:px-10 py-10 space-y-12 w-full">

                {/* Hero Section */}
                <section className="hero-section">
                    <div className="max-w-2xl space-y-6">
                        <h1 className="text-white text-4xl md:text-5xl font-black tracking-tight leading-tight">
                            {t.heroTitle}
                        </h1>
                    </div>
                </section>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                    <div className="success-message animate-fadeIn">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                            <h3 className="font-semibold text-green-800">{t.successTitle}</h3>
                            <p className="text-green-700 text-sm mt-1">{t.successMessage}</p>
                        </div>
                    </div>
                )}

                {submitStatus === 'error' && formErrors.submit && (
                    <div className="error-message animate-fadeIn">
                        <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <h3 className="font-semibold text-red-800">{t.errorTitle}</h3>
                            <p className="text-red-700 text-sm mt-1">{formErrors.submit}</p>
                        </div>
                    </div>
                )}

                {cooldownRemaining > 0 && (
                    <div className="warning-message animate-fadeIn">
                        <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <h3 className="font-semibold text-yellow-800">{t.cooldownTitle}</h3>
                            <p className="text-yellow-700 text-sm mt-1">
                                {t.cooldownMessage.replace('{seconds}', cooldownRemaining)}
                            </p>
                        </div>
                    </div>
                )}

                {/* Form Section */}
                <section className="max-w-4xl mx-auto">
                    <div className="mb-10 text-center md:text-left">
                        <h2 className="text-primary text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4">{t.formTitle}</h2>
                        <p className="text-slate-600 text-base md:text-lg">{t.formSubtitle}</p>
                    </div>

                    <div className="form-card">
                        <div className={`p-8 lg:p-12 ${isSubmitting ? 'loading-overlay' : ''}`}>
                            <form onSubmit={handleSubmit} className="space-y-10">

                                {/* Question 1: Name */}
                                <div className="space-y-6">
                                    <div className="section-header">
                                        <span className="material-symbols-outlined">person</span>
                                        <h3>1. {t.q1_name}</h3>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            className={`input-field ${formErrors.name ? 'border-red-500' : ''}`}
                                            placeholder={t.q1_placeholder}
                                        />
                                        {formErrors.name && <p className="error-text">{formErrors.name}</p>}
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                {/* Question 2: Location */}
                                <div className="space-y-6">
                                    <div className="section-header">
                                        <span className="material-symbols-outlined">location_on</span>
                                        <h3>2. {t.q2_location}</h3>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <select
                                            name="centerLocation"
                                            value={formData.centerLocation}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            className={`input-field ${formErrors.centerLocation ? 'border-red-500' : ''}`}
                                        >
                                            <option value="">{t.q2_locationPlaceholder}</option>
                                            {REGIONS.map(region => (
                                                <option key={region} value={region}>{region}</option>
                                            ))}
                                        </select>
                                        {formErrors.centerLocation && <p className="error-text">{formErrors.centerLocation}</p>}
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                {/* Question 3: Operating Status */}
                                <div className="space-y-6">
                                    <div className="section-header">
                                        <span className="material-symbols-outlined">store</span>
                                        <h3>3. {t.q3_operatingStatus}</h3>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <select
                                            name="operatingStatus"
                                            value={formData.operatingStatus}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            className={`input-field ${formErrors.operatingStatus ? 'border-red-500' : ''}`}
                                        >
                                            <option value="">Tanlang</option>
                                            {OPERATING_STATUS.map(status => (
                                                <option key={status.value} value={status.value}>
                                                    {language === 'uz' ? status.label : (language === 'ru' ? t[`q3_${status.value}`] : t[`q3_${status.value}`])}
                                                </option>
                                            ))}
                                        </select>
                                        {formErrors.operatingStatus && <p className="error-text">{formErrors.operatingStatus}</p>}
                                    </div>

                                    {/* Sub-question if No */}
                                    {formData.operatingStatus === 'yoq' && (
                                        <div className="pl-6 border-l-2 border-primary mt-4 space-y-4 animate-fadeIn">
                                            <p className="text-sm font-medium text-slate-700">{t.q3_startDate}</p>
                                            <div className="flex flex-col gap-2">
                                                <input
                                                    type="text"
                                                    name="operatingStartDate"
                                                    value={formData.operatingStartDate}
                                                    onChange={handleInputChange}
                                                    disabled={isSubmitting}
                                                    className={`input-field ${formErrors.operatingStartDate ? 'border-red-500' : ''}`}
                                                    placeholder={t.q3_startDatePlaceholder}
                                                />
                                                {formErrors.operatingStartDate && <p className="error-text">{formErrors.operatingStartDate}</p>}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <hr className="border-slate-100" />

                                {/* Question 4: Center Name */}
                                <div className="space-y-6">
                                    <div className="section-header">
                                        <span className="material-symbols-outlined">school</span>
                                        <h3>4. {t.q4_centerName}</h3>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="text"
                                            name="centerName"
                                            value={formData.centerName}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            className={`input-field ${formErrors.centerName ? 'border-red-500' : ''}`}
                                            placeholder={t.q4_placeholder}
                                        />
                                        {formErrors.centerName && <p className="error-text">{formErrors.centerName}</p>}
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                {/* Question 5: Student Count */}
                                <div className="space-y-6">
                                    <div className="section-header">
                                        <span className="material-symbols-outlined">groups</span>
                                        <h3>5. {t.q5_studentCount}</h3>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="number"
                                            name="studentCount"
                                            value={formData.studentCount}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            min="0"
                                            className={`input-field ${formErrors.studentCount ? 'border-red-500' : ''}`}
                                            placeholder={t.q5_studentPlaceholder}
                                        />
                                        {formErrors.studentCount && <p className="error-text">{formErrors.studentCount}</p>}
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                {/* Question 6: Employee Count */}
                                <div className="space-y-6">
                                    <div className="section-header">
                                        <span className="material-symbols-outlined">badge</span>
                                        <h3>6. {t.q6_employeeCount}</h3>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="number"
                                            name="employeeCount"
                                            value={formData.employeeCount}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            min="0"
                                            className={`input-field ${formErrors.employeeCount ? 'border-red-500' : ''}`}
                                            placeholder={t.q6_employeePlaceholder}
                                        />
                                        {formErrors.employeeCount && <p className="error-text">{formErrors.employeeCount}</p>}
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                {/* Question 7: Problems Faced */}
                                <div className="space-y-6">
                                    <div className="section-header">
                                        <span className="material-symbols-outlined">report_problem</span>
                                        <h3>7. {t.q7_problemsFaced}</h3>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <textarea
                                            name="problemsFaced"
                                            value={formData.problemsFaced}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            rows="3"
                                            className={`input-field min-h-[100px] resize-y p-3 ${formErrors.problemsFaced ? 'border-red-500' : ''}`}
                                            placeholder={t.q7_problemsPlaceholder}
                                        />
                                        {formErrors.problemsFaced && <p className="error-text">{formErrors.problemsFaced}</p>}
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                {/* Question 8: Training Topics */}
                                <div className="space-y-6">
                                    <div className="section-header">
                                        <span className="material-symbols-outlined">menu_book</span>
                                        <h3>8. {t.q8_trainingTopics}</h3>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="text"
                                            name="trainingTopics"
                                            value={formData.trainingTopics}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            className={`input-field ${formErrors.trainingTopics ? 'border-red-500' : ''}`}
                                            placeholder={t.q8_trainingPlaceholder}
                                        />
                                        {formErrors.trainingTopics && <p className="error-text">{formErrors.trainingTopics}</p>}
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                {/* Question 9: Training Format */}
                                <div className="space-y-6">
                                    <div className="section-header">
                                        <span className="material-symbols-outlined">cast_for_education</span>
                                        <h3>9. {t.q9_trainingFormat}</h3>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <select
                                            name="trainingFormat"
                                            value={formData.trainingFormat}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            className={`input-field ${formErrors.trainingFormat ? 'border-red-500' : ''}`}
                                        >
                                            <option value="">{t.q9_formatPlaceholder}</option>
                                            {TRAINING_FORMAT.map(format => (
                                                <option key={format.value} value={format.value}>{format.label}</option>
                                            ))}
                                        </select>
                                        {formErrors.trainingFormat && <p className="error-text">{formErrors.trainingFormat}</p>}
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                {/* Question 10: Mentor Preference */}
                                <div className="space-y-6">
                                    <div className="section-header">
                                        <span className="material-symbols-outlined">mindfulness</span>
                                        <h3>10. {t.q10_mentorPreference}</h3>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="text"
                                            name="mentorPreference"
                                            value={formData.mentorPreference}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            className={`input-field ${formErrors.mentorPreference ? 'border-red-500' : ''}`}
                                            placeholder={t.q10_mentorPlaceholder}
                                        />
                                        {formErrors.mentorPreference && <p className="error-text">{formErrors.mentorPreference}</p>}
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                {/* Question 11: Suggestions */}
                                <div className="space-y-6">
                                    <div className="section-header">
                                        <span className="material-symbols-outlined">lightbulb</span>
                                        <h3>11. {t.q11_suggestions}</h3>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <textarea
                                            name="suggestions"
                                            value={formData.suggestions}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            rows="4"
                                            className={`input-field min-h-[120px] resize-y p-3 ${formErrors.suggestions ? 'border-red-500' : ''}`}
                                            placeholder={t.q11_suggestionsPlaceholder}
                                        />
                                        {formErrors.suggestions && <p className="error-text">{formErrors.suggestions}</p>}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || cooldownRemaining > 0}
                                        className="btn-primary"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>{t.submitting}</span>
                                            </>
                                        ) : cooldownRemaining > 0 ? (
                                            <span>{t.waiting} ({cooldownRemaining}s)</span>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined">send</span>
                                                <span>{t.submitButton}</span>
                                            </>
                                        )}
                                    </button>
                                    <p className="text-center text-xs text-slate-400 mt-4">{t.securityNote}</p>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="mt-auto border-t border-slate-200 bg-white py-10 px-6">
                <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-6 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[20px]">call</span>
                            <span className="font-medium">+998(77)489-16-31</span>
                        </div>
                    </div>
                    <div className="text-xs text-slate-400 text-center md:text-right">
                        © 2026 KO'MAK+ LOYIHASI. Barcha huquqlar himoyalangan.
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
