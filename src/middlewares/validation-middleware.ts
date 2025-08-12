import { body, param, check, validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import ClientController from "../controllers/client-controller"


export function validateRequest(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return
    }
    next()
}

export const validatePassword = [
    check('password')
        .trim()
        .isLength({ min: 5 })
]

export const validateName = [
    check('name')
        .trim()
        .notEmpty()
]

export const validateEmail = [
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
]

export const validateValor = [
    body("valor")
        .exists().withMessage("O campo 'valor' é obrigatório.")
        .bail()
        .isFloat({ gt: 0 }).withMessage("O valor deve ser um número maior que zero.")
        .custom((value) => {
            if (!/^\d+(\.\d{1,2})?$/.test(value.toString())) {
                throw new Error("O valor deve ter no máximo 2 casas decimais.");
            }
            return true;
        })
]