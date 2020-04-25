const express = require('express');
const router = express.Router();
const userQueries = require('../db/queries/users')

router.get('/', async (req, res, next) => {
  try {
    let users = await userQueries.getAllUsers()
    res.json({
      payload: users,
      msg: "Retrieved all users",
      err: false
    })
  } catch (err) {
    res.status(500).json({
      payload: null,
      msg: "Failed retrieving all users",
      err: true
    })
  }
});


module.exports = router;
