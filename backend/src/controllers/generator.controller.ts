import { Request, Response } from "express";
import {
    startGenerator,
    stopGenerator,
    getGeneratorStatus,
} from "../services/generator.service";

export function startGeneratorController(_req: Request, res: Response) {
    const result = startGenerator();
    res.status(200).json(result);
}

export function stopGeneratorController(_req: Request, res: Response) {
    const result = stopGenerator();
    res.status(200).json(result);
}

export function getGeneratorStatusController(_req: Request, res: Response) {
    const result = getGeneratorStatus();
    res.status(200).json(result);
}