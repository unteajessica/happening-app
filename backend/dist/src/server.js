"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const app_1 = __importDefault(require("./app"));
const socket_1 = require("./socket");
const registerGraphQL_1 = require("./graphql/registerGraphQL");
const mongo_1 = require("./db/mongo");
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === "production";
async function startServer() {
    await (0, mongo_1.connectMongo)();
    await (0, registerGraphQL_1.registerGraphQL)(app_1.default);
    const server = isProduction
        ? http_1.default.createServer(app_1.default)
        : https_1.default.createServer({
            key: fs_1.default.readFileSync(path_1.default.join(__dirname, "../../certs/happening-key.pem")),
            cert: fs_1.default.readFileSync(path_1.default.join(__dirname, "../../certs/happening-cert.pem")),
        }, app_1.default);
    (0, socket_1.initSocket)(server);
    server.listen(PORT, "0.0.0.0", () => {
        const protocol = isProduction ? "http" : "https";
        console.log(`${isProduction ? "Production" : "Development"} server is running on ${protocol}://localhost:${PORT}`);
        console.log("REST available on /events, /comments, /stats, /generator");
        console.log(`GraphQL available at ${protocol}://localhost:${PORT}/graphql`);
    });
}
startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
