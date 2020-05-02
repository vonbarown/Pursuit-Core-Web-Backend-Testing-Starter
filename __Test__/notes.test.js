const request = require("supertest");
const app = require("../app");
const reqAgent = request.agent(app);
const resetDb = require("../db/resetDb");

beforeEach(() => {
  resetDb();
});

afterAll(() => {
  resetDb();
});

describe("/api/notes endpoints", () => {
  test("All public notes are retrieved", async () => {
    const { status, body } = await reqAgent.get("/api/notes/public");
    expect(status).toBe(200);
    expect(body).toContainAllKeys(["err", "msg", "payload"]);
    expect(body.err).toBeFalse();
    expect(body.msg).toMatch(/retrieved all public notes/i);

    const notes = body.payload;
    expect(notes).toBeArrayOfSize(2); // There are only 2 public notes in our database

    // Sample and test values of one note
    expect(notes[0]).toContainAllKeys([
      "id",
      "created_at",
      "user_id",
      "text",
      "is_public",
    ]);
    expect(new Date(notes[0].created_at)).toBeValidDate();
    expect(notes[0].id).toBeNumber();
    expect(notes[0].user_id).toBeNumber();
    expect(notes[0].text).toBeString();
    expect(notes[0].is_public).toBe(true);
  });

  test("A new anonymous note can be posted", async () => {
    let newNote = {
      text: "This is an anon note. Not associated with any user",
    };

    const { status, body } = await reqAgent
      .post("/api/notes/anonymous")
      .send(newNote);
    expect(status).toBe(200);
    expect(body).toContainAllKeys(["err", "msg", "payload"]);
    expect(body.err).toBeFalse();
    expect(body.msg).toMatch(/added new anonymous note/i);

    const note = body.payload;
    expect(note).toContainAllKeys([
      "id",
      "created_at",
      "user_id",
      "text",
      "is_public",
    ]);
    expect(note.id).toBeNumber();
    expect(note.user_id).toBe(null);
    expect(note.text).toBe(newNote.text);
    expect(note.is_public).toBe(true);
    expect(new Date(note.created_at)).toBeValidDate();
  });
});
