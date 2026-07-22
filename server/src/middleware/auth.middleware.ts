import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma.js";
import { verifyToken } from "../utils/jwt.js";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const decoded = verifyToken(token);
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId,
            },
        });

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        req.user = user;

        next();
    } catch {
        return res.status(401).json({
            message: "Invalid Token",
        });
    }
};