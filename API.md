# API Docs

## Root Endpoint: `http://localhost:3100/api`

## Resources
This API has users and notes resources represented as follows:

* User
```json
  {
    "id": 3,
    "username": "alejo4373"
  }
```

* Notes
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
| Method | Endpoint        | Request JSON Body/Payload                 | Description                                                       |
| ------ | --------------- | ----------------------------------------- | ----------------------------------------------------------------- |
| `GET`  | `/notes/public` | N/A                                       | Get all notes that have `is_public` = `true`                      |
| `GET`  | `/notes/mine`   | N/A                                       | Get all notes that belong to the user that is currently logged in |
| `POST` | `/notes`        | `{ is_public: true, text: "Hello Word" }` | Post a new note. Only users that are logged in can add notes      |

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
