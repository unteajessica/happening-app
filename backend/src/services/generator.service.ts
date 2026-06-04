import { events, getNextEventId } from "../data/events.memory";
import type { EventItem } from "../data/event";
import { getIo } from "../socket";

let generatorInterval: NodeJS.Timeout | null = null;

const categories = [
    "Music",
    "Festival",
    "Workshop",
    "Business",
    "Exhibition",
    "Sport",
    "Technology",
    "Food",
    "Entertainment",
    "Health",
    "Social",
    "Art",
];

const locations = [
    "Cluj Arena",
    "Central Park",
    "Town Hall Square",
    "City Hall",
    "Tech Hub",
    "Expo Center",
    "Old Town",
    "Innovation Hub",
    "Cinema City",
    "Downtown",
];

const prices = [
    "Free",
    "$5",
    "$10",
    "$15",
    "$20",
    "$25",
    "$30",
    "$40",
    "$50",
    "$80",
];

const adjectives = [
    "Creative",
    "Modern",
    "Local",
    "Urban",
    "Interactive",
    "Bright",
    "Fresh",
    "Dynamic",
    "Social",
    "Open",
];

const descriptions = [
    "Join this event to discover new people, ideas and experiences in your city.",
    "A community event designed for people who want to learn, connect and enjoy something new.",
    "An engaging local experience with activities, networking opportunities and a friendly atmosphere.",
    "A great opportunity to explore local culture, meet participants and enjoy a memorable event.",
];

function getRandomItem<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
}

function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatFutureDate(): string {
    const futureDate = new Date();

    futureDate.setDate(futureDate.getDate() + getRandomNumber(1, 180));

    const day = String(futureDate.getDate()).padStart(2, "0");
    const month = String(futureDate.getMonth() + 1).padStart(2, "0");
    const year = futureDate.getFullYear();

    return `${day}-${month}-${year}`;
}

function generateFakeEvent(): EventItem {
    const category = getRandomItem(categories);
    const location = getRandomItem(locations);
    const price = getRandomItem(prices);
    const adjective = getRandomItem(adjectives);
    const eventNumber = getRandomNumber(1, 9999);

    return {
        id: getNextEventId(),
        title: `${adjective} ${category} ${eventNumber}`,
        category,
        date: formatFutureDate(),
        location,
        price,
        description: getRandomItem(descriptions),
        imageUrl: `https://picsum.photos/seed/event-${eventNumber}/800/600`,
    };
}

export function startGenerator() {
    if (generatorInterval) {
        return { message: "Generator is already running." };
    }

    generatorInterval = setInterval(() => {
        const newEvent = generateFakeEvent();
        events.push(newEvent);

        const io = getIo();
        io.emit("event-created", newEvent);
    }, 1500);

    return { message: "Generator started successfully." };
}

export function stopGenerator() {
    if (!generatorInterval) {
        return { message: "Generator is not running." };
    }

    clearInterval(generatorInterval);
    generatorInterval = null;

    return { message: "Generator stopped successfully." };
}

export function getGeneratorStatus() {
    return {
        isRunning: generatorInterval !== null,
    };
}