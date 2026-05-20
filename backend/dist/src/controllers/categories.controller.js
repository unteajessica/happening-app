"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getAllCategories = void 0;
const prisma_1 = require("../db/prisma");
const getAllCategories = async (_req, res) => {
    try {
        const categories = await prisma_1.prisma.category.findMany({
            orderBy: {
                name: "asc",
            },
        });
        return res.json(categories);
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to get categories.",
            error,
        });
    }
};
exports.getAllCategories = getAllCategories;
const getCategoryById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const category = await prisma_1.prisma.category.findUnique({
            where: { id },
            include: {
                events: true,
            },
        });
        if (!category) {
            return res.status(404).json({ message: "Category not found." });
        }
        return res.json(category);
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to get category.",
            error,
        });
    }
};
exports.getCategoryById = getCategoryById;
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await prisma_1.prisma.category.create({
            data: {
                name,
                description,
            },
        });
        return res.status(201).json(category);
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to create category.",
            error,
        });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, description } = req.body;
        const category = await prisma_1.prisma.category.update({
            where: { id },
            data: {
                name,
                description,
            },
        });
        return res.json(category);
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to update category.",
            error,
        });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await prisma_1.prisma.category.delete({
            where: { id },
        });
        return res.json({
            message: "Category deleted successfully.",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to delete category.",
            error,
        });
    }
};
exports.deleteCategory = deleteCategory;
