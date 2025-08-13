import type {Request, Response} from "express"

export interface IClientController {
    login(req: Request, res: Response): Promise<Response>
    getClients(req: Request, res: Response): Promise<Response>
    getClientById(req: Request, res: Response): Promise<Response>
    getClientByEmail(req: Request, res: Response): Promise<Response>
    createClient(req: Request, res: Response): Promise<Response>
    updateClient(req: Request, res: Response): Promise<Response>
    deleteClient(req: Request, res: Response): Promise<Response>
    depositar(req: Request, res: Response): Promise<Response>
    sacar(req: Request, res: Response): Promise<Response>
}