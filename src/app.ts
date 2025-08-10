import express, { type Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { swaggerUi, swaggerDocs } from "./doc/swagger";
import { indexRoute } from "./routes/index-route";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//routes
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/", indexRoute);

const startServer = async () => {
	try {
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
		process.exit(0);
	} catch (error) {
		console.error("Error during shutdown:", error);
		process.exit(1);
	}
};

startServer();