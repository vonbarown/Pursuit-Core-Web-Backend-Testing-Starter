const app = require('../app')
const request = require('supertest')
const resetDb = require('../db/resetDb')
const reqAgent = request.agent(app)

beforeEach(() => {
  resetDb()
})

afterEach(async () => {
  await reqAgent.get('/api/auth/logout') // Logout user, we don't want sessions being kept in between tests
})

afterAll(() => {
  resetDb()
})

describe('/api/auth endpoints', () => {
  test('POST to /signup registers a user and sends user back along with success message', async () => {
    const user = {
      username: 'TestUser837',
      password: "s3cr37"
    }

    const { status, body } = await reqAgent.post('/api/auth/signup').send(user)
    expect(status).toBe(200)

    expect(body).toContainAllKeys(['err', 'msg', 'payload'])
    expect(body.err).toBeFalse()
    expect(body.msg).toMatch("User successfully signed up")
    expect(body.payload.username).toBe(user.username)
    expect(body.payload.id).toBeNumber()
    expect(body.payload.password).toBeUndefined() // Make sure password was not returned
  })

  test('POST to /login logs in a user and sends back user along with success message', async () => {

    const user = {
      username: 'otherUser1',
      password: "not_a_secret"
    }

    // Signup user first
    await reqAgent.post('/api/auth/signup').send(user)

    // Try to log in
    const { status, body } = await reqAgent.post('/api/auth/login').send(user)

    expect(status).toBe(200)
    expect(body).toContainAllKeys(['err', 'msg', 'payload'])
    expect(body.err).toBeFalse()
    expect(body.msg).toMatch(/success/i)
    expect(body.payload.username).toBe(user.username)
    expect(body.payload.id).toBeNumber()
    expect(body.payload.password).toBeUndefined() // Make sure password was not returned
  })

  test('GET to /logout logs out the user currently logged in and sends success message', async () => {

    const user = {
      username: 'oneMoreUser1',
      password: "not_a_secret"
    }

    await reqAgent.post('/api/auth/signup').send(user) // Signup user first
    await reqAgent.post('/api/auth/login').send(user) // Login user 

    // Try to Log out
    const { status, body } = await reqAgent.get('/api/auth/logout')

    expect(status).toBe(200)
    expect(body).toContainAllKeys(['err', 'msg', 'payload'])
    expect(body.err).toBeFalse()
    expect(body.msg).toMatch(/success/i)
    expect(body.payload).toBe(null)
  })
})
