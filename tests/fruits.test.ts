import supertest from "supertest";
import app from "app";

const api = supertest(app);

describe("Fruits API", () => {
  const fruit = {
    name: "apple",
    price: 5,
  };

  describe("GET /fruits", () => {
    it("should return a list of fruits with the status code 200", async () => {
      await api.post("/fruits").send(fruit);

      const result = await api.get("/fruits");

      expect(result.statusCode).toBe(200);
      expect(result.body).toContainEqual({
        id: expect.any(Number),
        ...fruit,
      });
    });
  });

  describe("GET /fruits/:id", () => {
    it("should return the selected fruit with the status code 200", async () => {
      await api.post("/fruits").send(fruit);

      const result = await api.get(`/fruits/1`);

      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual({
        id: expect.any(Number),
        ...fruit,
      });
    });

    it("should return the status code 404 if there is no fruit with the specified id", async () => {
      const result = await api.get("/fruits/999");

      expect(result.statusCode).toBe(404);
    });
  });

  describe("POST /fruits", () => {
    beforeEach(async () => {
      await api.post("/fruits").send(fruit);
    });

    it("should return the status code 201 when a new fruit is added", async () => {
      const newFruit = {
        name: "orange",
        price: 6,
      };

      const result = await api.post("/fruits").send(newFruit);

      expect(result.statusCode).toBe(201);
    });

    it("should return the status code 422 when the body is invalid", async () => {
      const invalidFruit = {
        name: "banana",
      };

      const result = await api.post("/fruits").send(invalidFruit);

      expect(result.statusCode).toBe(422);
    });

    it("should return the status code 409 when the fruit is already added", async () => {
      const result = await api.post("/fruits").send(fruit);

      expect(result.statusCode).toBe(409);
    });
  });
});
