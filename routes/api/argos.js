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
    let URL = 'https://www.argos.co.uk/finder-api/product;queryParams={"page":"' + req.query.pageNo + '","templateType":null};searchTerm=' + searchQuery + ';searchType=null?returnMeta=true'
    var data = null;
    try {
        data = await axios.get(URL);
        const results = {
            pageData: {
                totalData: data.data.data.response.meta.totalData,
                pageSize: data.data.data.response.meta.pageSize,
                currentPage: data.data.data.response.meta.currentPage,
                totalPages: data.data.data.response.meta.totalPages
            },
            data: data.data.data.response.data,
            links: data.data.data.response.links,
        };
        console.log(results)
        res.json({results})
    } catch(error) {
        const results = {
            pageData: {
                totalData: 0,
                pageSize: 0,
                currentPage: 1,
                totalPages: 1
            },
            data: [],
            links: {}
        }
        res.json({results})
    }
    
});

module.exports = router;