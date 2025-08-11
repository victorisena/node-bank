import { body, param, check, validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt-utils";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.get('Authorization')
        if (!authHeader) {
            return res.status(401).json({ message: "Unauthorized, token missing." })
        }

        const parts = authHeader.split(' ')
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ message: "Unauthorized, malformed token." })
        }

        const token = parts[1]

        const isValid = verifyToken(token)
        if(!isValid)
            return res.status(403).json({ message: "Unauthorized, token invalid." })

        next();
    } catch (error) {
        res.status(500).json({ message: "Failed to authenticate", error });
    }
}