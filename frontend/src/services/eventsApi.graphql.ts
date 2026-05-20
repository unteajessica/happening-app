import type { EventItem } from "../types/event";
import type { CommentItem, CommentInput } from "../types/comment";

const GRAPHQL_URL =  import.meta.env.VITE_API_URL || "http://localhost:3000/graphql";

type GraphQLResponse<T> = {
    data?: T;
    errors?: { message: string }[];
};

export type EventsPageResponse = {
    items: EventItem[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

export type CommentStatsResponse = {
    totalComments: number;
    commentsByEvent: {
        eventId: number;
        eventTitle: string;
        commentCount: number;
    }[];
    mostCommentedEvents: {
        eventId: number;
        eventTitle: string;
        category: string;
        commentCount: number;
    }[];
    commentsByUser: {
        userId: number;
        userName: string;
        commentCount: number;
    }[];
};

async function graphQLRequest<T>(
    query: string,
    variables?: Record<string, unknown>
): Promise<T> {
    const response = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    });

    const json = (await response.json().catch(() => null)) as GraphQLResponse<T> | null;

    if (!response.ok) {
        throw new Error("Failed to reach GraphQL endpoint.");
    }

    if (json?.errors && json.errors.length > 0) {
        throw new Error(json.errors[0].message);
    }

    if (!json?.data) {
        throw new Error("No data returned from GraphQL.");
    }

    return json.data;
}

export async function fetchEvents(): Promise<EventItem[]> {
    const data = await fetchEventsPage(1, 100);
    return data.items;
}

export async function fetchEventById(id: number): Promise<EventItem> {
    const query = `
        query GetEventById($id: Int!) {
            event(id: $id) {
                id
                title
                category
                date
                location
                price
                description
                imageUrl
                commentsCount
            }
        }
    `;

    const data = await graphQLRequest<{ event: EventItem }>(query, { id });
    return data.event;
}

export async function createEventRequest(
    event: Omit<EventItem, "id">
): Promise<EventItem> {
    const mutation = `
        mutation CreateEvent($input: EventInput!) {
            createEvent(input: $input) {
                id
                title
                category
                date
                location
                price
                description
                imageUrl
                commentsCount
            }
        }
    `;

    const data = await graphQLRequest<{ createEvent: EventItem }>(mutation, {
        input: event,
    });

    return data.createEvent;
}

export async function updateEventRequest(
    id: number,
    event: Omit<EventItem, "id">
): Promise<EventItem> {
    const mutation = `
        mutation UpdateEvent($id: Int!, $input: EventInput!) {
            updateEvent(id: $id, input: $input) {
                id
                title
                category
                date
                location
                price
                description
                imageUrl
                commentsCount
            }
        }
    `;

    const data = await graphQLRequest<{ updateEvent: EventItem }>(mutation, {
        id,
        input: event,
    });

    return data.updateEvent;
}

export async function deleteEventRequest(id: number): Promise<void> {
    const mutation = `
        mutation DeleteEvent($id: Int!) {
            deleteEvent(id: $id) {
                message
            }
        }
    `;

    await graphQLRequest(mutation, { id });
}

export async function fetchCommentsByEventId(eventId: number): Promise<CommentItem[]> {
    const query = `
        query GetComments($eventId: Int!) {
            comments(eventId: $eventId) {
                id
                eventId
                author
                message
                createdAt
            }
        }
    `;

    const data = await graphQLRequest<{ comments: CommentItem[] }>(query, {
        eventId,
    });

    return data.comments;
}

export async function createCommentRequest(
    comment: CommentInput
): Promise<CommentItem> {
    const mutation = `
        mutation CreateComment($input: CommentInput!) {
            createComment(input: $input) {
                id
                eventId
                author
                message
                createdAt
            }
        }
    `;

    const data = await graphQLRequest<{ createComment: CommentItem }>(mutation, {
        input: comment,
    });

    return data.createComment;
}

export async function deleteCommentRequest(commentId: number): Promise<void> {
    const mutation = `
        mutation DeleteComment($commentId: Int!) {
            deleteComment(commentId: $commentId) {
                message
            }
        }
    `;

    await graphQLRequest(mutation, { commentId });
}

export async function fetchCommentStats(): Promise<CommentStatsResponse> {
    const query = `
        query GetCommentStats {
            commentStats {
                totalComments

                commentsByEvent {
                    eventId
                    eventTitle
                    commentCount
                }

                mostCommentedEvents {
                    eventId
                    eventTitle
                    category
                    commentCount
                }

                commentsByUser {
                    userId
                    userName
                    commentCount
                }
            }
        }
    `;

    const data = await graphQLRequest<{
        commentStats: CommentStatsResponse;
    }>(query);

    return data.commentStats;
}

export async function fetchCategoryStats(): Promise<
    { category: string; count: number }[]
> {
    const query = `
        query GetCategoryStats {
            categoryStats {
                category
                count
            }
        }
    `;

    const data = await graphQLRequest<{
        categoryStats: { category: string; count: number }[];
    }>(query);

    return data.categoryStats;
}

export async function fetchPriceStats(): Promise<
    { name: string; value: number }[]
> {
    const query = `
        query GetPricingStats {
            pricingStats {
                name
                value
            }
        }
    `;

    const data = await graphQLRequest<{
        pricingStats: { name: string; value: number }[];
    }>(query);

    return data.pricingStats;
}

export async function startGeneratorRequest(): Promise<{ message: string }> {
    const mutation = `
        mutation StartGenerator {
            startGenerator {
                message
            }
        }
    `;

    const data = await graphQLRequest<{ startGenerator: { message: string } }>(
        mutation
    );

    return data.startGenerator;
}

export async function stopGeneratorRequest(): Promise<{ message: string }> {
    const mutation = `
        mutation StopGenerator {
            stopGenerator {
                message
            }
        }
    `;

    const data = await graphQLRequest<{ stopGenerator: { message: string } }>(
        mutation
    );

    return data.stopGenerator;
}

export async function fetchGeneratorStatus(): Promise<{ isRunning: boolean }> {
    const query = `
        query GeneratorStatus {
            generatorStatus {
                isRunning
            }
        }
    `;

    const data = await graphQLRequest<{
        generatorStatus: { isRunning: boolean };
    }>(query);

    return data.generatorStatus;
}

export async function fetchEventsPage(
    page: number,
    limit: number
): Promise<EventsPageResponse> {
    const query = `
        query GetEvents($page: Int, $limit: Int) {
            events(page: $page, limit: $limit) {
                items {
                    id
                    title
                    category
                    date
                    location
                    price
                    description
                    imageUrl
                    commentsCount
                }
                page
                limit
                total
                totalPages
            }
        }
    `;

    const data = await graphQLRequest<{
        events: EventsPageResponse;
    }>(query, { page, limit });

    return data.events;
}