import { faker } from "@faker-js/faker";
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

const prices = ["Free", "$5", "$10", "$15", "$20", "$25", "$30", "$40", "$50", "$80"];

function formatFutureDate(): string {
    const futureDate = faker.date.soon({ days: 180 });

    const day = String(futureDate.getDate()).padStart(2, "0");
    const month = String(futureDate.getMonth() + 1).padStart(2, "0");
    const year = futureDate.getFullYear();

    return `${day}-${month}-${year}`;
}

function generateFakeEvent(): EventItem {
    const category = faker.helpers.arrayElement(categories);
    const location = faker.helpers.arrayElement(locations);
    const price = faker.helpers.arrayElement(prices);

    return {
        id: getNextEventId(),
        title: `${faker.word.adjective({ length: { min: 4, max: 8 } })} ${category} ${faker.number.int({ min: 1, max: 9999 })}`,
        category,
        date: formatFutureDate(),
        location,
        price,
        description: faker.lorem.sentences(2),
        imageUrl: faker.image.urlPicsumPhotos({ width: 800, height: 600 }),
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