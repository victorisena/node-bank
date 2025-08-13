import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PrismaDatabaseConnection {
    private connected: boolean
    private message: string

    constructor() {
        this.connected = false
        this.message = ""
    }

    get messageText(): string {
        return this.message;
    }

    get isConnected(): boolean {
        return this.connected;
    }

    async connect(): Promise<void> {
        try {
            await prisma.$connect()
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
            await prisma.$disconnect()
            this.connected = false
        } catch (error) {
            this.message = `Error in disconnect database. Detail: ${error}`
            console.error(error)
        }
    }

}

export default prisma;