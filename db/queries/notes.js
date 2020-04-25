const db = require('../db')

const getAllNotes = async () => {
	const notes = await db.any("SELECT * FROM notes")
	return notes;
}

const addNewNote = async (note) => {
	const newNoteQuery = `
		INSERT INTO notes(user_id, message)
			VALUES($/user_id/, $/message/)
			RETURNING *
	`
	const newNote = await db.one(newNoteQuery, note)
	return newNote;
}

const getNotesByUserId = async (user_id) => {
	const notes = await db.any("SELECT * FROM notes WHERE user_id = $1", [user_id])
	return notes;
}

module.exports = {
	getAllNotes,
	addNewNote,
	getNotesByUserId
}
