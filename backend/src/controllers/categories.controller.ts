import { Request, Response } from "express";
import { prisma } from "../db/prisma";

export const getAllCategories = async (_req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: {
                name: "asc",
            },
        });

        return res.json(categories);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to get categories.",
            error,
        });
    }
};

export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                events: true,
            },
        });

        if (!category) {
            return res.status(404).json({ message: "Category not found." });
        }

        return res.json(category);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to get category.",
            error,
        });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;

        const category = await prisma.category.create({
            data: {
                name,
                description,
            },
        });

        return res.status(201).json(category);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create category.",
            error,
        });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { name, description } = req.body;

        const category = await prisma.category.update({
            where: { id },
            data: {
                name,
                description,
            },
        });

        return res.json(category);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update category.",
            error,
        });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        await prisma.category.delete({
            where: { id },
        });

        return res.json({
            message: "Category deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete category.",
            error,
        });
    }
};