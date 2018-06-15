var express = require("express");
var app = express();
var PORT = 8080;

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser())

app.set("view engine", "ejs");

function generateRandomString() {
  var randomString = "";
  var possibleCharacters = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789";

  for(var i = 0; i < 6; i++) {
    randomString += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
  }
  return randomString;
}

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user1@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

function emailToId(email) {
  for (let id in users) {
    if (users[id].email === email) {
      return id;
    }
  }
}

function findExistingUserEmail(email) {
  let existingEmail = '';
  let keys = Object.keys(users);
  for (i = 0; i < keys.length; i++) {
    if (email === users[keys[i]]['email']) {
      existingEmail += users[keys[i]]['email'];
    }
  }
  return existingEmail;
}

function findExistingUserPassword(password) {
  let existingPassword = '';
  let keys = Object.keys(users);
  for (i = 0; i < keys.length; i++) {
    if (password === users[keys[i]]["password"]) {
      existingPassword += users[keys[i]]["password"];
    }
  }
  return existingPassword;
}

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "user2RandomID"
  }
};

// GET requests

app.get("/", (request, response) => {
  response.end("Hello!");
});

app.get("/urls.json", (request, response) => {
  response.json(urlDatabase);
});

app.get("/hello", (request, response) => {
  response.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (request, response) => {
  let templateVars =
    {
      user: users[request.cookies["user_id"]],
      urls: urlDatabase
    }
  response.render("urls_index", templateVars);
});

app.get("/register", (request, response) => {
  let templateVars =
    {
      user_id: request.cookies["newUserID"]
    }
  response.render("urls_register", templateVars);
});

app.get("/login", (request, response) => {
  let templateVars =
    {
      user: users[request.cookies["user_id"]]
    }
  response.render("urls_login", templateVars)
})

app.get("/urls/new", (request, response) => {
  if (request.cookies["user_id"]) {
    let templateVars =
    {
     user: users[request.cookies["user_id"]]
    }
    response.render("urls_new", templateVars);
  } else {
    response.redirect("/login");
  }
});

app.get("/urls/:id/edit", (request, response) => {
  let shortURL = request.params.id;
  if (request.cookies["user_id"] === urlDatabase[shortURL]["userID"]) {
    response.render("urls_show", templateVars =
    {
      user: users[request.cookies["user_id"]],
      shortURL: request.params.id,
      longURL: urlDatabase[request.params.id]
    });
  } else {
    response.redirect("/urls")
  }
});

// app.get("/urls/:shortURL/edit", (request, response) => {

// });

app.get("/u/:shortURL", (request, response) => {
  let longURL = urlDatabase[request.params.shortURL];
  response.redirect(longURL);
});

// POST requests

app.post("/register", (request, response) => {
  let newUserID = generateRandomString();
  let newUserEmail = request.body["email"];
  let newUserPassword = request.body["password"];
  let existingUserEmail = findExistingUserEmail(newUserEmail);

  if (existingUserEmail == newUserEmail) {
    response.status(400).render("userExists");
  } else if (newUserEmail && newUserPassword) {
    users[newUserID] = {id: newUserID, email: newUserEmail, password: newUserPassword};
    response.cookie("user_id", newUserID);
    response.redirect("/urls");
  } else {
    response.status(400).render("missingEmailorPassword");
  }
  console.log(users);
});

app.post("/login", (request, response) => {
  let userEmail = request.body["email"];
  let userPassword = request.body["password"];
  let existingUserEmail = findExistingUserEmail(userEmail);
  let existingUserPassword = findExistingUserPassword(userPassword);
  let userid = emailToId(userEmail);

  if (existingUserEmail == userEmail && existingUserPassword == userPassword) {
    response.cookie("user_id", userid);
    console.log(userid)
    response.redirect("/urls");
  }
  else {
    response.status(403).render("tryAgain");
  }
});

app.post("/logout", (request, response) => {
  response.clearCookie("user_id");
  response.redirect("/login");
})

app.post("/urls", (request, response) => {
  var newLongURL = request.body.longURL;
  var randomString = generateRandomString();
  urlDatabase[randomString] = {longURL: newLongURL, userID: request.cookies["user_id"]};
  response.redirect("/urls");
  console.log(urlDatabase);
});

app.post("/urls/new", (request,response) => {
  let userEmail = request.body["email"];
  let userPassword = request.body["password"];
  let existingUserEmail = findExistingUserEmail(userEmail);
  let existingUserPassword = findExistingUserPassword(userPassword);

  if (existingUserEmail == userEmail && existingUserPassword == userPassword) {
    response.redirect("/urls/new");
  }
  else {
    response.redirect("/login");
  }
})

app.post("/urls/:id/update", (request, response) => {
  var updateURL = request.body.updateURL
  urlDatabase[request.params.id]["longURL"] = updateURL;
  response.redirect("/urls");
  console.log(updateURL)
})

// app.post("/urls/:id/edit", (request, response) => {
//   let shortURL = request.params.id;
//   // if (request.cookies[user_id] === urlDatabase[shortURL][userID]) {
//   //   response.redirect("/urls/" + shortURL)
//   // } else {
//   //   response.redirect("/urls")
//   // }
// });

app.post("/urls/:id/delete", (request, response) => {
  let URLtoDelete = request.params.id;
  delete urlDatabase[URLtoDelete];
  response.redirect("/urls")
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});