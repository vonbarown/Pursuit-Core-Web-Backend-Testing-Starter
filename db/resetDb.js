const { execSync } = require('child_process')

const SEED_FILE_PATH = __dirname + "/seed.sql"
const DATABASE_NAME = "backend_testing_users_db"

const resetDb = () => {
  // console.log("===== RESETTING DATABASE ====")
  const psqlOutput = execSync(`psql -d ${DATABASE_NAME} -f ${SEED_FILE_PATH}`)
  // console.log(psqlOutput.toString())
  // console.log("===== DATABASE RESET COMPLETE ====")
}

module.exports = resetDb;
