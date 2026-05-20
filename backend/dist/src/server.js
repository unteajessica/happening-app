"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const https_1 = __importDefault(require("https"));
const app_1 = __importDefault(require("./app"));
const socket_1 = require("./socket");
const registerGraphQL_1 = require("./graphql/registerGraphQL");
const PORT = 3000;
async function startServer() {
    await (0, registerGraphQL_1.registerGraphQL)(app_1.default);
    const keyPath = path_1.default.join(__dirname, "../../certs/happening-key.pem");
    const certPath = path_1.default.join(__dirname, "../../certs/happening-cert.pem");
    const httpsOptions = {
        key: fs_1.default.readFileSync(keyPath),
        cert: fs_1.default.readFileSync(certPath),
    };
    const server = https_1.default.createServer(httpsOptions, app_1.default);
    (0, socket_1.initSocket)(server);
    server.listen(PORT, "0.0.0.0", () => {
        console.log(`HTTPS server is running on https://localhost:${PORT}`);
        console.log(`REST available on /events, /comments, /stats, /generator`);
        console.log(`GraphQL available at https://localhost:${PORT}/graphql`);
    });
}
startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
