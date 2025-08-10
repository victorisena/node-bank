import express, {type Request, type Response} from "express"
import type { healthcheck } from "src/interfaces/http/healthcheck"

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Healthcheck
 *   description: Endpoints relacionados a saude da aplicacao
 */

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Healthcheck
 *     summary: Retorna se a aplicação está ativa
 *     responses:
 *       200:
 *         description: Rota de Healthcheck
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uptime:
 *                   type: string
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: string
 */
router.get("/", (req: Request, res: Response) => {
    const healthcheck: healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now()
    }

    try {
        res.status(200).send(healthcheck)
    } catch (error) {
        console.log(error)
        res.status(503).send()
    }
})

export const indexRoute = router