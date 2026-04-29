import type { CommentItem } from "./comment";

const initialComments: CommentItem[] = [
    {
        id: 1,
        eventId: 1,
        author: "Jessica",
        message: "This sounds amazing, I’d love to go.",
        createdAt: "2026-04-01T10:00:00.000Z",
    },
    {
        id: 2,
        eventId: 1,
        author: "Andrei",
        message: "Went last year and it was great.",
        createdAt: "2026-04-02T14:30:00.000Z",
    },
    {
        id: 3,
        eventId: 2,
        author: "Maria",
        message: "The lineup looks really strong this year.",
        createdAt: "2026-04-03T09:15:00.000Z",
    },
    {
        id: 4,
        eventId: 5,
        author: "Alex",
        message: "Perfect for families.",
        createdAt: "2026-04-04T18:45:00.000Z",
    },
];

export let comments: CommentItem[] = [...initialComments];

export const getNextCommentId = (): number => {
    return comments.length > 0 ? Math.max(...comments.map((c) => c.id)) + 1 : 1;
};

export const replaceComments = (updatedComments: CommentItem[]): void => {
    comments = updatedComments;
};

export const resetComments = (): void => {
    comments = [...initialComments];
};