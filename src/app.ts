import express, { type Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { swaggerUi, swaggerDocs } from "./doc/swagger";
import { PrismaDatabaseConnection } from "./config/database";
import { indexRoute } from "./routes/index-route";
import { clientRoute } from "./routes/client-route";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

const dbConnection = new PrismaDatabaseConnection();

app.use(cors());
app.use(express.json());

//routes
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/", indexRoute);
app.use("/clientes", clientRoute);

const startServer = async () => {
    try {
        await dbConnection.connect();
        if (dbConnection.isConnected) {
            console.log("PostgreSQL (Prisma) is connected!");
        } else {
            console.log("PostgreSQL (Prisma) is NOT connected!");
            process.exit(1);
        }

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start the server:", error);
        process.exit(1);
    }
};

const shutdown = async () => {
    try {
        console.log("Shutting down server...");
        await dbConnection.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Error during shutdown:", error);
        process.exit(1);
    }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startServer();