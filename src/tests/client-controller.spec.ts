import ClientController from "../controllers/client-controller";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt-utils";
import { Decimal } from "@prisma/client/runtime/library";

jest.mock("../services/client-service");
jest.mock("bcrypt");
jest.mock("../utils/jwt-utils");
jest.mock("../utils/error-handling");

const MockedClientService = require("../services/client-service").default;
const MockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const MockedGenerateToken = generateToken as jest.MockedFunction<(payload: any) => string>;
const MockedErrorHandling = require("../utils/error-handling").default;

describe("ClientController", () => {
  let controller: ClientController;
  let serviceMock: jest.Mocked<any>;
  let errorHandlingMock: jest.Mocked<any>;

  beforeEach(() => {
    controller = new ClientController();
    serviceMock = controller["service"] = new MockedClientService();
    errorHandlingMock = controller["errorHandling"] = new MockedErrorHandling();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };


  test("login - email não encontrado", async () => {
    const req: any = { body: { email: "a@b.com", password: "plain" } };
    const res = mockResponse();

    serviceMock.getClientByEmail.mockResolvedValue(null);

    await controller.login(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({ message: "A user with this email couldn't be found." });
  });

  test("login - erro no try/catch chama handleError", async () => {
    const req: any = { body: { email: "a@b.com", password: "plain" } };
    const res = mockResponse();

    const error = new Error("fail");
    serviceMock.getClientByEmail.mockRejectedValue(error);

    await controller.login(req, res);

    expect(errorHandlingMock.handleError).toHaveBeenCalledWith(error, res);
  });

  test("getClients - sucesso", async () => {
    const req: any = {};
    const res = mockResponse();

    serviceMock.getClients.mockResolvedValue([{ id: "1" }]);

    await controller.getClients(req, res);

    expect(serviceMock.getClients).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: "success", data: [{ id: "1" }] });
  });

  test("getClientById - id inválido", async () => {
    const req: any = { params: { id: 123 } };
    const res = mockResponse();

    await controller.getClientById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid or missing 'id' in parameters" });
  });

  test("getClientById - cliente não encontrado", async () => {
    const req: any = { params: { id: "123" } };
    const res = mockResponse();

    serviceMock.getClientById.mockResolvedValue(null);

    await controller.getClientById(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  test("getClientById - cliente encontrado", async () => {
    const req: any = { params: { id: "123" } };
    const res = mockResponse();

    const client = { id: "123", name: "Teste" };
    serviceMock.getClientById.mockResolvedValue(client);

    await controller.getClientById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: "success", data: client });
  });

  test("createClient - já existe email", async () => {
    const req: any = { body: { name: "nome", email: "email", password: "pass" } };
    const res = mockResponse();

    serviceMock.getClientByEmail.mockResolvedValue({ id: "1" });

    await controller.createClient(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: "A user with this email already exists." })
  });

})