import { Decimal } from "@prisma/client/runtime/library";

export interface IClient {
    id?: string;
    name: string;
    email: string;
    password: string;
    saldo: Decimal;
}