function generateRandomString() {
  var randomString = "";
  var possibleCharacters = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789";

  for(var i = 0; i < 6; i++) {
    randomString += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
  }
  return randomString;
}

var express = require("express");
var app = express();
var PORT = 8080;

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser())

app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

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
      username: request.cookies["username"],
      urls: urlDatabase
    }
  response.render("urls_index", templateVars);
});

app.get("/urls/new", (request, response) => {
  let templateVars =
    {
     username: request.cookies["username"]
    }
  response .render("urls_new");
});

app.get("/urls/:id", (request, response) => {
  let templateVars =
    {
      username: request.cookies["username"],
      shortURL: request.params.id,
      longURL: urlDatabase[request.params.id]
    }
  response.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (request, response) => {
  let longURL = urlDatabase[request.params.shortURL];
  response.redirect(longURL);
});

app.post("/login", (request, response) => {
  response.cookie("username", request.body["username"]);
  console.log(request.body);
  response.redirect("/urls");
});

app.post("/urls", (request, response) => {
  var newLongURL = request.body.longURL;
  var randomString = generateRandomString();
  response.redirect("/urls/" + randomString);
  urlDatabase[randomString]=newLongURL;
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