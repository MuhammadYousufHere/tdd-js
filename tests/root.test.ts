import supertest from "supertest";
import app from "../src/app";

describe("root", () => {
  test("should return 404 and a message when url does not exist", async () => {
    const test = await supertest(app).get("/asdasdc1").expect(404);

    expect(test.body.message).toBe("Not found");
  });
});
