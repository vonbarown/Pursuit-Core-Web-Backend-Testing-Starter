const { reqAgent, signupTestUser, loginTestUser, logoutTestUser } = require('../util/testHelpers')
const resetDb = require('../db/resetDb');

const testUser = {
  username: "testerUser123",
  password: "tercesrepus"
}

beforeEach(async () => {
  resetDb()
})

afterAll(() => {
  resetDb()
})

afterEach(async () => {
  await logoutTestUser()
})

describe('Notes', () => {
  test('All public notes are retrieved', async () => {
    expect.assertions(11)

    const { status, body } = await reqAgent.get('/api/notes/public')
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
      is_public: false
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
    expect(note.is_public).toBe(newNote.is_public)
    expect(new Date(note.created_at)).toBeValidDate()
  })

  test('A logged in user can retrieve his public and private notes', async () => {
    expect.assertions(17)

    // Log in JonSnow, who has some notes
    await loginTestUser({
      username: 'JonSnow',
      password: 'hello123'
    })

    const { status, body } = await reqAgent.get('/api/notes/mine')
    expect(status).toBe(200)

    expect(body).toContainAllKeys(['err', 'msg', 'payload'])
    expect(body.err).toBeFalse()
    expect(body.msg).toMatch(/retrieved your notes/i)

    const notes = body.payload
    expect(notes).toBeArrayOfSize(2) // JonSnow has two notes one public one private

    for (let note of notes) {
      expect(note).toContainAllKeys(['id', 'created_at', 'user_id', 'text', 'is_public'])
      expect(new Date(note.created_at)).toBeValidDate()
      expect(note.id).toBeNumber()
      expect(note.user_id).toBeNumber()
      expect(note.text).toBeString()
      expect(note.is_public).toBeBoolean()
    }
  })

  test('When user is not logged they can\'t retrieve their notes', async () => {
    // User is not logged in but request to /api/note/mine is made
    const { status, body } = await reqAgent.get('/api/notes/mine')

    expect(status).toBe(401)

    expect(body).toContainAllKeys(['err', 'msg', 'payload'])
    expect(body.err).toBe(true)
    expect(body.msg).toBe("You need to be logged in to access this route")
    expect(body.payload).toBe(null)

  })
})
