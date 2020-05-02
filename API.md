# UserAuth & Notes API
A sample api that allows a client to sign up users and add anonymous notes or notes that belong to any registered user.

## Features
* User Authentication:
  * A user can signup with username and password
  * A user can login
  * A user can logout
* Notes
  * Unauthenticated users can post anonymous notes.
  * Any unauthenticated user can retrieve all public notes.
  * Authenticated users can add a note.
  * Authenticated users can get the notes they have added.
  * Anonymous notes are public by default.

## Root Endpoint: `http://localhost:3100/api`

## Resources
This API has users and notes resources represented as follows:

* User example
```json
  {
    "id": 3,
    "username": "alejo4373"
  }
```

* Note Example
```json
  {
    "id": 1,
    "user_id": 1,
    "text": "Welcome to Jamrock my friend",
    "created_at": "2020-05-01T23:35:46.281Z",
    "is_public": true
  }
```

## Endpoints

### Users
| Method | Endpoint | Request JSON Body/Payload | Description                   |
| ------ | -------- | ------------------------- | ----------------------------- |
| `GET`  | `/users` | N/A                       | Retrieve all registered users |

### Notes
| Method | Endpoint           | Request JSON Body/Payload                 | Description                                                       |
| ------ | ------------------ | ----------------------------------------- | ----------------------------------------------------------------- |
| `GET`  | `/notes/public`    | N/A                                       | Get all notes that have `is_public` = `true`                      |
| `GET`  | `/notes/mine`      | N/A                                       | Get all notes that belong to the user that is currently logged in |
| `POST` | `/notes`           | `{ is_public: true, text: "Hello Word" }` | Post a new note. Only users that are logged in can add notes      |
| `POST` | `/notes/anonymous` | `{ text: "Bye bye World" }`               | Post a new anonymous note. Anonymous notes are by default public  |

### Auth
| Method | Endpoint               | Request JSON Body/Payload                  | Description                          |
| ------ | ---------------------- | ------------------------------------------ | ------------------------------------ |
| `POST` | `/auth/signup`         | `{ username: "user1", password: "12345" }` | Post user info to sign up a new user |
| `POST` | `/auth/login`          | `{ username: "user1", password: "12345" }` | Post user info to login a user       |
| `GET`  | `/auth/logout`         | N/A                                        | Ask to log out user                  |
| `GET`  | `/auth/isUserLoggedIn` | N/A                                        | Ask if there is any user logged in   |

## Response Schema
Every response from this API has the following schema/structure with `payload`, `msg` and `err` properties.
```json
{
  "payload": <object or array>,
  "msg": <string>,
  "err": <boolean>
}
```

Example:
```json
{
  "payload": {
    "id": 3,
    "username": "alejo4373"
  },
  "msg": "User successfully signed up",
  "err": false
}
```
