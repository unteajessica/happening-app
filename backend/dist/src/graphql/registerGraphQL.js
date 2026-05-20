"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGraphQL = registerGraphQL;
const server_1 = require("@apollo/server");
const express5_1 = require("@as-integrations/express5");
const schema_1 = require("./schema");
const resolvers_1 = require("./resolvers");
async function registerGraphQL(app) {
    const server = new server_1.ApolloServer({
        typeDefs: schema_1.typeDefs,
        resolvers: resolvers_1.resolvers,
    });
    await server.start();
    app.use("/graphql", (0, express5_1.expressMiddleware)(server));
}
