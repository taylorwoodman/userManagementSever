const app = require("express")();
const bcrypt = require("bcrypt");
const session = require("express-session")

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

// function loggedIn(req, res){
//   if(!req.session.user) res.send('')
// }

async function socketOn(socket){
  socket.on("join room", async data => {

  })
}

function getUsers(req, res){
  try {
  if(!req.session.user){
    handleSignup()
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

    const [user1] = await db.user1.find({email: req.body.email})
    if(!user1) return res.status(400).send('Please enter valid login credentials')

    const authenticated = await bcrypt.compare(req.body.password, user1.password_hash)
    if(!authenticated) return res.status(400).send('Please enter valid login credentials')

    delete user1.password
    req.session.user = user1

    return res.send('Successfully logged in')
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
}

function handleEdit(req, res) {}

function handleLogout(req, res) {
  return req.session.destroy(() => res.send('Logged out'))
}

function handleDelete(req, res) {}

module.exports = {
  getUsers,
  handleSignup,
  handleLogin,
  handleEdit,
  handleLogout,
  handleDelete,
  socketOn,
  // loggedIn
};
