export const typeDefs = `#graphql
    type Event {
        id: Int!
        title: String!
        category: String!
        date: String!
        location: String!
        price: String!
        description: String!
        imageUrl: String!
        comments: [Comment!]!
        commentsCount: Int!
    }

    type Comment {
        id: Int!
        eventId: Int!
        author: String!
        message: String!
        createdAt: String!
        event: Event!
    }

    type EventsPage {
        items: [Event!]!
        page: Int!
        limit: Int!
        total: Int!
        totalPages: Int!
    }

    type CategoryStat {
        category: String!
        count: Int!
    }

    type PricingStat {
        name: String!
        value: Int!
    }

    type CommentStat {
        eventId: Int!
        eventTitle: String!
        commentCount: Int!
    }

    type OperationResult {
        message: String!
    }

    type GeneratorStatus {
        isRunning: Boolean!
    }

    input EventInput {
        title: String!
        category: String!
        date: String!
        location: String!
        price: String!
        description: String!
        imageUrl: String!
    }

    input CommentInput {
        eventId: Int!
        author: String!
        message: String!
    }

    type Query {
        events(page: Int, limit: Int): EventsPage!
        event(id: Int!): Event!
        comments(eventId: Int!): [Comment!]!
        categoryStats: [CategoryStat!]!
        pricingStats: [PricingStat!]!
        commentStats: [CommentStat!]!
        generatorStatus: GeneratorStatus!
    }

    type Mutation {
        createEvent(input: EventInput!): Event!
        updateEvent(id: Int!, input: EventInput!): Event!
        deleteEvent(id: Int!): OperationResult!

        createComment(input: CommentInput!): Comment!
        deleteComment(commentId: Int!): OperationResult!

        startGenerator: OperationResult!
        stopGenerator: OperationResult!
    }
`;