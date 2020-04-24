const app = require('../app')
const request = require('supertest')

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
        done()
      })
  })
})
