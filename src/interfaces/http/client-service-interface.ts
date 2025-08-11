import type { IClient } from "../business/client-interface"

export interface IClientService {
    getClients(): Promise<IClient[]>
    getClientById(id: string): Promise<IClient | null>
    getClientByEmail(email: string): Promise<IClient | null>
    createClient(data : IClient): Promise<IClient>
    updateClient(id: string, data : IClient): Promise<IClient | null>
    deleteClient(id: string): Promise<void>
}