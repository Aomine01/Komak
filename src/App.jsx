/**
 * KO'MAK+ LOYIHASI - EDUCATIONAL CENTER SURVEY
 * 
 * Features:
 * - 9-question survey for educational centers
 * - Multi-language support (UZ/RU/EN)
 * - Modern form layout with validation
 * - Telegram redirect after submission
 */

import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { validateAllFields } from './utils/validation';
import { checkCooldown, setCooldown } from './utils/cooldown';
import { REGIONS, OPERATING_STATUS, FOREIGN_LANGUAGES, ACHIEVEMENTS } from './data/formOptions';
import { translations } from './utils/translations';

function App() {
    // ========== STATE MANAGEMENT ==========
    const [language, setLanguage] = useState('uz');
    const t = translations[language];

    const [formData, setFormData] = useState({
        name: '',                    // Q1: Ismingiz
        centerName: '',              // Q2: O'quv markazingiz nomi
        centerLocation: '',          // Q3: Joylashgan hudud
        operatingStatus: '',         // Q4: Faoliyat ko'rsatyaptimi (HA/Jarayonda/YO'Q)
        studentCount: '',            // Q5: O'quvchilar soni
        languagesOffered: '',        // Q6: Nechta xorijiy til
        achievements: [],            // Q7: O'quvchilar yutuqlari (multiple)
        foreignUniversities: '',     // Q8: Chet universitetlar
        loanInterest: null          // Q9: Qo'shimcha ssuda (true/false)
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

    const handleAchievementChange = (achievementValue) => {
        setFormData(prev => {
            const currentAchievements = prev.achievements;
            const isSelected = currentAchievements.includes(achievementValue);

            return {
                ...prev,
                achievements: isSelected
                    ? currentAchievements.filter(a => a !== achievementValue)
                    : [...currentAchievements, achievementValue]
            };
        });
    };

    const handleLoanChange = (value) => {
        setFormData(prev => ({
            ...prev,
            loanInterest: value
        }));

        if (formErrors.loanInterest) {
            setFormErrors(prev => ({
                ...prev,
                loanInterest: ''
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
            const { data, error } = await supabase
                .from('center_survey')
                .insert([
                    {
                        name: formData.name.trim(),
                        center_name: formData.centerName.trim(),
                        center_location: formData.centerLocation,
                        operating_status: formData.operatingStatus,
                        student_count: parseInt(formData.studentCount, 10),
                        languages_offered: formData.languagesOffered,
                        achievements: formData.achievements,
                        foreign_universities: formData.foreignUniversities.trim(),
                        loan_interest: formData.loanInterest
                    }
                ])
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
                centerName: '',
                centerLocation: '',
                operatingStatus: '',
                studentCount: '',
                languagesOffered: '',
                achievements: [],
                foreignUniversities: '',
                loanInterest: null
            });

            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Success - no redirect

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
                        <img src="/logo.svg" alt="KO'MAK LOYIHASI" className="h-14 w-auto" />
                    </div>

                    {/* Language Switcher */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setLanguage('uz')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${language === 'uz'
                                ? 'bg-primary text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            UZ
                        </button>
                        <button
                            onClick={() => setLanguage('ru')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${language === 'ru'
                                ? 'bg-primary text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            RU
                        </button>
                        <button
                            onClick={() => setLanguage('en')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${language === 'en'
                                ? 'bg-primary text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            EN
                        </button>
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
                    <div className="mb-8 text-center md:text-left">
                        <h2 className="text-primary text-3xl font-extrabold tracking-tight">{t.formTitle}</h2>
                        <p className="text-slate-500 mt-2">{t.formSubtitle}</p>
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

                                {/* Question 2: Center Name */}
                                <div className="space-y-6">
                                    <div className="section-header">
                                        <span className="material-symbols-outlined">school</span>
                                        <h3>2. {t.q2_centerName}</h3>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="text"
                                            name="centerName"
                                            value={formData.centerName}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            className={`input-field ${formErrors.centerName ? 'border-red-500' : ''}`}
                                            placeholder={t.q2_placeholder}
                                        />
                                        {formErrors.centerName && <p className="error-text">{formErrors.centerName}</p>}
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                {/* Question 3: Center Location */}
                                <div className="space-y-6">
                                    <div className="section-header">
                                        <span className="material-symbols-outlined">location_on</span>
                                        <h3>3. {t.q3_location}</h3>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <select
                                            name="centerLocation"
                                            value={formData.centerLocation}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            className={`input-field ${formErrors.centerLocation ? 'border-red-500' : ''}`}
                                        >
                                            <option value="">{t.q3_placeholder}</option>
                                            {REGIONS.map(region => (
                                                <option key={region} value={region}>{region}</option>
                                            ))}
                                        </select>
                                        {formErrors.centerLocation && <p className="error-text">{formErrors.centerLocation}</p>}
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                {/* Question 4: Operating Status */}
                                <div className="space-y-6">
                                    <div className="section-header">
                                        <span className="material-symbols-outlined">store</span>
                                        <h3>4. {t.q4_status}</h3>
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
                                                <option key={status.value} value={status.value}>{status.label}</option>
                                            ))}
                                        </select>
                                        {formErrors.operatingStatus && <p className="error-text">{formErrors.operatingStatus}</p>}
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                {/* Question 5: Student Count */}
                                <div className="space-y-6">
                                    <div className="section-header">
                                        <span className="material-symbols-outlined">groups</span>
                                        <h3>5. {t.q5_students}</h3>
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
                                            placeholder={t.q5_placeholder}
                                        />
                                        {formErrors.studentCount && <p className="error-text">{formErrors.studentCount}</p>}
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                {/* Question 6: Languages Offered */}
                                <div className="space-y-6">
                                    <div className="section-header">
                                        <span className="material-symbols-outlined">translate</span>
                                        <h3>6. {t.q6_languages}</h3>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <select
                                            name="languagesOffered"
                                            value={formData.languagesOffered}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            className={`input-field ${formErrors.languagesOffered ? 'border-red-500' : ''}`}
                                        >
                                            <option value="">Tanlang</option>
                                            {FOREIGN_LANGUAGES.map(lang => (
                                                <option key={lang.value} value={lang.value}>{lang.label}</option>
                                            ))}
                                        </select>
                                        {formErrors.languagesOffered && <p className="error-text">{formErrors.languagesOffered}</p>}
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                {/* Question 7: Achievements */}
                                <div className="space-y-6">
                                    <div className="section-header">
                                        <span className="material-symbols-outlined">emoji_events</span>
                                        <h3>7. {t.q7_achievements}</h3>
                                    </div>

                                    <p className="text-sm text-slate-500 mb-4">{t.q7_description}</p>

                                    <div className="space-y-3">
                                        {ACHIEVEMENTS.map(achievement => (
                                            <label key={achievement.value} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.achievements.includes(achievement.value)}
                                                    onChange={() => handleAchievementChange(achievement.value)}
                                                    disabled={isSubmitting}
                                                    className="w-5 h-5 text-primary border-slate-300 rounded focus:ring-2 focus:ring-primary/20 cursor-pointer"
                                                />
                                                <span className="text-sm font-medium text-slate-700">{achievement.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                {/* Question 8: Foreign Universities */}
                                <div className="space-y-6">
                                    <div className="section-header">
                                        <span className="material-symbols-outlined">public</span>
                                        <h3>8. {t.q8_universities}</h3>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="text"
                                            name="foreignUniversities"
                                            value={formData.foreignUniversities}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            className={`input-field ${formErrors.foreignUniversities ? 'border-red-500' : ''}`}
                                            placeholder={t.q8_placeholder}
                                        />
                                        {formErrors.foreignUniversities && <p className="error-text">{formErrors.foreignUniversities}</p>}
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                {/* Question 9: Loan Interest */}
                                <div className="space-y-6">
                                    <div className="section-header">
                                        <span className="material-symbols-outlined">attach_money</span>
                                        <h3>9. {t.q9_loan}</h3>
                                    </div>

                                    <div className="toggle-group">
                                        <button
                                            type="button"
                                            onClick={() => handleLoanChange(true)}
                                            disabled={isSubmitting}
                                            className={`toggle-btn ${formData.loanInterest === true ? 'active' : ''}`}
                                        >
                                            {t.q9_yes}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleLoanChange(false)}
                                            disabled={isSubmitting}
                                            className={`toggle-btn ${formData.loanInterest === false ? 'active' : ''}`}
                                        >
                                            {t.q9_no}
                                        </button>
                                    </div>
                                    {formErrors.loanInterest && <p className="error-text">{formErrors.loanInterest}</p>}
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
                        <a
                            href="https://t.me/komak_loyihasi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:text-primary transition-colors"
                        >
                            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                            </svg>
                            <span className="font-medium">{t.telegram}</span>
                        </a>
                    </div>
                    <div className="text-xs text-slate-400 text-center md:text-right">
                        © 2026 KO'MAK LOYIHASI. Barcha huquqlar himoyalangan.
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
