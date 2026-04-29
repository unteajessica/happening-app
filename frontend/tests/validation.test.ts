import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { validateEventForm, EventFormValues } from '../src/validators/eventValidation';

// group test together
describe('validateEventForm', () => {
    // freeze time for each test inside this block
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-06-01'));
    });

    // reset global clock
    afterEach(() => {
        vi.useRealTimers();
    });

    // start with a valid data entry
    const validBase: EventFormValues = {
        title: 'Party',
        category: 'Social',
        date: '10-06-2026',
        location: 'Cluj',
        price: '10',
        description: 'Fun time'
    };

    // start tests
    it('should catch all empty/whitespace-only fields', () => {
        const emptyValues: EventFormValues = {
            title: '  ',
            category: '',
            date: '',
            location: ' ',
            price: '',
            description: '\n'
        };
        const errors = validateEventForm(emptyValues);
    
        expect(errors.title).toBe('Title is required.');
        expect(errors.category).toBe('Category is required.');
        expect(errors.date).toBe('Date is required.');
        expect(errors.location).toBe('Location is required.');
        expect(errors.price).toBe('Price is required.');
        expect(errors.description).toBe('Description is required.');
    });


    it('should reject dates that do not match DD-MM-YYYY', () => {
        const invalidFormats = ['2026-01-01', '01/01/2026', '1-1-2026', '01-01-26'];
        invalidFormats.forEach(date => {
            const errors = validateEventForm({ ...validBase, date });
            expect(errors.date).toBe('Date must be in format DD-MM-YYYY, for example 01-01-2026.');
        });
    });

    it('should reject months outside 01-12', () => {
        const errorsLo = validateEventForm({ ...validBase, date: '01-00-2026' });
        const errorsHi = validateEventForm({ ...validBase, date: '01-13-2026' });
        expect(errorsLo.date).toBe('Month must be between 01 and 12.');
        expect(errorsHi.date).toBe('Month must be between 01 and 12.');
    });

    it('should reject days that do not exist in a specific month', () => {
        // Feb 30th
        const errorsFeb = validateEventForm({ ...validBase, date: '30-02-2026' });
        expect(errorsFeb.date).toBe('Invalid day for the selected month and year.');

        // April 31st (April only has 30 days)
        const errorsApril = validateEventForm({ ...validBase, date: '31-04-2026' });
        expect(errorsApril.date).toBe('Invalid day for the selected month and year.');
    });

    it('should handle leap years correctly', () => {
        // 2024 was a leap year, 2028 is next. 2026 is NOT.
        const errors = validateEventForm({ ...validBase, date: '29-02-2026' });
        expect(errors.date).toBe('Invalid day for the selected month and year.');
    });

    it('should reject dates before today', () => {
        // Today is June 1st, 2026 (per mock)
        const errors = validateEventForm({ ...validBase, date: '31-05-2026' });
        expect(errors.date).toBe('Date cannot be in the past.');
    });

    it('should accept today as a valid date', () => {
        const errors = validateEventForm({ ...validBase, date: '01-06-2026' });
        expect(errors.date).toBeUndefined();
    });

    it('should return zero errors for perfectly valid data', () => {
        const errors = validateEventForm(validBase);
        expect(errors).toEqual({});
    });
});