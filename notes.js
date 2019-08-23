async function getNotes(req, res){
  try {
    const db = req.app.get('db')

    const notes = await db.query(`SELECT * 
    FROM notes 
    WHERE user_id=${req.session.user.id}`)
    
    res.send(notes)
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
}

async function updateNote(req, res){
  try {
    const db = req.app.get('db')

    await db.query(`UPDATE notes 
    SET note='${req.body.note}'
    WHERE id=${req.params.id}`)

    const notes = await db.query(`SELECT * FROM notes WHERE user_id=${req.body.user_id}`)


    res.send(notes)
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
}

async function addNotes(req, res){
  try {
    const db = req.app.get('db')

    await db.query(`INSERT INTO notes (user_id)
    VALUES (${req.body.user_id})`)

    const notes = await db.query(`SELECT * FROM notes WHERE user_id=${req.body.user_id}`)

    res.send(notes)
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
}

async function deleteNotes(req, res){
  try {
    const db = req.app.get('db')

    await db.query(`DELETE FROM notes WHERE id=${req.params.id}`)

    const notes = await db.query(`SELECT * FROM notes WHERE user_id=${req.body.user_id}`)

    res.send(notes)
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
}

module.exports = {
  getNotes,
  updateNote,
  addNotes,
  deleteNotes
}