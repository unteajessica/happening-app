"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGenerator = startGenerator;
exports.stopGenerator = stopGenerator;
exports.getGeneratorStatus = getGeneratorStatus;
const faker_1 = require("@faker-js/faker");
const events_memory_1 = require("../data/events.memory");
const socket_1 = require("../socket");
let generatorInterval = null;
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
function formatFutureDate() {
    const futureDate = faker_1.faker.date.soon({ days: 180 });
    const day = String(futureDate.getDate()).padStart(2, "0");
    const month = String(futureDate.getMonth() + 1).padStart(2, "0");
    const year = futureDate.getFullYear();
    return `${day}-${month}-${year}`;
}
function generateFakeEvent() {
    const category = faker_1.faker.helpers.arrayElement(categories);
    const location = faker_1.faker.helpers.arrayElement(locations);
    const price = faker_1.faker.helpers.arrayElement(prices);
    return {
        id: (0, events_memory_1.getNextEventId)(),
        title: `${faker_1.faker.word.adjective({ length: { min: 4, max: 8 } })} ${category} ${faker_1.faker.number.int({ min: 1, max: 9999 })}`,
        category,
        date: formatFutureDate(),
        location,
        price,
        description: faker_1.faker.lorem.sentences(2),
        imageUrl: faker_1.faker.image.urlPicsumPhotos({ width: 800, height: 600 }),
    };
}
function startGenerator() {
    if (generatorInterval) {
        return { message: "Generator is already running." };
    }
    generatorInterval = setInterval(() => {
        const newEvent = generateFakeEvent();
        events_memory_1.events.push(newEvent);
        const io = (0, socket_1.getIo)();
        io.emit("event-created", newEvent);
    }, 1500);
    return { message: "Generator started successfully." };
}
function stopGenerator() {
    if (!generatorInterval) {
        return { message: "Generator is not running." };
    }
    clearInterval(generatorInterval);
    generatorInterval = null;
    return { message: "Generator stopped successfully." };
}
function getGeneratorStatus() {
    return {
        isRunning: generatorInterval !== null,
    };
}
