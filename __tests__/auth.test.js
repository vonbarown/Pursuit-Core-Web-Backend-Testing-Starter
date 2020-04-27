const app = require('../app')
const request = require('supertest')
const resetDb = require('../db/resetDb')

beforeEach(() => {
  resetDb()
})

afterAll(() => {
  resetDb()
})

describe('Auth', () => {
  test('User can register and a success message is sent', (done) => {
    const user = {
      username: 'TesterUser837',
      password: "s3cr37"
    }

    request(app)
      .post('/api/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.status).toBe(200)

        let data = res.body

        expect(data).toContainAllKeys(['err', 'msg', 'payload'])
        expect(data.err).toBeFalse()
        expect(data.msg).toMatch(/success/i)
        expect(data.payload.username).toBe(user.username)
        expect(data.payload.id).toBeNumber()
        expect(data.payload.password).toBeUndefined()
        done()
      })
  })

  // Same as previous test but using async/await instead of callbacks
  //
  // test('[async/await] User can register and a success message is sent', async () => {
  //   const user = {
  //     username: 'TesterUser837',
  //     password: "s3cr37"
  //   }

  //   const res = await request(app).post('/api/auth/signup').send(user)
  //   expect(res.status).toBe(200)

  //   let data = res.body

  //   expect(data).toContainAllKeys(['err', 'msg', 'payload'])
  //   expect(data.err).toBeFalse()
  //   expect(data.msg).toMatch(/success/i)
  //   expect(data.payload.username).toBe(user.username)
  //   expect(data.payload.id).toBeNumber()
  //   expect(data.payload.password).toBeUndefined()
  // })
})
