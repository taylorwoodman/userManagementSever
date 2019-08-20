const express = require("express");
const bcrypt = require("bcrypt");


function loggedIn(req, res){
    if(!req.session.user){ 
      res.send('')
    } else {
    res.send(req.session.user)
  }
}


function getUsers(req, res){
  try {
    if(!req.session.user){
      return res.status(200).send('please log in')
    } else {
      res.send(req.session.user)
    }
  } catch (error) {
    console.error(error)
  }
}


async function handleSignup(req, res) {
  try {
    const db = req.app.get("db");
    
    const hash = await bcrypt.hash(req.body.password, 10);
    
    const newUser = await db.user1.insert({
      //^inserting into my database
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      password_hash: hash
    });
    
    delete newUser.password;
    
    res.send(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}

async function handleLogin(req, res){
  try {
    const db = req.app.get("db");
    
    const [user1] = await db.user1.where('email=$1 OR username=$1', [req.body.username])
    if(!user1) return res.status(400).send('Please enter valid login credentials')
    
    const authenticated = await bcrypt.compare(req.body.password, user1.password_hash)
    if(!authenticated) return res.status(400).send('Please enter valid login credentials')
    
    delete user1.password
    if(authenticated) req.session.user = user1
    return res.send(user1)
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
}

async function allUsers(req, res){
  const db = req.app.get("db")

  const users = await db.user1.find()

  res.send(users)
}

async function handleEdit(req, res) {
  try {
    const db = req.app.get('db')

    await db.query(`UPDATE user1 
    SET first_name='${req.body.firstName}',
    last_name='${req.body.lastName}',
    username='${req.body.username}',
    email='${req.body.email}'
    WHERE id=${req.params.id}`)
    if(+req.params.id === req.session.user.id){
      req.session.user.first_name = req.body.firstName
      req.session.user.last_name = req.body.lastName
      req.session.user.email = req.body.email
      req.session.user.username = req.body.username
    }
    res.send('updated')
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
}

function handleLogout(req, res) {
  return req.session.destroy(() => res.send('Logged out'))
}

async function handleDelete(req, res) {
  try {
    const db = req.app.get('db')

    await db.query(`DELETE FROM user1 
    WHERE id=${req.params.id}`)
    res.send('ok')
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
}




module.exports = {
  getUsers,
  handleSignup,
  handleLogin,
  handleEdit,
  handleLogout,
  handleDelete,
  loggedIn,
  allUsers
};
