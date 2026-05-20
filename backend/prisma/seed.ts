import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient, Role } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
    adapter,
});

const initialEvents = [
    {
        id: 1,
        title: "Jazz In The Park",
        category: "Music",
        date: "21-05-2026",
        location: "Central Park",
        price: "$20",
        description:
            "A live jazz performance with 100+ musicians singing across 10 stages.",
        imageUrl:
            "https://yourope.org/wp-content/uploads/2023/04/jazz-in-the-park-3.jpg",
    },
    {
        id: 2,
        title: "Untold",
        category: "Music",
        date: "04-08-2026",
        location: "Central Park",
        price: "$200",
        description:
            "A large music festival with famous artists, live shows, and thousands of fans.",
        imageUrl:
            "https://djmag.com/sites/default/files/styles/djm_23_1005x565/public/2025-02/Untold2024_0811_000542_DJI_20240811000523_0142_D-Enhanced-NR-Edit-2_CR%20%281%29.jpg.webp?itok=wJDTX-Gd960352925",
    },
    {
        id: 3,
        title: "Art Expo",
        category: "Exhibition",
        date: "27-05-2026",
        location: "Art Museum",
        price: "Free",
        description:
            "An exhibition featuring modern paintings, sculptures, and creative local artwork.",
        imageUrl:
            "https://redwoodartgroup.com/wp-content/uploads/2022/04/AENY22-2252.jpg",
    },
    {
        id: 4,
        title: "Coding Workshop",
        category: "Workshop",
        date: "07-06-2026",
        location: "CREIC",
        price: "$10",
        description:
            "A hands-on workshop where participants learn coding through practical exercises.",
        imageUrl:
            "https://instrumentinventors.org/wp-content/uploads/2020/09/04_sasj_and_timo_live-2-scaled.jpg",
    },
    {
        id: 5,
        title: "Sports Festival",
        category: "Sport",
        date: "21-06-2026",
        location: "Central Park",
        price: "Free",
        description:
            "A fun outdoor event with sports games, competitions, and activities for everyone.",
        imageUrl:
            "https://www.sportsfestival.com/wp-content/uploads/2024/07/WhatsApp-Image-2024-07-03-at-13.48.39.jpeg",
    },
    {
        id: 6,
        title: "Startup Pitch Night",
        category: "Business",
        date: "15-07-2026",
        location: "Tech Hub",
        price: "Free",
        description:
            "Entrepreneurs present innovative ideas to investors and a live audience.",
        imageUrl:
            "https://miratechmforce.com/wp-content/uploads/sites/3/2019/04/pitch_night_ny-1.jpg",
    },
    {
        id: 7,
        title: "Food Truck Festival",
        category: "Food",
        date: "18-07-2026",
        location: "City Square",
        price: "$5",
        description:
            "A delicious gathering of food trucks offering international cuisine and desserts.",
        imageUrl:
            "https://www.radiobrasovfm.ro/img.php?u=https%3A%2F%2Fwww.radiobrasovfm.ro%2Fuploads%2Fmodules%2Fnews%2F0%2F2024%2F5%2F11%2F198355%2F17154343781f551fce.jpg&w=960&h=540&c=1",
    },
    {
        id: 8,
        title: "Rock Concert",
        category: "Music",
        date: "25-07-2026",
        location: "Cluj Arena",
        price: "$50",
        description:
            "An electrifying rock concert featuring top international bands.",
        imageUrl:
            "https://images.stockcake.com/public/3/d/1/3d182bb7-f9e3-4cd3-aae2-6c37874aef6e_large/epic-rock-concert-stockcake.jpg",
    },
    {
        id: 9,
        title: "Photography Walk",
        category: "Workshop",
        date: "02-08-2026",
        location: "Old Town",
        price: "$15",
        description:
            "A guided walk for photography enthusiasts to capture the beauty of the city.",
        imageUrl:
            "https://static-cse.canva.com/blob/1625925/jaywennington624unsplash.jpg",
    },
    {
        id: 10,
        title: "Book Fair",
        category: "Exhibition",
        date: "10-08-2026",
        location: "Expo Center",
        price: "Free",
        description:
            "A large book fair with publishers, authors, and thousands of titles.",
        imageUrl:
            "https://images.livemint.com/img/2023/02/24/original/book_fair_1677231488890.jpg",
    },
    {
        id: 11,
        title: "Yoga in the Park",
        category: "Health",
        date: "12-08-2026",
        location: "Central Park",
        price: "$8",
        description:
            "Relaxing outdoor yoga sessions suitable for all experience levels.",
        imageUrl:
            "https://img.freepik.com/premium-photo/yoga-park-family-couple-exercising-outdoors_34777-153.jpg",
    },
    {
        id: 12,
        title: "Film Festival",
        category: "Entertainment",
        date: "20-08-2026",
        location: "Cinema City",
        price: "$30",
        description:
            "A week-long festival showcasing international films and premieres.",
        imageUrl:
            "https://img.festival-cannes.com/eyJidWNrZXQiOiJtZWRpYSIsImtleSI6InVwbG9hZHNcLzIwMTlcLzA1XC9HUk9VUEUtR0VUVFktSk9ITi1QSElMTElQUy5qcGciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjc4MCwiZml0IjoiY292ZXIifX19",
    },
    {
        id: 13,
        title: "Gaming Convention",
        category: "Technology",
        date: "05-09-2026",
        location: "Polyvalent Hall",
        price: "$25",
        description:
            "A gathering of gamers with tournaments, demos, and new game releases.",
        imageUrl:
            "https://us.v-cdn.net/6036147/uploads/I68KDAH8MDYQ/10-must-attend-gaming-conventions-in-2024.jpg",
    },
    {
        id: 14,
        title: "Charity Run",
        category: "Sport",
        date: "12-09-2026",
        location: "City Stadium",
        price: "$10",
        description:
            "A 5K charity run supporting local community projects.",
        imageUrl:
            "https://runnersclub.ro/wp-content/uploads/2025/10/1200x630-FB-post-1.png",
    },
    {
        id: 15,
        title: "Wine Tasting Event",
        category: "Food",
        date: "18-09-2026",
        location: "Wine House",
        price: "$40",
        description:
            "Taste premium wines guided by experienced sommeliers.",
        imageUrl:
            "https://www.coravin.com/cdn/shop/articles/AdobeStock_791180394.jpg?v=1765120908",
    },
    {
        id: 16,
        title: "AI & Tech Conference",
        category: "Technology",
        date: "25-09-2026",
        location: "Tech Park",
        price: "$100",
        description:
            "A conference discussing the latest trends in AI and emerging technologies.",
        imageUrl:
            "https://business.itn.co.uk/wp-content/uploads/2024/06/AI_summits.jpg",
    },
    {
        id: 17,
        title: "Street Art Festival",
        category: "Art",
        date: "02-10-2026",
        location: "Downtown",
        price: "Free",
        description:
            "Artists transform city walls into colorful murals and creative expressions.",
        imageUrl:
            "https://imgproxy.urbaneez.art/insecure/rs:fit:1500:0/plain/https://urbaneez-dev.s3.eu-central-1.amazonaws.com/Wynwood%20Walls%20Miami%20Entrance.jpg",
    },
    {
        id: 18,
        title: "Halloween Party",
        category: "Entertainment",
        date: "31-10-2026",
        location: "Club Nova",
        price: "$20",
        description:
            "A spooky themed party with costumes, music, and prizes.",
        imageUrl:
            "https://s.hdnux.com/photos/01/30/04/64/23088397/1/1082x0.jpg",
    },
    {
        id: 19,
        title: "Startup Networking Event",
        category: "Business",
        date: "05-11-2026",
        location: "Innovation Hub",
        price: "$15",
        description:
            "Meet founders, developers, and investors in a relaxed networking environment.",
        imageUrl:
            "https://techhelp.ca/wp-content/uploads/2024/11/How-to-Make-the-Most-of-Business-Networking-Events.jpg",
    },
    {
        id: 20,
        title: "Christmas Market",
        category: "Festival",
        date: "10-12-2026",
        location: "Main Square",
        price: "Free",
        description:
            "A festive market with crafts, food, and holiday decorations.",
        imageUrl:
            "https://media.timeout.com/images/106330330/image.jpg",
    },
    {
        id: 21,
        title: "New Year Concert",
        category: "Music",
        date: "31-12-2026",
        location: "Opera Hall",
        price: "$60",
        description:
            "Celebrate the new year with a classical music concert.",
        imageUrl:
            "https://wph-live.s3.amazonaws.com/media/filer_public_thumbnails/filer_public/7d/27/7d27f2ba-7763-4eb3-9bd6-2de04f6aebd6/header_njk_1layer_1920x1080.jpg__1920x1920_q85_subject_location-960%2C539_subsampling-2.jpg",
    },
    {
        id: 22,
        title: "Winter Sports Day",
        category: "Sport",
        date: "15-01-2027",
        location: "Ski Resort",
        price: "$70",
        description:
            "A day full of skiing, snowboarding, and winter fun.",
        imageUrl:
            "https://www.thecenteroregon.com/wp-content/uploads/2016/12/family-skiers-1200x800.jpeg",
    },
    {
        id: 23,
        title: "Valentine's Gala",
        category: "Social",
        date: "14-02-2027",
        location: "Grand Hotel",
        price: "$80",
        description:
            "A romantic evening with dinner, music, and dancing.",
        imageUrl:
            "https://spartalive.com/uploads/original/20220113-072324-Valentine%20Gala.jpg",
    },
    {
        id: 24,
        title: "Spring Marathon",
        category: "Sport",
        date: "20-03-2027",
        location: "City Center",
        price: "$25",
        description:
            "A full marathon event attracting runners from all over the country.",
        imageUrl:
            "https://runjapan.jp/smp/pickup/__icsFiles/afieldfile/2025/11/05/rjfa_tateyamawakasio2026_main.jpg",
    },
    {
        id: 25,
        title: "Easter Fair",
        category: "Festival",
        date: "10-04-2027",
        location: "Town Hall Square",
        price: "Free",
        description:
            "A traditional fair with handmade crafts, food, and activities for families.",
        imageUrl:
            "https://tlc-mosman.s3.ap-southeast-2.amazonaws.com/wp-content/uploads/2022/03/information-on-the-sydney-royal-easter-show-2021-parking-tickets-opening-hours-showbags-and-events-148629-2.jpg",
    },
];

const permissionNames = [
    "events:read",
    "events:create",
    "events:update",
    "events:delete",

    "categories:read",
    "categories:create",
    "categories:update",
    "categories:delete",

    "comments:read",
    "comments:create",
    "comments:delete",

    "stats:read",

    "favorites:read",
    "favorites:update",

    "game:play",

    "split-view:read",

    "generator:read",
    "generator:start",
    "generator:stop",

    "chat:use",
    "chat:delete",

    "logs:read",
    "suspicious-users:read",
    "suspicious-users:update",
];

const adminPermissions = permissionNames;

const userPermissions = [
    "events:read",

    "categories:read",

    "comments:read",
    "comments:create",

    "stats:read",

    "favorites:read",
    "favorites:update",

    "game:play",

    "split-view:read",

    "chat:use",
];

function parseDate(date: string) {
    const [day, month, year] = date.split("-");
    return new Date(`${year}-${month}-${day}T00:00:00`);
}

function parsePrice(price: string) {
    if (price.toLowerCase() === "free") {
        return 0;
    }

    return Number(price.replace("$", "").trim());
}

async function resetSequences() {
    await prisma.$executeRawUnsafe(`ALTER SEQUENCE users_id_seq RESTART WITH 1`);
    await prisma.$executeRawUnsafe(`ALTER SEQUENCE categories_id_seq RESTART WITH 1`);
    await prisma.$executeRawUnsafe(`ALTER SEQUENCE events_id_seq RESTART WITH 1`);
    await prisma.$executeRawUnsafe(`ALTER SEQUENCE comments_id_seq RESTART WITH 1`);
    await prisma.$executeRawUnsafe(`ALTER SEQUENCE roles_id_seq RESTART WITH 1`);
    await prisma.$executeRawUnsafe(`ALTER SEQUENCE permissions_id_seq RESTART WITH 1`);
    await prisma.$executeRawUnsafe(`ALTER SEQUENCE action_logs_id_seq RESTART WITH 1`);
    await prisma.$executeRawUnsafe(`ALTER SEQUENCE suspicious_users_id_seq RESTART WITH 1`);
}

async function fixSequencesAfterSeed() {
    await prisma.$executeRawUnsafe(`SELECT setval('users_id_seq', 2, true)`);
    await prisma.$executeRawUnsafe(`SELECT setval('events_id_seq', 25, true)`);
    await prisma.$executeRawUnsafe(`SELECT setval('roles_id_seq', 2, true)`);
    await prisma.$executeRawUnsafe(
        `SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories), true)`
    );
    await prisma.$executeRawUnsafe(
        `SELECT setval('permissions_id_seq', (SELECT MAX(id) FROM permissions), true)`
    );
    await prisma.$executeRawUnsafe(
        `SELECT setval('comments_id_seq', COALESCE((SELECT MAX(id) FROM comments), 1), true)`
    );
}

async function main() {
    await prisma.comment.deleteMany();
    await prisma.event.deleteMany();
    await prisma.category.deleteMany();

    await prisma.actionLog.deleteMany();
    await prisma.suspiciousUser.deleteMany();

    await prisma.userRole.deleteMany();
    await prisma.rolePermission.deleteMany();
    await prisma.permission.deleteMany();
    await prisma.appRole.deleteMany();

    await prisma.user.deleteMany();

    await resetSequences();

    const adminPassword = await bcrypt.hash("admin123", 10);
    const userPassword = await bcrypt.hash("user123", 10);

    const admin = await prisma.user.create({
        data: {
            id: 1,
            name: "Admin",
            email: "admin@test.com",
            passwordHash: adminPassword,
            role: Role.ADMIN,
        },
    });

    const regularUser = await prisma.user.create({
        data: {
            id: 2,
            name: "Regular User",
            email: "user@test.com",
            passwordHash: userPassword,
            role: Role.USER,
        },
    });

    const adminRole = await prisma.appRole.create({
        data: {
            name: "ADMIN",
            description: "Administrator with full permissions",
        },
    });

    const userRole = await prisma.appRole.create({
        data: {
            name: "USER",
            description: "Normal user with restricted permissions",
        },
    });

    const createdPermissions = await Promise.all(
        permissionNames.map((permissionName) =>
            prisma.permission.create({
                data: {
                    name: permissionName,
                    description: `Allows ${permissionName}`,
                },
            })
        )
    );

    const permissionByName = new Map(
        createdPermissions.map((permission) => [permission.name, permission])
    );

    await prisma.userRole.createMany({
        data: [
            {
                userId: admin.id,
                roleId: adminRole.id,
            },
            {
                userId: regularUser.id,
                roleId: userRole.id,
            },
        ],
    });

    await prisma.rolePermission.createMany({
        data: [
            ...adminPermissions.map((permissionName) => ({
                roleId: adminRole.id,
                permissionId: permissionByName.get(permissionName)!.id,
            })),

            ...userPermissions.map((permissionName) => ({
                roleId: userRole.id,
                permissionId: permissionByName.get(permissionName)!.id,
            })),
        ],
    });

    for (const event of initialEvents) {
        const category = await prisma.category.upsert({
            where: {
                name: event.category,
            },
            update: {},
            create: {
                name: event.category,
                description: `${event.category} events`,
            },
        });

        await prisma.event.create({
            data: {
                id: event.id,
                title: event.title,
                description: event.description,
                date: parseDate(event.date),
                location: event.location,
                price: parsePrice(event.price),
                imageUrl: event.imageUrl,
                categoryId: category.id,
                createdById: admin.id,
            },
        });
    }

    await prisma.comment.createMany({
        data: [
            {
                eventId: 1,
                userId: regularUser.id,
                content: "This sounds amazing, I would love to attend!",
            },
            {
                eventId: 1,
                userId: regularUser.id,
                content: "Jazz In The Park is always a great experience.",
            },
            {
                eventId: 2,
                userId: regularUser.id,
                content: "Untold is definitely one of the biggest events of the year.",
            },
            {
                eventId: 2,
                userId: regularUser.id,
                content: "The lineup is usually incredible!",
            },
            {
                eventId: 3,
                userId: regularUser.id,
                content: "The Art Expo looks very interesting.",
            },
            {
                eventId: 4,
                userId: regularUser.id,
                content: "This coding workshop would be useful for beginners.",
            },
            {
                eventId: 4,
                userId: regularUser.id,
                content: "I hope they include some TypeScript exercises.",
            },
            {
                eventId: 5,
                userId: regularUser.id,
                content: "A sports festival in Central Park sounds fun.",
            },
            {
                eventId: 6,
                userId: regularUser.id,
                content: "Great opportunity for startups to meet investors.",
            },
        ],
    });

    await fixSequencesAfterSeed();

    console.log("Database seeded with initial memory events and comments successfully.");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });