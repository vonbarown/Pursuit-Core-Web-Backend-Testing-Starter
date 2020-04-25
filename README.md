# Integrations Testing - Backend Testing

## Setup
1. Install dev dependencies

```
npm install -D jest jest-extended supertest @types/jest
```

2. Save `jest.config.js`
```js
module.exports = {
  setupFilesAfterEnv: ["jest-extended"],
  testEnvironment: "node"
}
```
This ensures that we get the additional matchers from `jest-extended`. Also sets the jest test environment config to be `node` (default is `jsdom`)

3. In `package.json` add `test` script as shown here:
```
 "test": "jest --runInBand --watch"
 ```

Async Testing https://jestjs.io/docs/en/tutorial-async#asyncawait
Additional Handy Matchers https://github.com/jest-community/jest-extended
