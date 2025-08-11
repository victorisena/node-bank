import bcrypt from "bcrypt";
import type { Request, Response } from "express"
import type { IClientController } from "../interfaces/http/client-controller-interface"
import ClientService from "../services/client-service"
import ErrorHandling from "../utils/error-handling"
import { Decimal } from "@prisma/client/runtime/library"
import { generateToken } from "../utils/jwt-utils";

class ClientController implements IClientController {
    private service = new ClientService()
    private errorHandling = new ErrorHandling()

    async login (req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body

            const data = await this.service.getClientByEmail(email)
            if (!data)
                return res.status(422).json({ message: "A user with this email couldn't be found." });

            const isEqual = bcrypt.compare(password, data.password);
            if(!isEqual)
                return res.status(401).json({ message: "Authentication failed." });

            const payload = {
                id: data.id
            }

            const token : string = generateToken(payload)

            return res.status(200).json({ token })
        } catch (error) {
            return this.errorHandling.handleError(error, res)
        }
    }

    async getClients(req: Request, res: Response): Promise<Response> {
        try {
            const data = await this.service.getClients()
            return res.status(200).json({ status: "success", data })
        } catch (error) {
            return this.errorHandling.handleError(error, res)
        }
    }

    async getClientById(req: Request, res: Response): Promise<Response> {
        try {
            const id = req.params.id
            if (typeof id !== 'string') {
                return res.status(400).json({ message: "Invalid or missing 'id' in headers" });
            }

            const data = await this.service.getClientById(id)
            if (!data)
                return res.status(204).send()

            return res.status(200).json({ status: "success", data })
        } catch (error) {
            return this.errorHandling.handleError(error, res)
        }
    }

    async getClientByEmail(req: Request, res: Response): Promise<Response> {
        try {
            const email = req.body.email

            const data = await this.service.getClientByEmail(email)
            if (!data)
                return res.status(204).send()

            return res.status(200).json({ status: "success", data })
        } catch (error) {
            return this.errorHandling.handleError(error, res)
        }
    }

    async createClient(req: Request, res: Response): Promise<Response> {
        try {
            const { name, email, password } = req.body

            const client = await this.service.getClientByEmail(email)
            if (client)
                return res.status(409).json({ message: "A user with this email already exists." });

            const hashedPassword = await bcrypt.hash(password, 12);

            const data = {
                name,
                email,
                password: hashedPassword,
                saldo: new Decimal(0)
            }

            const created = await this.service.createClient(data)
            return res.status(201).json({ status: "success", data: created })
        } catch (error) {
            return this.errorHandling.handleError(error, res)
        }
    }

    async updateClient(req: Request, res: Response): Promise<Response> {
        try {
            const id = req.params.id
            if (typeof id !== 'string')
                return res.status(400).json({ message: "Invalid 'id' in path" })

            const { name, email } = req.body
            
            const client = await this.service.getClientByEmail(email)
            if (client && client.id !== id)
                return res.status(409).json({ message: "A user with this email already exists." });

            const data = {
                name,
                email
            }

            const updated = await this.service.updateClient(id, data)
            if (!updated) {
                return res.status(404).json({ message: "Client not found" })
            }

            return res.status(200).json({ status: "success", data: updated })
        } catch (error) {
            return this.errorHandling.handleError(error, res)
        }
    }

    async deleteClient(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params
            if (typeof id !== 'string') {
                return res.status(400).json({ message: "Invalid 'id' in headers" });
            }

            await this.service.deleteClient(id)
            return res.status(204).send()
        } catch (error) {
            return this.errorHandling.handleError(error, res)
        }
    }

}

export default ClientController