import type { IClient } from "../interfaces/business/client-interface";
import type { IClientService } from "../interfaces/http/client-service-interface";
import ClientRepository from "../repositories/client-repository";

class ClientService implements IClientService {
    private repository: ClientRepository;

    constructor(repository?: ClientRepository) {
        this.repository = repository || new ClientRepository();
    }

    async getClients(): Promise<IClient[]> {
        const data = await this.repository.get();
        return data;
    }

    async getClientById(id: string): Promise<IClient | null> {
        const data = await this.repository.findById(id);
        return data;
    }

    async getClientByEmail(email: string): Promise<IClient | null> {
        const data = await this.repository.findByEmail(email);
        return data;
    }

    async createClient(data: IClient): Promise<IClient> {
        const item = await this.repository.create(data);
        return item;
    }

    async updateClient(id: string, data: Partial<IClient>): Promise<IClient | null> {
        const item = await this.repository.update(id, data);
        return item;
    }

    async deleteClient(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}

export default ClientService