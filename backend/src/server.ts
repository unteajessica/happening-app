import http from "http";
import app from "./app";
import { initSocket } from "./socket";
import { registerGraphQL } from "./graphql/registerGraphQL";

const PORT = 3000;

async function startServer() {
    await registerGraphQL(app);

    const server = http.createServer(app);
    initSocket(server);

    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`REST available on /events, /comments, /stats, /generator`);
        console.log(`GraphQL available at http://localhost:${PORT}/graphql`);
    });
}

startServer();