export type EventItem = {
    id: number;
    title: string;
    category: string;
    date: string;
    location: string;
    price: string;
    description: string;
    imageUrl: string;
};

export type EventInput = Omit<EventItem, "id">