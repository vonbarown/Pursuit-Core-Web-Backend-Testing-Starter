const express = require('express');
const router = express.Router();
const notesQueries = require('../db/queries/notes')
const { loginRequired } = require('../auth/helpers')


router.get('/', async (req, res, next) => {
  try {
    let notes = await notesQueries.getPublicNotes()
    res.json({
      payload: notes,
      msg: "Retrieved all public notes",
      err: false
    })
  } catch (err) {
    res.status(500).json({
      payload: null,
      msg: "Failed retrieving all notes",
      err: true
    })
  }
});

router.post('/', loginRequired, async (req, res, next) => {
  let note = {
    user_id: req.user.id,
    ...req.body
  }

  try {
    let newNote = await notesQueries.addNewNote(note)
    res.json({
      payload: newNote,
      msg: "Added new notes",
      err: false
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      payload: null,
      msg: "Failed to add new note",
      err: true
    })
  }
});

router.get('/byUser/:user_id', loginRequired, async (req, res, next) => {
  const { user_id } = req.params
  try {
    let notes = await notesQueries.getNotesByUserId(user_id)
    res.json({
      payload: notes,
      msg: "Retrieved notes by user_id",
      err: false
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      payload: null,
      msg: "Failed retrieving notes by user_id",
      err: true
    })
  }
});

module.exports = router;
