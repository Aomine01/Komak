/**
 * Form Options for Educational Center Survey
 * Updated form structure with 9 questions
 */

// Question 4: Operating Status
export const OPERATING_STATUS = [
    { value: 'ha', label: 'HA' },
    { value: 'jarayonda', label: 'Jarayonda (ta\'mirlanyapti)' },
    { value: 'yoq', label: 'YO\'Q' }
];

// Question 6: Foreign Languages Offered
export const FOREIGN_LANGUAGES = [
    { value: '1', label: 'Faqat bitta (ingliz/rus/turk/nemis/fransuz/koreys)' },
    { value: '2', label: 'Ingliz va rus tili' },
    { value: '3', label: 'Ingliz, rus va nemis tillari' },
    { value: '4', label: 'Ingliz, rus, nemis, turk, koreys va fransuz tillari' }
];

// Question 7: Student Achievements (Multiple Select)
export const ACHIEVEMENTS = [
    { value: 'ielts', label: 'IELTS 7.0+' },
    { value: 'multilevel', label: 'Multilevel C1' },
    { value: 'other_certs', label: 'Boshqa til sertifikatlari C1' },
    { value: 'sat', label: 'SAT' },
    { value: 'toefl', label: 'TOEFL C1' },
    { value: 'topik', label: 'Topik 5/6' },
    { value: 'goethe', label: 'Goethe-Zertifikat C1' },
    { value: 'others', label: 'Boshqalar' }
];

// Keep existing regions for Question 3
export const REGIONS = [
    'Andijon',
    'Buxoro',
    'Farg\'ona',
    'Jizzax',
    'Xorazm',
    'Namangan',
    'Navoiy',
    'Qashqadaryo',
    'Qoraqalpog\'iston Respublikasi',
    'Samarqand',
    'Sirdaryo',
    'Surxondaryo',
    'Toshkent viloyati',
    'Toshkent shahri'
];
