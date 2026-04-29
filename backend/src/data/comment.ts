export type CommentItem = {
    id: number;
    eventId: number;
    author: string;
    message: string;
    createdAt: string;
};

export type CommentInput = {
    eventId: number;
    author: string;
    message: string;
};