/**
 * SECURITY MODULE: ANTI-SPAM COOLDOWN
 * 
 * Implements client-side rate limiting using localStorage.
 * After a successful submission, prevents resubmission for 60 seconds.
 * 
 * IMPORTANT: This is CLIENT-SIDE ONLY. For production, implement
 * server-side rate limiting (Supabase Edge Functions or Row Level Security).
 */

const COOLDOWN_DURATION_MS = 60 * 1000; // 60 seconds
const STORAGE_KEY = 'komak_last_submission_time';

/**
 * Checks if the user is currently in cooldown period
 * 
 * @returns {Object} { inCooldown: boolean, remainingSeconds: number }
 */
export const checkCooldown = () => {
    const lastSubmissionTime = localStorage.getItem(STORAGE_KEY);

    if (!lastSubmissionTime) {
        return { inCooldown: false, remainingSeconds: 0 };
    }

    const lastSubmissionTimestamp = parseInt(lastSubmissionTime, 10);
    const currentTime = Date.now();
    const timeSinceLastSubmission = currentTime - lastSubmissionTimestamp;

    if (timeSinceLastSubmission < COOLDOWN_DURATION_MS) {
        const remainingMs = COOLDOWN_DURATION_MS - timeSinceLastSubmission;
        const remainingSeconds = Math.ceil(remainingMs / 1000);

        return { inCooldown: true, remainingSeconds };
    }

    // Cooldown expired, clear the storage
    localStorage.removeItem(STORAGE_KEY);
    return { inCooldown: false, remainingSeconds: 0 };
};

/**
 * Sets a new cooldown timestamp after successful submission
 */
export const setCooldown = () => {
    const currentTime = Date.now();
    localStorage.setItem(STORAGE_KEY, currentTime.toString());
};

/**
 * Manually clears the cooldown (useful for testing or admin override)
 */
export const clearCooldown = () => {
    localStorage.removeItem(STORAGE_KEY);
};
