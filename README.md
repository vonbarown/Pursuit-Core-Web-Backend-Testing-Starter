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

[This is the Backend](https://github.com/joinpursuit/Pursuit-Core-Web-Backend-Testing-Starter) we will use, take a look at the [API docs](https://github.com/joinpursuit/Pursuit-Core-Web-Backend-Testing-Starter/API.md) and take some time to look around the files, make sure there is nothing surprising or confusing about it. Try a few requests with Postman.

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

5. Create a database and seed it for the first time
```
createdb backend_testing_users_db
psql -f db/seed.sql -d backend_testing_users_db 
```

6. Create a `resetDb.js` file with the following content. Save it to the `db/` directory
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

## Hands On
### Explore the Backend to be Tested
Once you have cloned the starter App take 15 minutes to read the Backend Docs and familiarize yourself with the endpoints and requests.

### Our First Test. `/api/notes/public` retrieves all notes
Let us test endpoints or routes that do not require a user to be logged in first. We will test that a client can retrieve all public  notes when a `GET` request to `/api/notes/public` is made.

1. Create a `__tests__` folder at the root of your project.
2. Create a `notes.test.js` test file
3. Add the following content
```js
const request = require('supertest')
const app = require('../app')
const reqAgent = request.agent(app)
const resetDb = require('../db/resetDb');

beforeEach(() => {
  resetDb()
})

afterAll(() => {
  resetDb()
})

describe('/api/notes endpoints', () => {
  test('All public notes are retrieved', async () => {
    const { status, body } = await reqAgent.get('/api/notes/public')
    expect(status).toBe(200)
    expect(body).toContainAllKeys(['err', 'msg', 'payload'])
    expect(body.err).toBeFalse()
    expect(body.msg).toMatch(/retrieved all public notes/i)

    const notes = body.payload
    expect(notes).toBeArrayOfSize(2) // There are only 2 public notes in our database

    // Sample and test values of one note
    expect(notes[0]).toContainAllKeys(['id', 'created_at', 'user_id', 'text', 'is_public'])
    expect(new Date(notes[0].created_at)).toBeValidDate()
    expect(notes[0].id).toBeNumber()
    expect(notes[0].user_id).toBeNumber()
    expect(notes[0].text).toBeString()
    expect(notes[0].is_public).toBe(true)
  })
})
```

#### Explanation
* `beforeEach` will execute the callback provided after each test. In this case the callback invokes `resetDb()` to reset our database after each test. Remember that we don't want to share state (data, variables etc) between tests as possibnle. Read the `beforEach` docs [here](https://jestjs.io/docs/en/api#beforeeachfn-timeout)
* `afterAll`. After all the tests make sure our database is reset and does not contain any test data.
* `reqAgent.get('/api/notes/public')`. Is what will fire the request to our our app's endpoint. Kind of like `axios` but for testing. You can see that `reqAgent` is made by importing `request` from `supertest` and creating an agent by passing in our app.
* `const { status, body }` is destructuring the status and body of the response so that we can make assertions on them.
* `expect(status).toBe(200)`. It reads pretty easily doesn't it?. We are expecting that for this request the response `status` was a successful `200`
* `expect(body).toContainAllKeys(['err', 'msg', 'payload'])`. In this way you can check that your response object is returning all the keys that you expect.
* Then you can make assertions on the values of the response body properties like so:
```js
  expect(body.err).toBeFalse()
  expect(body.msg).toMatch(/retrieved all public notes/i)
```
* The rest is us sampling and checking the response `payload` property. For easier readability we save `body.payload` in a variable `notes` (`const notes = body.payload`). For this request the payload will contain an array of note objects. In this case we should get 2 notes because that's the number of notes we start with in our `seed.sql` file. We also take a look at the first note and assert that it has properties `id`, `created_at`, `user_id`, `text` and `is_public`. Lastly we assert that those properties have the expected values like, expecting that the note `text` property is a string (`expect(notes[0].text).toBeString()`)

### Your turn. `/api/users` retrieves all users
1. Create a `users.test.js` file inside `__tests__/`
2. Write a test that verifies that when a request to `/api/users` is made all the users are returned.
    * **DO NOT COPY AND PASTE**. Build muscle memory.
    * Make sure you have the correct `require`s and setup.  
    * Don't forget to wrap your test into a describe
    * This will be a similar and even simpler test than the previous one.


## Additional Resources
* [Jest - An Async Example](https://jestjs.io/docs/en/tutorial-async#asyncawait)
* [Jest Cheatsheet](https://devhints.io/jest)
