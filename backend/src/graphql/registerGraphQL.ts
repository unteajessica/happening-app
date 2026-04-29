import type { Express } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

export async function registerGraphQL(app: Express) {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await server.start();

    app.use("/graphql", expressMiddleware(server));
}