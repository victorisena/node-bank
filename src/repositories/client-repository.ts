import type { IClient } from "../interfaces/business/client-interface";
import prisma from "../config/database";
import ErrorHandling from "../utils/error-handling"


class ClientRepository {
    private errorHandling = new ErrorHandling()

    async get(): Promise<IClient[]> {
        const clients = await prisma.client.findMany();
        return clients;
    }

    async findById(id: string): Promise<IClient | null> {
        const client = await prisma.client.findUnique({
            where: { id }
        });
        return client;
    }

    async findByEmail(email: string): Promise<IClient | null> {
        const client = await prisma.client.findUnique({
            where: { email }
        });
        return client;
    }

    async create(data: IClient): Promise<IClient> {
        const newClient = await prisma.client.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
                saldo: data.saldo
            }
        });
        return newClient;
    }

    async update(id: string, data: Partial<IClient>): Promise<IClient | null> {
        try {
            const updatedClient = await prisma.client.update({
                where: { id },
                data
            });
            return updatedClient;
        } catch (error : unknown) {
            if (this.errorHandling.isPrismaError(error) && error.code === "P2025") { // registro nao encontrado
                return null;
            }
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await prisma.client.delete({
                where: { id }
            });
        } catch (error: unknown) {
            if (this.errorHandling.isPrismaError(error) && error.code === "P2025") {
                return;
            }
            throw error;
        }
    }
}

export default ClientRepository