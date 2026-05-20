import { execSync } from "child_process";
import { prisma } from "../src/db/prisma";

beforeAll(() => {
    execSync("npx prisma db seed", {
        stdio: "inherit",
    });
});

afterAll(async () => {
    await prisma.$disconnect();
});