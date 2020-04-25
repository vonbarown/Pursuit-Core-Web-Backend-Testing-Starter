const { reqAgent, signupTestUser, loginTestUser, logoutTestUser } = require('../util/testHelpers')
const resetDB = require('../db/resetDb');

const testUser = {
  username: "testerUser123",
  password: "tercesrepus"
}

beforeEach(async () => {
  resetDB()
  await signupTestUser(testUser)
  await loginTestUser(testUser)
})

afterEach(async () => {
  await logoutTestUser()
})

describe('Notes', () => {
  test('All notes are retrieved', async () => {
    expect.assertions(10)

    const { status, body } = await reqAgent.get('/api/notes')
    expect(status).toBe(200)
    expect(body).toContainAllKeys(['err', 'msg', 'payload'])
    expect(body.err).toBeFalse()
    expect(body.msg).toMatch(/retrieved all notes/i)

    const notes = body.payload
    expect(notes).toBeArrayOfSize(4)

    // Sample and test values of one note
    expect(notes[0]).toContainAllKeys(['id', 'created_at', 'user_id', 'message'])
    expect(new Date(notes[0].created_at)).toBeValidDate()
    expect(notes[0].id).toBeNumber()
    expect(notes[0].user_id).toBeNumber()
    expect(notes[0].message).toBeString()
  })

  test('A new note can be posted', async () => {
    expect.assertions(9)

    let user = {
      username: "aNewUser123",
      password: "secret-p4$$word123"
    }

    await signupTestUser(user)
    let loggedInUser = await loginTestUser(user)

    let newNote = {
      message: "I'm happy"
    }

    const { status, body } = await reqAgent.post('/api/notes').send(newNote)
    expect(status).toBe(200)
    expect(body).toContainAllKeys(['err', 'msg', 'payload'])
    expect(body.err).toBeFalse()
    expect(body.msg).toMatch(/added new note/i)

    const note = body.payload
    expect(note).toContainAllKeys(['id', 'created_at', 'user_id', 'message'])
    expect(note.id).toBeNumber()
    expect(note.user_id).toBe(loggedInUser.id)
    expect(note.message).toBe(newNote.message)
    expect(new Date(note.created_at)).toBeValidDate()
  })

})
