import Cookies from 'js-cookie';

const COOKIE_EXPIRY_DAYS = 7;

// preferred view
export const savePreferredView = (view: 'table' | 'cards') => {
    Cookies.set('preferredView', view, { expires: COOKIE_EXPIRY_DAYS });
};

export const getPreferredView = (): 'table' | 'cards' => {
    return (Cookies.get('preferredView') as 'table' | 'cards') || 'table';
};

// last viewed event
export const saveLastViewedEvent = (eventId: number) => {
    Cookies.set('lastViewedEvent', String(eventId), { expires: COOKIE_EXPIRY_DAYS });
};

export const getLastViewedEvent = (): number | null => {
    const val = Cookies.get('lastViewedEvent');
    return val ? parseInt(val) : null;
};

// last visited page number
export const saveLastPage = (page: number) => {
    Cookies.set('lastPage', String(page), { expires: COOKIE_EXPIRY_DAYS });
};

export const getLastPage = (): number => {
    const val = Cookies.get('lastPage');
    return val ? parseInt(val) : 1;
};

// visit count
export const incrementVisitCount = () => {
    const current = parseInt(Cookies.get('visitCount') || '0');
    Cookies.set('visitCount', String(current + 1), { expires: COOKIE_EXPIRY_DAYS });
};

export const getVisitCount = (): number => {
    return parseInt(Cookies.get('visitCount') || '0');
};

// last visit timestamp
export const saveLastVisit = () => {
    Cookies.set('lastVisit', new Date().toISOString(), { expires: COOKIE_EXPIRY_DAYS });
};

export const getLastVisit = (): string | null => {
    return Cookies.get('lastVisit') || null;
};