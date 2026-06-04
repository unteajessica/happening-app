import "dotenv/config";
import fs from "fs";
import path from "path";
import http from "http";
import https from "https";
import app from "./app";
import { initSocket } from "./socket";
import { registerGraphQL } from "./graphql/registerGraphQL";
import { connectMongo } from "./db/mongo";

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === "production";

async function startServer() {
    await connectMongo();
    await registerGraphQL(app);

    const server = isProduction
        ? http.createServer(app)
        : https.createServer(
              {
                  key: fs.readFileSync(
                      path.join(__dirname, "../../certs/happening-key.pem")
                  ),
                  cert: fs.readFileSync(
                      path.join(__dirname, "../../certs/happening-cert.pem")
                  ),
              },
              app
          );

    initSocket(server);

    server.listen(PORT, "0.0.0.0", () => {
        const protocol = isProduction ? "http" : "https";

        console.log(
            `${isProduction ? "Production" : "Development"} server is running on ${protocol}://localhost:${PORT}`
        );
        console.log("REST available on /events, /comments, /stats, /generator");
        console.log(
            `GraphQL available at ${protocol}://localhost:${PORT}/graphql`
        );
    });
}

startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});