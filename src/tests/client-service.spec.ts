import ClientService from "../services/client-service";
import ClientRepository from "../repositories/client-repository";
import { Decimal } from "@prisma/client/runtime/library";

jest.mock("../repositories/client-repository");

describe("ClientService", () => {
  let service: ClientService;
  let repositoryMock: jest.Mocked<ClientRepository>;

  beforeEach(() => {
    repositoryMock = new ClientRepository() as jest.Mocked<ClientRepository>;
    service = new ClientService(repositoryMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getClients deve retornar lista de clientes", async () => {
    const mockClients = [{ id: "1", name: "Test", email: "test@test.com", password: "$2b$12$cb/j/2CR0rmeDXo/ttg9iO7kS9wgifyTZ0kgsbJqz1LMtpFR42.Zi", saldo: Decimal("0") }];
    repositoryMock.get.mockResolvedValue(mockClients);

    const result = await service.getClients();

    expect(repositoryMock.get).toHaveBeenCalled();
    expect(result).toEqual(mockClients);
  });

  test("getClientById deve retornar cliente encontrado", async () => {
    const mockClient = { id: "1", name: "Test", email: "test@test.com", password: "$2b$12$cb/j/2CR0rmeDXo/ttg9iO7kS9wgifyTZ0kgsbJqz1LMtpFR42.Zi", saldo: Decimal("0") };
    repositoryMock.findById.mockResolvedValue(mockClient);

    const result = await service.getClientById("1");

    expect(repositoryMock.findById).toHaveBeenCalledWith("1");
    expect(result).toEqual(mockClient);
  });

  test("getClientById deve retornar null se não encontrar", async () => {
    repositoryMock.findById.mockResolvedValue(null);

    const result = await service.getClientById("nonexistent");

    expect(result).toBeNull();
  });

  test("createClient deve criar e retornar cliente", async () => {
    const clientData = { id: "1", name: "Test", email: "test@test.com", password: "$2b$12$cb/j/2CR0rmeDXo/ttg9iO7kS9wgifyTZ0kgsbJqz1LMtpFR42.Zi", saldo: Decimal("0") };
    repositoryMock.create.mockResolvedValue(clientData);

    const result = await service.createClient(clientData);

    expect(repositoryMock.create).toHaveBeenCalledWith(clientData);
    expect(result).toEqual(clientData);
  });

  test("updateClient deve atualizar e retornar cliente", async () => {
    const updatedClient = { id: "1", name: "Updated", email: "updated@test.com", password: "$2b$12$cb/j/2CR0rmeDXo/ttg9iO7kS9wgifyTZ0kgsbJqz1LMtpFR42.Zi", saldo: Decimal("0") };
    repositoryMock.update.mockResolvedValue(updatedClient);

    const result = await service.updateClient("1", { name: "Updated" });

    expect(repositoryMock.update).toHaveBeenCalledWith("1", { name: "Updated" });
    expect(result).toEqual(updatedClient);
  });

  test("updateClient deve retornar null se cliente não encontrado", async () => {
    repositoryMock.update.mockResolvedValue(null);

    const result = await service.updateClient("999", { name: "Nope" });

    expect(result).toBeNull();
  });

  test("deleteClient deve chamar delete no repositorio", async () => {
    repositoryMock.delete.mockResolvedValue();

    await service.deleteClient("1");

    expect(repositoryMock.delete).toHaveBeenCalledWith("1");
  });
});