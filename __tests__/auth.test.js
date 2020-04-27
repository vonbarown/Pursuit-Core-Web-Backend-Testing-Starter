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

describe('Auth', () => {
  test('A user can sign up and a success message is sent', async () => {
    const user = {
      username: 'TestUser837',
      password: "s3cr37"
    }

    const res = await reqAgent.post('/api/auth/signup').send(user)
    expect(res.status).toBe(200)

    let data = res.body
    expect(data).toContainAllKeys(['err', 'msg', 'payload'])
    expect(data.err).toBeFalse()
    expect(data.msg).toMatch("User successfully signed up")
    expect(data.payload.username).toBe(user.username)
    expect(data.payload.id).toBeNumber()
    expect(data.payload.password).toBeUndefined() // Make sure password was not returned
  })

  // Same as above but without async/await. Instead async is handled through callbacks
  //   test('User can register and a success message is sent', (done) => {
  //     const user = {
  //       username: 'TestUser837',
  //       password: "s3cr37"
  //     }

  //     reqAgent
  //       .post('/api/auth/signup')
  //       .send(user)
  //       .end((err, res) => {
  //         expect(res.status).toBe(200)

  //         let data = res.body

  //         expect(data).toContainAllKeys(['err', 'msg', 'payload'])
  //         expect(data.err).toBeFalse()
  //         expect(data.msg).toMatch(/success/i)
  //         expect(data.payload.username).toBe(user.username)
  //         expect(data.payload.id).toBeNumber()
  //         expect(data.payload.password).toBeUndefined()
  //         done()
  //       })
  //   })

  test('A registered user can login and a success message is sent', async () => {

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

  test('A logged in user can log out and a success message is sent', async () => {

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
