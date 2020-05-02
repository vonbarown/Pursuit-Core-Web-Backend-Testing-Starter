/*
 * resetDb.js
 * File used to reset and reseed database tables when testing 
 */

const { execSync } = require('child_process')

const SEED_FILE_PATH = __dirname + "/seed.sql"

// Having into account that DATABASE_URL = "postgres://localhost:5432/users_notes_api_test_db"
// was set in jest.config.js
const DATABASE_NAME = process.env.DATABASE_URL.split('/')[3]

const resetDb = () => {
  execSync(`psql -d ${DATABASE_NAME} -f ${SEED_FILE_PATH}`)
}

module.exports = resetDb;
