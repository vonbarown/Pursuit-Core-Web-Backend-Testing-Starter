process.env.DATABASE_URL = "postgres://localhost:5432/users_notes_api_test_db";

module.exports = {
  setupFilesAfterEnv: ["jest-extended"],
  testEnvironment: "node",
};
