const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const axios = require('axios');
const cron = require("node-cron");
let nodemailer = require("nodemailer");
var dateTime = require('node-datetime');
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateAddItemInput = require("../../validation/addItem");
const validateAuthorization = require("../../validation/authorization");
// Load Item model
const Item = require("../../models/Item");
// Load User model
const User = require("../../models/User");

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

router.get("/argos/search", async (req, res) => {
    if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }
    var searchQuery = req.query.searchQuery;
    let URL = "https://www.argos.co.uk/finder-api/product;queryParams=search%3Aterm%3A"+ searchQuery +"%22%2C%22templateType%22%3Anull%7D;searchTerm="+ searchQuery+";searchType=null?returnMeta=true";
    var data = null;
    try {
        data = await axios.get(URL);
        const results = {
            data: data.data.data.response.data,
            links: data.data.data.response.links,
        };
        console.log(results)
        res.json({results})
    } catch(error) {
        const results = {
            data: [],
            links: {}
        }
        res.json({results})
    }
    
});

module.exports = router;