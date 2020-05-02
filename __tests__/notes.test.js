const request = require('supertest')
const app = require('../app')
const reqAgent = request.agent(app)
const resetDb = require('../db/resetDb');

beforeEach(() => {
  resetDb()
})

afterEach(async () => {
  await reqAgent.get('/api/auth/logout') // Logout user after each test to avoid sharing sessions between tests
})

afterAll(() => {
  resetDb()
})


describe('/notes endpoints', () => {
  test('GET to /notes/public retrieves all public notes', async () => {

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

  test('POST to /notes/anonymous adds a new anonymous note', async () => {
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

  test('POST to /notes adds a new note that belongs to the currently logged in user', async () => {

    // ARRANGE
    let user = {
      username: 'testUser2',
      password: 'drowssap'
    }

    await reqAgent.post('/api/auth/signup').send(user) // Signup new user
    const res = await reqAgent.post('/api/auth/login').send(user) // Login new user
    let loggedInUser = res.body.payload

    let note = {
      text: "I'm happy",
      is_public: false
    }

    // ACT
    const { status, body } = await reqAgent.post('/api/notes').send(note)

    // ASSERT
    expect(status).toBe(200)
    expect(body).toContainAllKeys(['err', 'msg', 'payload'])
    expect(body.err).toBeFalse()
    expect(body.msg).toMatch(/added new note/i)

    const newNote = body.payload
    expect(newNote).toContainAllKeys(['id', 'created_at', 'user_id', 'text', 'is_public'])
    expect(newNote.id).toBeNumber()
    expect(newNote.user_id).toBe(loggedInUser.id)
    expect(newNote.text).toBe(note.text)
    expect(newNote.is_public).toBe(note.is_public)
    expect(new Date(newNote.created_at)).toBeValidDate()
  })


  test('GET to /notes/mine retrieves the currently logged in user notes', async () => {

    // Log in JonSnow, who is in our seed file ("already signed up") and has some notes
    await reqAgent.post('/api/auth/login').send({
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

  test('GET to /notes/mine when no user is logged-in does not retrieve notes and returns auth error', async () => {
    // User is not logged in but request to /api/note/mine is made
    const { status, body } = await reqAgent.get('/api/notes/mine')

    expect(status).toBe(401)

    expect(body).toContainAllKeys(['err', 'msg', 'payload'])
    expect(body.err).toBe(true)
    expect(body.msg).toBe("You need to be logged in to access this route")
    expect(body.payload).toBe(null)

  })
})
