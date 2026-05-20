"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const prisma_1 = require("../src/db/prisma");
beforeAll(() => {
    (0, child_process_1.execSync)("npx prisma db seed", {
        stdio: "inherit",
    });
});
afterAll(async () => {
    await prisma_1.prisma.$disconnect();
});
