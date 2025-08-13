import jwt, { SignOptions } from "jsonwebtoken";
import { StringValue } from "ms";

const JWT_SECRET = process.env.JWT_SECRET || "somesupersecret";

export function generateToken(payload: object, expiresIn: StringValue | number = "1h"): string {
    const options : SignOptions = { expiresIn }
    return jwt.sign(
        payload,
        JWT_SECRET,
        options
    )
}

export function verifyToken(token: string): any {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}