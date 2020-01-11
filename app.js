//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require('request');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;

  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  var jsonData = JSON.stringify(data); //Need to turn javascript object above to json

  var options = {
    url: "https://us4.api.mailchimp.com/3.0/lists/01bd83150a",
    method: "POST",
    headers: {
      "Authorization": "jude1 dd26cfbd8f135e4c28a9dbf15b7d6914-us4"
    },
    body: jsonData
  };

  request(options, function(error, response, body) {
    if (error) {
      console.log(error);
      res.sendFile(__dirname + "/failure.html");
    } else {
      console.log(response.statusCode);
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      }
      else {
        res.sendFile(__dirname + "/failure.html");
      }
    }
  });

});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
});

// dd26cfbd8f135e4c28a9dbf15b7d6914-us4 API Key
// 01bd83150a Audience / List Id
