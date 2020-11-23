const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (request, response) {

    response.sendFile(__dirname + "/signUp.html");
});

app.post("/", function (request, response) {

    const firstName = request.body.firstName;
    const lastName = request.body.lastName;
    const email = request.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = 'https://us7.api.mailchimp.com/3.0/lists/a071131e3e';
    const options = {
        method: "POST",
        auth: "indrajitroy96:608cf2f48345e346a7e7e6be35b2f5fb-us7"
    };

    const mailChimpRequest = https.request(url, options, function (mailChimpResponse) {
        console.log(mailChimpResponse.statusCode);
        if(mailChimpResponse.statusCode===200){
            response.send("<h1>Success</h1>")
        }else{
            response.send("<h1>There was an error</h1>")
        }
        response.on("data", function (dataReceived) {

            console.log(JSON.parse(dataReceived));
        });
    });

    mailChimpRequest.write(jsonData);
    mailChimpRequest.end();

    console.log(firstName + lastName + email);

});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000");
});

// API KEY
// 608cf2f48345e346a7e7e6be35b2f5fb-us7

// List ID
// a071131e3e