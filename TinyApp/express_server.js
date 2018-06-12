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

app.use(bodyParser.urlencoded({extended: true}));

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
  let templateVars = { urls: urlDatabase };
  response.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (request, response) => {
  let templateVars =
    {
      shortURL: request.params.id,
      longURL: urlDatabase[request.params.id]
    }
  response.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (request, response) => {
  let longURL =
  res.redirect(longURL);
});

app.post("/urls", (request, response) => {
  var newLongUrl = request.body.longURL;
  var randomString = generateRandomString();
  response.redirect("/urls/" + randomString);
  urlDatabase[randomString]=newLongUrl;
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});