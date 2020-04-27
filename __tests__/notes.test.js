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
    expect.assertions(11)

    const { status, body } = await reqAgent.get('/api/notes')
    expect(status).toBe(200)
    expect(body).toContainAllKeys(['err', 'msg', 'payload'])
    expect(body.err).toBeFalse()
    expect(body.msg).toMatch(/retrieved all public notes/i)

    const notes = body.payload
    expect(notes).toBeArrayOfSize(2) // There are only 2 public notes in our database

    // Sample and test values of one note
    expect(notes[0]).toContainAllKeys(['id', 'created_at', 'user_id', 'text', 'is_public'])
    expect(new Date(notes[0].created_at)).toBeValidDate()
    expect(notes[0].id).toBeNumber()
    expect(notes[0].user_id).toBeNumber()
    expect(notes[0].text).toBeString()
    expect(notes[0].is_public).toBe(true)
  })

  test('A new note can be posted', async () => {
    expect.assertions(10)

    let user = {
      username: "aNewUser123",
      password: "secret-p4$$word123"
    }

    await signupTestUser(user)
    let loggedInUser = await loginTestUser(user)

    let newNote = {
      text: "I'm happy",
      is_public: true
    }

    const { status, body } = await reqAgent.post('/api/notes').send(newNote)
    expect(status).toBe(200)
    expect(body).toContainAllKeys(['err', 'msg', 'payload'])
    expect(body.err).toBeFalse()
    expect(body.msg).toMatch(/added new note/i)

    const note = body.payload
    expect(note).toContainAllKeys(['id', 'created_at', 'user_id', 'text', 'is_public'])
    expect(note.id).toBeNumber()
    expect(note.user_id).toBe(loggedInUser.id)
    expect(note.text).toBe(newNote.text)
    expect(note.is_public).toBe(true)
    expect(new Date(note.created_at)).toBeValidDate()
  })

})
