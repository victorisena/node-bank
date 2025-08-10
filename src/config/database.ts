import { PrismaClient } from "@prisma/client";

export class PrismaDatabaseConnection {
    private client: PrismaClient
    private connected: boolean
    private message: string

    constructor() {
        this.client = new PrismaClient()
        this.connected = false
        this.message = ""
    }

    get clientInstance(): PrismaClient {
        return this.client;
    }

    get messageText(): string {
        return this.message;
    }

    get isConnected(): boolean {
        return this.connected;
    }

    async connect(): Promise<void> {
        try {
            await this.client.$connect()
            this.connected = true
            this.message = ""
        } catch (error) {
            this.connected = false
            this.message = `Error connecting to database: ${error}`;
            console.error(error)
        }
    }

    async disconnect(): Promise<void> {
        try {
            await this.client.$disconnect()
            this.connected = false
        } catch (error) {
            this.message = `Error in disconnect database. Detail: ${error}`
            console.error(error)
        }
    }

}