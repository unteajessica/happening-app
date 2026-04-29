import { Request, Response } from "express";
import { events } from "../data/events.memory";

export const getCategoryStats = (_req: Request, res: Response) => {
    const categoryMap = events.reduce((acc, event) => {
        acc[event.category] = (acc[event.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const result = Object.entries(categoryMap).map(([category, count]) => ({
        category,
        count
    }));

    res.json(result);
};

export const getPriceStats = (_req: Request, res: Response) => {
    const freeCount = events.filter((event) => event.price === "Free").length;
    const paidCount = events.length - freeCount;

    res.json([
        { name: "Paid", value: paidCount },
        { name: "Free", value: freeCount }
    ]);
};