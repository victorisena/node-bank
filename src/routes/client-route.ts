import express, {type Request, type Response, type NextFunction} from "express"
import ClientController from "../controllers/client-controller"
import { authMiddleware } from "../middlewares/auth-middleware"
import { validateRequest, validatePassword, validateName, validateEmail } from "../middlewares/validation-middleware"

const router = express.Router()
const clientController = new ClientController()


/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Endpoints relacionados à gestão de clientes
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Client:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: João da Silva
 *         email:
 *           type: string
 *           example: joao.silva@example.com
 *         saldo:
 *           type: string
 *           example: "0.00"
 */

/**
 * @swagger
 * /clientes:
 *   get:
 *     tags:
 *       - Clients
 *     summary: Retorna a lista de clientes cadastrados
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Client'
 *       401:
 *         description: Não autorizado - token inválido ou ausente
 *       500:
 *         description: Erro interno no servidor
 */
router.get("/", authMiddleware, async (req: Request, res: Response) => {
    await clientController.getClients(req, res)
})

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     tags:
 *       - Clients
 *     summary: Retorna um cliente específico pelo ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do cliente a ser buscado
 *         example: "123"
 *     responses:
 *       200:
 *         description: Cliente retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Client'
 *       204:
 *         description: Cliente não encontrado
 *       400:
 *         description: Parâmetro 'id' inválido ou ausente
 *       401:
 *         description: Não autorizado - token inválido ou ausente
 *       500:
 *         description: Erro interno no servidor
 */
router.get("/:id", authMiddleware, async (req: Request, res: Response) => {
    await clientController.getClientById(req, res)
})

/**
 * @swagger
 * /clientes:
 *   post:
 *     tags:
 *       - Clients
 *     summary: Cria um novo cliente
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: João da Silva
 *               email:
 *                 type: string
 *                 example: joao.silva@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Senha@123
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Client'
 *       400:
 *         description: Erro de validação nos campos enviados
 *       401:
 *         description: Não autorizado - token inválido ou ausente
 *       500:
 *         description: Erro interno no servidor
 */
router.post("/", validateName, validatePassword, validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
        await clientController.createClient(req, res)       
    }
)

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     tags:
 *       - Clients
 *     summary: Atualiza um cliente existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do cliente a ser atualizado
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: João da Silva
 *               email:
 *                 type: string
 *                 example: joao.silva@example.com
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Client'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Cliente não encontrado
 *       401:
 *         description: Não autorizado - token inválido ou ausente
 *       500:
 *         description: Erro interno no servidor
 */
router.put("/:id", authMiddleware, validateName, validateEmail, validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
        await clientController.updateClient(req, res)       
    }
)

/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     tags:
 *       - Clients
 *     summary: Deleta um cliente pelo ID
 *     description: Remove permanentemente um cliente do sistema com base no ID fornecido.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do cliente a ser deletado
 *     responses:
 *       204:
 *         description: Cliente deletado com sucesso (sem conteúdo de retorno)
 *       400:
 *         description: ID inválido fornecido no path
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid 'id' in headers
 *       401:
 *         description: Não autorizado - token inválido ou ausente
 *       500:
 *         description: Erro interno no servidor
 */
router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
    await clientController.deleteClient(req, res)
})

/**
 * @swagger
 * /clientes/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Realiza login do usuário e retorna um token JWT
 *     requestBody:
 *       description: Credenciais para login
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: mypassword123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso, token JWT retornado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Falha na autenticação - senha incorreta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Authentication failed.
 *       422:
 *         description: Usuário com email não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: A user with this email couldn't be found.
 *       500:
 *         description: Erro interno no servidor
 */
router.post("/login", validateEmail, validatePassword, validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
        await clientController.login(req, res)       
    }
)

export const clientRoute = router