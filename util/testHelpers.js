const request = require('supertest')
const app = require('../app')
const reqAgent = request.agent(app)

const signupTestUser = async (user) => {
  const { body } = await reqAgent.post('/api/auth/signup').send(user)
  const newUser = body.payload
  return newUser;
}

const loginTestUser = async (user) => {
  const { body } = await reqAgent.post('/api/auth/login').send(user)
  const loggedInUser = body.payload
  return loggedInUser;
}

const logoutTestUser = async () => {
  await reqAgent.get('/api/auth/logout')
}

module.exports = {
  reqAgent,
  signupTestUser,
  loginTestUser,
  logoutTestUser
}
