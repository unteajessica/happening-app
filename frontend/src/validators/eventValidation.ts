export type EventFormValues = {
    title: string;
    category: string;
    date: string;
    location: string;
    price: string;
    description: string;
};

export type EventFormErrors = {
    title?: string;
    category?: string;
    date?: string;
    location?: string;
    price?: string;
    imageUrl?: string;
    description?: string;
};

export function validateEventForm(values: EventFormValues): EventFormErrors {
    const errors: EventFormErrors = {};

    if (!values.title.trim()) {
        errors.title = "Title is required.";
    }

    if (!values.category.trim()) {
        errors.category = "Category is required.";
    }

    if (!values.date.trim()) {
        errors.date = "Date is required.";
    }

    if (!values.location.trim()) {
        errors.location = "Location is required.";
    }

    if (!values.price.trim()) {
        errors.price = "Price is required.";
    }

    if (!values.description.trim()) {
        errors.description = "Description is required.";
    }

    if (values.date.trim()) {
        const datePattern = /^(\d{2})-(\d{2})-(\d{4})$/;
        const match = values.date.trim().match(datePattern);

        if (!match) {
            errors.date = "Date must be in format DD-MM-YYYY, for example 01-01-2026.";
        } else {
            const day = Number(match[1]);
            const month = Number(match[2]) - 1;
            const year = Number(match[3]);

            if (month < 0 || month > 11) {
                errors.date = "Month must be between 01 and 12."
            } else {
                const maxDays = new Date(year, month + 1, 0).getDate();
                if (day < 1 || day > maxDays) {
                    errors.date = "Invalid day for the selected month and year.";
                } else {
                    const inputDate = new Date(year, month, day);
                    inputDate.setHours(0, 0, 0, 0);

                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (inputDate < today) {
                        errors.date = "Date cannot be in the past.";
                    } 
                }
            }
        }
    }

    return errors;
}