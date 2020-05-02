const request = require('supertest')
const app = require('../app')
const reqAgent = request.agent(app)
const resetDb = require('../db/resetDb');

const testUser = {
  username: "user1",
  password: "s3cr37"
}

// Helper functions
const logoutUser = async () => {
  await reqAgent.get('/api/auth/logout')
}

const signupUser = async (user) => {
  const { body } = await reqAgent.post('/api/auth/signup').send(user)
  return body.payload
}

const loginUser = async (user) => {
  const { body } = await reqAgent.post('/api/auth/login').send(user)
  return body.payload
}

beforeEach(() => {
  resetDb()
})

afterEach(async () => {
  await logoutUser() // Logout user, we don't want sessions being kept in between tests
})

afterAll(() => {
  resetDb()
})


describe('Notes', () => {
  test('All public notes are retrieved', async () => {

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

  test('A new anonymous note can be posted', async () => {

    let newNote = {
      text: "This is an anon note. Not associated with any user",
    }

    const { status, body } = await reqAgent.post('/api/notes/anonymous').send(newNote)
    expect(status).toBe(200)
    expect(body).toContainAllKeys(['err', 'msg', 'payload'])
    expect(body.err).toBeFalse()
    expect(body.msg).toMatch(/added new anonymous note/i)

    const note = body.payload
    expect(note).toContainAllKeys(['id', 'created_at', 'user_id', 'text', 'is_public'])
    expect(note.id).toBeNumber()
    expect(note.user_id).toBe(null)
    expect(note.text).toBe(newNote.text)
    expect(note.is_public).toBe(true)
    expect(new Date(note.created_at)).toBeValidDate()
  })


  test('A new note can be posted', async () => {

    await signupUser(testUser)
    let loggedInUser = await loginUser(testUser)

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

    // Log in JonSnow, who has some notes
    await loginUser({
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
