import type { Response } from "express"

interface CustomError {
    message: string
    statusCode?: number
}

class ErrorHandling {
    handleError(error: unknown, res: Response): Response {
        if (error instanceof Error) {
            return res.status(500).json({ message: "Internal Server Error", error: error.message })
        }

        if (typeof error === "object" && error !== null && "message" in error) {
            const customError = error as CustomError
            return res.status(customError.statusCode || 500).json({ message: customError.message })
        }

        return res.status(500).json({ message: "Unknown Error" })
    }

    isPrismaError(error: unknown): error is { code?: string } {
        return typeof error === "object" && error !== null && "code" in error;
    }
}

export default ErrorHandling