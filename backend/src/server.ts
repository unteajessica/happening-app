import "dotenv/config";
import fs from "fs";
import path from "path";
import https from "https";
import app from "./app";
import { initSocket } from "./socket";
import { registerGraphQL } from "./graphql/registerGraphQL";

const PORT = 3000;

async function startServer() {
    await registerGraphQL(app);

    const keyPath = path.join(__dirname, "../../certs/happening-key.pem");
    const certPath = path.join(__dirname, "../../certs/happening-cert.pem");

    const httpsOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
    };

    const server = https.createServer(httpsOptions, app);

    initSocket(server);

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