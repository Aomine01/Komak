/**
 * KO'MAK LOYIHASI - MODERN APPLICATION COMPONENT
 * 
 * Features:
 * - Hero section with background image
 * - Modern form layout with sections
 * - Loading state with spinner
 * - Toggle buttons for planning center
 * - Pill-style direction selectors
 * - Telegram redirect after submission
 */

import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { validateAllFields } from './utils/validation';
import { checkCooldown, setCooldown } from './utils/cooldown';
import { REGIONS, DIRECTIONS } from './data/options';

function App() {
    // ========== STATE MANAGEMENT ==========
    const [formData, setFormData] = useState({
        fullName: '',
        age: '',
        phone: '',
        region: '',
        district: '',
        planningCenter: null,
        centerDirections: []
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

    const handlePlanningChange = (value) => {
        setFormData(prev => ({
            ...prev,
            planningCenter: value
        }));

        if (formErrors.planningCenter) {
            setFormErrors(prev => ({
                ...prev,
                planningCenter: ''
            }));
        }
    };

    const handleDirectionChange = (direction) => {
        setFormData(prev => {
            const currentDirections = prev.centerDirections;
            const isSelected = currentDirections.includes(direction);

            return {
                ...prev,
                centerDirections: isSelected
                    ? currentDirections.filter(d => d !== direction)
                    : [...currentDirections, direction]
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus(null);

        // Validation
        const errors = validateAllFields(formData);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Cooldown check
        const { inCooldown, remainingSeconds } = checkCooldown();
        if (inCooldown) {
            setCooldownRemaining(remainingSeconds);
            setSubmitStatus('error');
            setFormErrors({
                submit: `Iltimos, ${remainingSeconds} soniyadan keyin qayta urinib ko'ring.`
            });
            return;
        }

        // Submit
        setIsSubmitting(true);
        setFormErrors({});

        try {
            const { data, error } = await supabase
                .from('applications')
                .insert([
                    {
                        full_name: formData.fullName.trim(),
                        age: parseInt(formData.age, 10),
                        phone: formData.phone.trim(),
                        region: formData.region,
                        district: formData.district.trim(),
                        planning_center: formData.planningCenter,
                        center_directions: formData.centerDirections
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
                fullName: '',
                age: '',
                phone: '',
                region: '',
                district: '',
                planningCenter: null,
                centerDirections: []
            });

            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Redirect to Telegram after 2 seconds
            setTimeout(() => {
                window.location.href = 'https://t.me/komak_loyihasi';
            }, 2000);

        } catch (error) {
            console.error('Submission error:', error);
            setSubmitStatus('error');
            setFormErrors({
                submit: "Xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring."
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
                        <img src="/logo.svg" alt="KO'MAK LOYIHASI" className="h-10 w-auto" />
                    </div>
                    <button className="flex items-center justify-center gap-2 rounded-xl h-10 px-4 bg-primary text-white text-sm font-bold tracking-wide">
                        <span className="material-symbols-outlined text-[18px]">language</span>
                        <span>UZ</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow max-w-[1200px] mx-auto px-4 md:px-10 py-10 space-y-12 w-full">

                {/* Hero Section */}
                <section className="hero-section">
                    <div className="max-w-2xl space-y-6">
                        <h1 className="text-white text-4xl md:text-5xl font-black tracking-tight leading-tight">
                            Imkoniyatlarni Qayta Tiklash
                        </h1>
                        <p className="text-blue-100 text-lg md:text-xl font-light opacity-90 max-w-lg mx-auto">
                            KO'MAK LOYIHASI orqali yangi imkoniyatlar eshigini oching va o'z innovatsion loyihangizni boshlang.
                        </p>
                    </div>
                </section>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                    <div className="success-message animate-fadeIn">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                            <h3 className="font-semibold text-green-800">Muvaffaqiyatli yuborildi!</h3>
                            <p className="text-green-700 text-sm mt-1">Arizangiz qabul qilindi. Tez orada siz bilan bog'lanamiz.</p>
                        </div>
                    </div>
                )}

                {submitStatus === 'error' && formErrors.submit && (
                    <div className="error-message animate-fadeIn">
                        <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <h3 className="font-semibold text-red-800">Xatolik</h3>
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
                            <h3 className="font-semibold text-yellow-800">Kuting</h3>
                            <p className="text-yellow-700 text-sm mt-1">
                                Siz yaqinda ariza topshirdingiz. Qayta yuborish uchun {cooldownRemaining} soniya kuting.
                            </p>
                        </div>
                    </div>
                )}

                {/* Form Section */}
                <section className="max-w-4xl mx-auto">
                    <div className="mb-8 text-center md:text-left">
                        <h2 className="text-primary text-3xl font-extrabold tracking-tight">Ariza Topshirish Formasi</h2>
                        <p className="text-slate-500 mt-2">Iltimos, quyidagi barcha ma'lumotlarni diqqat bilan to'ldiring.</p>
                    </div>

                    <div className="form-card">
                        <div className={`p-8 lg:p-12 ${isSubmitting ? 'loading-overlay' : ''}`}>
                            <form onSubmit={handleSubmit} className="space-y-10">

                                {/* Personal Information Section */}
                                <div className="space-y-6">
                                    <div className="section-header">
                                        <span className="material-symbols-outlined">person</span>
                                        <h3>Shaxsiy ma'lumotlar</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-semibold text-slate-700">To'liq ism (F.I.SH)</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                disabled={isSubmitting}
                                                className={`input-field ${formErrors.fullName ? 'border-red-500' : ''}`}
                                                placeholder="Ismingizni kiriting"
                                            />
                                            {formErrors.fullName && <p className="error-text">{formErrors.fullName}</p>}
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-semibold text-slate-700">Yoshingiz</label>
                                            <input
                                                type="number"
                                                name="age"
                                                value={formData.age}
                                                onChange={handleInputChange}
                                                disabled={isSubmitting}
                                                min="14"
                                                max="35"
                                                className={`input-field ${formErrors.age ? 'border-red-500' : ''}`}
                                                placeholder="Masalan: 25"
                                            />
                                            {formErrors.age && <p className="error-text">{formErrors.age}</p>}
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-semibold text-slate-700">Telefon raqami</label>
                                            <div className="relative flex items-center">
                                                <span className="absolute left-4 font-medium text-slate-500">+998</span>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    disabled={isSubmitting}
                                                    className={`input-field pl-16 ${formErrors.phone ? 'border-red-500' : ''}`}
                                                    placeholder="90 123 45 67"
                                                />
                                            </div>
                                            {formErrors.phone && <p className="error-text">{formErrors.phone}</p>}
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-semibold text-slate-700">Viloyat</label>
                                            <select
                                                name="region"
                                                value={formData.region}
                                                onChange={handleInputChange}
                                                disabled={isSubmitting}
                                                className={`input-field ${formErrors.region ? 'border-red-500' : ''}`}
                                            >
                                                <option value="">Viloyatni tanlang</option>
                                                {REGIONS.map(region => (
                                                    <option key={region} value={region}>{region}</option>
                                                ))}
                                            </select>
                                            {formErrors.region && <p className="error-text">{formErrors.region}</p>}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-slate-700">Tuman / Shahar</label>
                                        <input
                                            type="text"
                                            name="district"
                                            value={formData.district}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                            className={`input-field ${formErrors.district ? 'border-red-500' : ''}`}
                                            placeholder="Tumanni kiriting"
                                        />
                                        {formErrors.district && <p className="error-text">{formErrors.district}</p>}
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                {/* Project Details Section */}
                                <div className="space-y-8">
                                    <div className="section-header">
                                        <span className="material-symbols-outlined">lightbulb</span>
                                        <h3>Loyiha tafsilotlari</h3>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-primary/5 rounded-2xl border border-primary/10">
                                        <div>
                                            <p className="font-bold text-primary">Markaz ochishni rejalashtiryapsizmi?</p>
                                            <p className="text-sm text-slate-500">Yangi o'quv yoki xizmat ko'rsatish markazi</p>
                                        </div>
                                        <div className="toggle-group">
                                            <button
                                                type="button"
                                                onClick={() => handlePlanningChange(true)}
                                                disabled={isSubmitting}
                                                className={`toggle-btn ${formData.planningCenter === true ? 'active' : ''}`}
                                            >
                                                HA
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handlePlanningChange(false)}
                                                disabled={isSubmitting}
                                                className={`toggle-btn ${formData.planningCenter === false ? 'active' : ''}`}
                                            >
                                                YO'Q
                                            </button>
                                        </div>
                                    </div>
                                    {formErrors.planningCenter && <p className="error-text">{formErrors.planningCenter}</p>}

                                    <div className="space-y-4">
                                        <p className="text-sm font-semibold text-slate-700">Yo'nalishlarni tanlang:</p>
                                        <div className="flex flex-wrap gap-3">
                                            {DIRECTIONS.map(direction => (
                                                <button
                                                    key={direction}
                                                    type="button"
                                                    onClick={() => handleDirectionChange(direction)}
                                                    disabled={isSubmitting}
                                                    className={`pill-btn ${formData.centerDirections.includes(direction) ? 'active' : ''}`}
                                                >
                                                    {direction}
                                                </button>
                                            ))}
                                        </div>
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
                                                <span>Ariza Yuborilmoqda...</span>
                                            </>
                                        ) : cooldownRemaining > 0 ? (
                                            <span>Kuting ({cooldownRemaining}s)</span>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined">send</span>
                                                <span>Ariza Yuborish</span>
                                            </>
                                        )}
                                    </button>
                                    <p className="text-center text-xs text-slate-400 mt-4">Ma'lumotlaringiz xavfsizligi kafolatlanadi.</p>
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
                            <span className="font-medium">+998 71 200 00 00</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[20px]">mail</span>
                            <span className="font-medium">info@komak.uz</span>
                        </div>
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
