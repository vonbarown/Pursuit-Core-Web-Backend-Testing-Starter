const request = require("supertest");
const app = require("../app");
const reqAgent = request.agent(app);
const resetDb = require("../db/resetDb");

afterEach(() => {
  resetDb();
});

afterAll(() => {
  resetDb();
});

describe("/users endpoints", () => {
  test("GET to /api/users retrieves all users", async () => {
    const { status, body } = await reqAgent.get("/api/users");
    expect(status).toBe(200);
    expect(body).toContainAllKeys(["err", "msg", "payload"]);

    const users = body.payload;
    expect(users).toBeArrayOfSize(2); // Our seed file inserts two users. So we have 2 users in our database.

    // Sample one user and assert property values
    const user = users[0];
    expect(user).toContainAllKeys(["id", "username"]);
    expect(user.id).toBeNumber();
    expect(user.username).toBe("JonSnow"); // JonSnow is the first user in our database seed file
  });
});
