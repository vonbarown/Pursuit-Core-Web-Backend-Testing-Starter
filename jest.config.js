// Set test database DATABASE_URL for testing so that our development database 
// does not get reset in between test
process.env.DATABASE_URL = "postgres://localhost:5432/users_notes_api_test_db"

module.exports = {
  setupFilesAfterEnv: ["jest-extended"],
  testEnvironment: "node"
}
