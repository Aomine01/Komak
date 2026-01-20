/**
 * KO'MAK LOYIHASI - MAIN APPLICATION COMPONENT
 * 
 * Production-grade secure form with:
 * - Strict validation (phone regex, age range, name format)
 * - Anti-spam cooldown (60 seconds)
 * - Error masking (no raw system errors exposed)
 * - Professional UX (loading states, focus rings, transitions)
 * - All text in Uzbek (Latin script)
 */

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { supabase } from './supabaseClient';
import { validateAllFields } from './utils/validation';
import { checkCooldown, setCooldown } from './utils/cooldown';
import { REGIONS, DIRECTIONS } from './data/options';

function App() {
    // ========== STATE MANAGEMENT ==========

    // Form data (single source of truth)
    const [formData, setFormData] = useState({
        fullName: '',
        age: '',
        phone: '',
        region: '',
        district: '',
        planningCenter: null, // null = not selected, true = Ha, false = Yo'q
        centerDirections: [] // Array of selected directions
    });

    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [cooldownRemaining, setCooldownRemaining] = useState(0);
    const [formErrors, setFormErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

    // ========== COOLDOWN TIMER ==========

    useEffect(() => {
        // Check cooldown on mount
        const { inCooldown, remainingSeconds } = checkCooldown();
        if (inCooldown) {
            setCooldownRemaining(remainingSeconds);
        }

        // Update cooldown timer every second
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

    /**
     * Handle text input changes
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    /**
     * Handle radio button change (planning center)
     */
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

    /**
     * Handle checkbox change (directions - multi-select)
     */
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

    /**
     * Handle form submission
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset previous status
        setSubmitStatus(null);

        // 1. VALIDATION: Check all fields
        const errors = validateAllFields(formData);

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            // Scroll to first error
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // 2. COOLDOWN: Check if user is in cooldown
        const { inCooldown, remainingSeconds } = checkCooldown();
        if (inCooldown) {
            setCooldownRemaining(remainingSeconds);
            setSubmitStatus('error');
            setFormErrors({
                submit: `Iltimos, ${remainingSeconds} soniyadan keyin qayta urinib ko'ring.`
            });
            return;
        }

        // 3. SUBMIT: Send to Supabase
        setIsSubmitting(true);
        setFormErrors({});

        try {
            // Use Supabase SDK (prevents SQL injection via parameterized queries)
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

            // 4. SUCCESS: Set cooldown and show success message
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

            // Scroll to top to show success message
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            // 5. ERROR HANDLING: Log actual error, show generic message
            console.error('Submission error:', error);

            // Never expose system details to user
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
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-navy-500 mb-3">
                        KO'MAK LOYIHASI
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Ro'yxatdan o'tish formasi
                    </p>
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                        <CheckCircle2 className="text-green-600 mt-0.5 flex-shrink-0" size={20} />
                        <div>
                            <h3 className="font-semibold text-green-800">Muvaffaqiyatli yuborildi!</h3>
                            <p className="text-green-700 text-sm mt-1">
                                Arizangiz qabul qilindi. Tez orada siz bilan bog'lanamiz.
                            </p>
                        </div>
                    </div>
                )}

                {submitStatus === 'error' && formErrors.submit && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
                        <div>
                            <h3 className="font-semibold text-red-800">Xatolik</h3>
                            <p className="text-red-700 text-sm mt-1">{formErrors.submit}</p>
                        </div>
                    </div>
                )}

                {/* Cooldown Warning */}
                {cooldownRemaining > 0 && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                        <Clock className="text-yellow-600 mt-0.5 flex-shrink-0" size={20} />
                        <div>
                            <h3 className="font-semibold text-yellow-800">Kuting</h3>
                            <p className="text-yellow-700 text-sm mt-1">
                                Siz yaqinda ariza topshirdingiz. Qayta yuborish uchun {cooldownRemaining} soniya kuting.
                            </p>
                        </div>
                    </div>
                )}

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-8">

                    {/* Full Name */}
                    <div className="mb-6">
                        <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                            F.I.Sh. (To'liq ism) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            className={`input-field ${formErrors.fullName ? 'border-red-500 ring-red-500' : ''}`}
                            placeholder="Masalan: Aliyev Vali Akramovich"
                        />
                        {formErrors.fullName && (
                            <p className="error-text">{formErrors.fullName}</p>
                        )}
                    </div>

                    {/* Age */}
                    <div className="mb-6">
                        <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
                            Yoshingiz <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={formData.age}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            min="14"
                            max="35"
                            className={`input-field ${formErrors.age ? 'border-red-500 ring-red-500' : ''}`}
                            placeholder="14 dan 35 gacha"
                        />
                        {formErrors.age && (
                            <p className="error-text">{formErrors.age}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div className="mb-6">
                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                            Telefon raqamingiz <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            className={`input-field ${formErrors.phone ? 'border-red-500 ring-red-500' : ''}`}
                            placeholder="+998 90 123 45 67"
                        />
                        {formErrors.phone && (
                            <p className="error-text">{formErrors.phone}</p>
                        )}
                    </div>

                    {/* Region */}
                    <div className="mb-6">
                        <label htmlFor="region" className="block text-sm font-semibold text-gray-700 mb-2">
                            Viloyat <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="region"
                            name="region"
                            value={formData.region}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            className={`input-field ${formErrors.region ? 'border-red-500 ring-red-500' : ''}`}
                        >
                            <option value="">Viloyatni tanlang</option>
                            {REGIONS.map(region => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                        </select>
                        {formErrors.region && (
                            <p className="error-text">{formErrors.region}</p>
                        )}
                    </div>

                    {/* District */}
                    <div className="mb-6">
                        <label htmlFor="district" className="block text-sm font-semibold text-gray-700 mb-2">
                            Tuman / shahar <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="district"
                            name="district"
                            value={formData.district}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            className={`input-field ${formErrors.district ? 'border-red-500 ring-red-500' : ''}`}
                            placeholder="Masalan: Chilonzor"
                        />
                        {formErrors.district && (
                            <p className="error-text">{formErrors.district}</p>
                        )}
                    </div>

                    {/* Planning Center - Radio */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            O'quv markazi ochishni rejalashtiryapsizmi? <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-3">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="planningCenter"
                                    checked={formData.planningCenter === true}
                                    onChange={() => handlePlanningChange(true)}
                                    disabled={isSubmitting}
                                    className="w-4 h-4 text-navy-500 focus:ring-indigo-500 focus:ring-2"
                                />
                                <span className="ml-3 text-gray-700">Ha</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="planningCenter"
                                    checked={formData.planningCenter === false}
                                    onChange={() => handlePlanningChange(false)}
                                    disabled={isSubmitting}
                                    className="w-4 h-4 text-navy-500 focus:ring-indigo-500 focus:ring-2"
                                />
                                <span className="ml-3 text-gray-700">Yo'q</span>
                            </label>
                        </div>
                        {formErrors.planningCenter && (
                            <p className="error-text">{formErrors.planningCenter}</p>
                        )}
                    </div>

                    {/* Directions - Multi-select Checkboxes */}
                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            O'quv markazi yo'nalishi (bir nechtasini tanlashingiz mumkin)
                        </label>
                        <div className="space-y-3">
                            {DIRECTIONS.map(direction => (
                                <label key={direction} className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.centerDirections.includes(direction)}
                                        onChange={() => handleDirectionChange(direction)}
                                        disabled={isSubmitting}
                                        className="w-4 h-4 text-navy-500 focus:ring-indigo-500 focus:ring-2 rounded"
                                    />
                                    <span className="ml-3 text-gray-700">{direction}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || cooldownRemaining > 0}
                        className="btn-primary w-full"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="animate-spin" size={20} />
                                Yuborilmoqda...
                            </span>
                        ) : cooldownRemaining > 0 ? (
                            <span>Kuting ({cooldownRemaining}s)</span>
                        ) : (
                            'Yuborish'
                        )}
                    </button>

                </form>

                {/* Footer */}
                <div className="text-center mt-8 text-sm text-gray-500">
                    <p>© 2026 KO'MAK LOYIHASI. Barcha huquqlar himoyalangan.</p>
                </div>

            </div>
        </div>
    );
}

export default App;
