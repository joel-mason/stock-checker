# stock-checker

To make this app work, you will need a keys.js file in the config folder with:

module.exports = {
    mongoURI: "MONGO_URI",
    secretOrKey: "SECRET" ,
    email: "EMAIL",
    emailPassword: "PASSWORD"
};

Then you will need to do:

npm install

Which installs the relevant modules
Then you will need to run this command to run the client and server

npm start dev
