const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const axios = require('axios');
const cron = require("node-cron");
let nodemailer = require("nodemailer");
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

async function getStockDetails(user) {
    const POST_CODE = user.postcode.replace(/\s/g, '');
    var URL = "https://www.argos.co.uk/stores/api/orchestrator/v0/locator/availability?origin="+POST_CODE+"&skuQty="+1234567+"_1&maxResults=3&maxDistance=50&save=pdp-ss%3Ass&ssm=true";
    var retData = null;
    var resp = await axios.get(URL);
    retData = resp.data
    var data = {
        stores: retData.stores.map((store, index) => {
            return {
                "storeId": index,
                ["store"]: store.storeinfo.legacy_name
            };
        }),
        items: []
    };
    var items = await Item.find({ userId: user.id}).select(["-_id", "-__v"]);
    var promises = items.map( async (item, index) => {
        const POST_CODE = user.postcode.replace(/\s/g, '');
        let URL = "https://www.argos.co.uk/stores/api/orchestrator/v0/locator/availability?origin="+POST_CODE+"&skuQty="+item.productCode+"_1&maxResults=3&maxDistance=50&save=pdp-ss%3Ass&ssm=true";
        var data = null;
        try {
            data = await axios.get(URL);
            const newRet = {
                userId: item.userId,
                productName: item.productName,
                productCode: item.productCode
            };
            data.data.stores.forEach(function(store, index) {
                if(store.availability !== null) {
                    newRet['store'+index] = store.availability.quantityAvailable > 0;
                } else {
                    newRet['store'+index] = false;
                }
            })
            return newRet;
        } catch(error) {
            return {
                userId: item.userId,
                productName: item.productName,
                productCode: item.productCode,
                store0: false,
                store1: false,
                store2: false
            }
        }
 
    });
    data.items = await Promise.all(promises)
    return data;
}
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: 'stock.checker.app.2020@gmail.com', // generated ethereal user
      pass: 'Lobster!40993', // generated ethereal password
    },
});
  // sending emails at periodic intervals
  cron.schedule("* * * * *", async function(){
    console.log("---------------------");
    console.log("Running Cron Job");
    var users = await User.find();
    users.forEach(async function(user) {
        var user = user;
        var inStockItems = [];
        var items = await Item.find({ userId: user._id})
       await asyncForEach(items, async (item) => {
            const POST_CODE = user.postcode.replace(/\s/g, '');
            var PRODUCT_CODE = item.productCode;
            const URL = "https://www.argos.co.uk/stores/api/orchestrator/v0/locator/availability?origin="+POST_CODE+"&skuQty="+PRODUCT_CODE+"_1&maxResults=3&maxDistance=50&save=pdp-ss%3Ass&ssm=true";
            var retData = null;
            var resp = await axios.get(URL)
            retData = resp.data
            await asyncForEach(retData.stores, async (store) => {
                if(store.availability !== null) {
                    if(store.availability[0].quantityAvailable > 0) {
                        inStockItems.push({productName: item.productName, productCode: item.productCode, store: store.storeinfo.legacy_name});
                    }
                }
            })
        })
        console.log(inStockItems);
        if(inStockItems.length > 0) {
            var html = '<b>Items in stock</b><br>';
            var text = ''
            inStockItems.forEach(function(inStockItem) {
                html+='<b>Item: ' + inStockItem.productName + '</b> In stock in: ' + inStockItem.store + '<br>';
                text+="item: " + inStockItem.productName + ' In stock in: ' + inStockItem.store + ' ';
            })
            let mailOptions = {
                from: '"Stock Checker 👻" <stock.checker.app.2020@gmail.com>',
                to: "joeldavidmason@gmail.com",
                subject: `Stock Alert!`,
                text: text,
                html: html
            };
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email successfully sent!");
                }
            });
            console.log("Finished Cron Job");
            console.log("---------------------");
        }
    });
  });

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        } else {
            const newUser = new User({
                name: req.body.name,
                postcode: req.body.postcode,
                email: req.body.email,
                password: req.body.password
            });
            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    User.findOne({ email }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ emailnotfound: "Email not found" });
        }
        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    name: user.name,
                    postcode: user.postcode
                };
                // Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({ passwordincorrect: "Password incorrect" });
            }
        });
    });
});

// @route POST api/users/:userId/items/addItem
// @desc Add item
// @access Private
router.post("/:userId/items", async (req, res) => {
    //header validation
    var auth = validateAuthorization(req);
    if(auth.status !== 200) {
        return res.status(auth.status).json({ message: auth.message });
    }
    
    // Form validation
    const { errors, isValid } = validateAddItemInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    var item = await Item.findOne({ userId: auth.user.id, productCode: req.body.productCode })
    if (item) {
        return res.status(400).json({ email: "Item already being watched" });
    } else {
        const newItem = new Item({
            userId: auth.user.id,
            productCode: req.body.productCode,
            productName: req.body.productName
        });
        // Hash password before saving in database
        var ret = await newItem.save();
        var data =  await getStockDetails(auth.user);
        res.json({data});
            
    }
});

// @route GET api/users/:userId/items
// @desc Add item
// @access Private
router.get("/:userId/items", async (req, res) => {
    var auth = validateAuthorization(req);
    if(auth.status !== 200) {
        return res.status(auth.status).json({ message: auth.message });
    }
    const POST_CODE = auth.user.postcode.replace(/\s/g, '');
    var URL = "https://www.argos.co.uk/stores/api/orchestrator/v0/locator/availability?origin="+POST_CODE+"&skuQty="+1234567+"_1&maxResults=3&maxDistance=50&save=pdp-ss%3Ass&ssm=true";
    var retData = null;
    var resp = await axios.get(URL);
    retData = resp.data
    var data = {
        stores: retData.stores.map((store, index) => {
            return {
                "storeId": index,
                ["store"]: store.storeinfo.legacy_name
            };
        }),
        items: []
    };
    var items = await Item.find({ userId: auth.user.id}).select(["-_id", "-__v"]);
    var promises = items.map( async (item, index) => {
        const POST_CODE = auth.user.postcode.replace(/\s/g, '');
        let URL = "https://www.argos.co.uk/stores/api/orchestrator/v0/locator/availability?origin="+POST_CODE+"&skuQty="+item.productCode+"_1&maxResults=3&maxDistance=50&save=pdp-ss%3Ass&ssm=true";
        var data = null;
        try {
            data = await axios.get(URL);
            const newRet = {
                userId: item.userId,
                productName: item.productName,
                productCode: item.productCode
            };
            data.data.stores.forEach(function(store, index) {
                if(store.availability !== null) {
                    newRet['store'+index] = store.availability.quantityAvailable > 0;
                } else {
                    newRet['store'+index] = false;
                }
            })
            return newRet;
        } catch(error) {
            return {
                userId: item.userId,
                productName: item.productName,
                productCode: item.productCode,
                store0: false,
                store1: false,
                store2: false
            }
        }
 
    });
    data.items = await Promise.all(promises)
    res.json({data})
    
});

// @route DELETE api/users/:userId/items/:itemId
// @desc Delete item
// @access Private
router.delete("/:userId/items/", async (req, res) => {
    var auth = validateAuthorization(req);
    if(auth.status !== 200) {
        return res.status(auth.status).json({ message: auth.message });
    }
    if(req.body.products.length === 1 && req.body.products[0] === 'all') {
        var item = await Item.deleteMany({
            userId: auth.user.id,
        });
        var data =  await getStockDetails(auth.user);
        res.json({data});
    } else {
        var item = await Item.deleteMany({
            userId: auth.user.id,
            productCode: { $in: Array.from(req.body.products) }
        })
        var data =  await getStockDetails(auth.user);
        res.json({data});
    }
    
});



module.exports = router;