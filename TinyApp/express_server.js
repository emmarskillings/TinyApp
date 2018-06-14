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



const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/", (request, response) => {
  response.end("Hello!");
});

// GET requests

app.get("/urls.json", (request, response) => {
  response.json(urlDatabase);
});

app.get("/hello", (request, response) => {
  response.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (request, response) => {
  let templateVars =
    {
      user: users[request.cookies.user_id],
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
  response.render("urls_login")
})

app.get("/urls/new", (request, response) => {
  let templateVars =
    {
     user: users[request.cookies.user_id]
    }
  response.render("urls_new", templateVars);
});

app.get("/urls/:id", (request, response) => {
  let templateVars =
    {
      user: users[request.cookies.user_id],
      shortURL: request.params.id,
      longURL: urlDatabase[request.params.id]
    }
  response.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (request, response) => {
  let longURL = urlDatabase[request.params.shortURL];
  response.redirect(longURL);
});

// POST requests

app.post("/register", (request, response) => {
  var newUserID = generateRandomString();
  var newUserEmail = request.body["email"];
  var newUserPassword = request.body["password"];
  var existingUserEmail = findExistingUserEmail(newUserEmail);

  if (existingUserEmail == newUserEmail) {
    response.status(404).render("fourohfour");
  } else if (newUserEmail && newUserPassword) {
    response.redirect("/urls");
    users[newUserID] = {id: newUserID, email: newUserEmail, password: newUserPassword};
  } else {
    response.status(404).render("404");
  }
  response.cookie("user_id", newUserID);
});

app.post("/login", (request, response) => {
  response.cookie("user_id", user_id);
  response.redirect("/urls");
});

app.post("/logout", (request, response) => {
  response.clearCookie("user_id");
  response.redirect("/urls");
})

app.post("/urls", (request, response) => {
  var newLongURL = request.body.longURL;
  var randomString = generateRandomString();
  response.redirect("/urls/" + randomString);
  urlDatabase[randomString] = newLongURL;
});

app.post("/urls/:id/update", (request, response) => {
  var updateURL = request.body.updateURL
  response.redirect("/urls");
  urlDatabase[request.params.id]=updateURL;
})

app.post("/urls/:id/edit", (request, response) => {
  let shortURL = request.params.id;
  response.redirect("/urls/" + shortURL)
})

app.post("/urls/:id/delete", (request, response) => {
  let URLtoDelete = request.params.id;
  delete urlDatabase[URLtoDelete];
  response.redirect("/urls")
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});