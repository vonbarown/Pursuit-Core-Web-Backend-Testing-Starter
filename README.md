# Backend Testing
Backend Testing will be considered a form of Integration Testing we are testing the contract between our route handlers, queries and database. And making sure they work well together in turn assuring us that our backend works as we expect it.

Today we will be testing a Backend Application that handles users and notes. Some feature of this backend include:

* User Authentication:
  * A user can signup with username and password
  * A user can login
  * A user can logout
* Notes
  * Any unauthenticated user can retrieve all public notes.
  * Authenticated users can add a note.
  * Authenticated users can get the notes they have added.

[This is the Backend](https://github.com/joinpursuit/Pursuit-Core-Web-Backend-Testing-Starter) we will use, take some time to look around the files, make sure there is nothing surprising or confusing about it. Try a few requests with Postman.

## Setup

1. Clone starter Backend App and install dependencies:
  ```
  git clone https://github.com/joinpursuit/Pursuit-Core-Web-Backend-Testing-Starter.git
  cd Pursuit-Core-Web-Backend-Testing-Starter
  npm install
  ```

2. Install dev dependencies

  ```
  npm install -D jest jest-extended @types/jest supertest 
  ```

  * [`jest`](https://jestjs.io/) - Our testing framework
  * [`jest-extended`](https://github.com/jest-community/jest-extended) - Provides additional handy matchers
  * [`@types/jest`](https://www.npmjs.com/package/@types/jest) - Jest Typescript Typings. This is nice to give use intellisense/autocomplete for jest
  * [`supertest`](https://github.com/visionmedia/supertest) - HTTP client for making HTTP assertions. You can think of this as the `axios` for `testing`. 

3. Save `jest.config.js`

  ```js
  module.exports = {
    setupFilesAfterEnv: ["jest-extended"],
    testEnvironment: "node"
  }
  ```

  This ensures that we get the additional matchers from `jest-extended`. Also sets the jest test environment config to be `node` (default is `jsdom`)

4. Set/add `test` script to `package.json` as shown here:

  ```
  "test": "jest --runInBand --watch"
  ```

 This makes sure that our tests run serially (`--runInBand`). Normally for unit testing Jest will run tests in parallel for speed and efficiently but since our tests will share the same database if one test modifies a record another might utilize the results of the previous test or conflict with it giving us have hard to debug issues. `--watch` will keep jest running so that we get hot test reload when we change a source file or test file.

5. Create a `resetDb.js` file with the following content
  ```js
  const { execSync } = require('child_process')

  const SEED_FILE_PATH = __dirname + "/seed.sql"
  const DATABASE_NAME = "backend_testing_users_db"

  const resetDb = () => {
    execSync(`psql -f ${SEED_FILE_PATH} -d ${DATABASE_NAME}`)
  }

  module.exports = resetDb;
  ```

  This file calls `psql` which will execute our seed file `-f ${SEED_FILE_PATH}` in the context of our database `-d ${DATABASE_NAME}`. Note that our seed file should not include the lines to `DROP`/`CREATE` a database or connect to it.

  We will use this file to spin up and down our database tables in between tests. We want to avoid our tests using shared state (global variables, database data, etc) as much as possible.

## Our First Test
As mentioned easier this backend has user authentication setup already. We want to make sure that our user authentication works as expected. Let's test the `/signup` route of our backend.


### Additional Resources
* [Jest - An Async Example](https://jestjs.io/docs/en/tutorial-async#asyncawait)
* [Jest Cheatsheet](https://devhints.io/jest)
