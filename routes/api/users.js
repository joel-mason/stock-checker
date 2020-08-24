const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const axios = require('axios');
const cron = require("node-cron");
let nodemailer = require("nodemailer");
var dateTime = require('node-datetime');
const crypto = require('crypto');
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateAddItemInput = require("../../validation/addItem");
const validateAuthorization = require("../../validation/authorization");
const validateForgotPassword = require("../../validation/forgotPassword");
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
        let URL = "https://www.argos.co.uk/stores/api/orchestrator/v0/locator/availability?origin="+POST_CODE+"&skuQty="+item.productCode.replace('/', '')+"_1&maxResults=3&maxDistance=50&save=pdp-ss%3Ass&ssm=true";
        var data = null;
        try {
            data = await axios.get(URL);
            const newRet = {
                userId: item.userId,
                productName: item.productName,
                productCode: item.productCode,
                productPrice: item.price,
                lastEmailed: item.lastEmailed
            };
            data.data.stores.forEach(function(store, index) {
                if(store.availability !== null) {
                    newRet['store'+index] = store.availability[0].quantityAvailable > 0;
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
                store0: true,
                store1: true,
                store2: true
            }
        }
 
    });
    data.items = await Promise.all(promises)
    return data;
}
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: keys.email, // generated ethereal user
      pass: keys.emailPassword, // generated ethereal password
    },
});
  // sending emails at periodic intervals
  cron.schedule("*/30 * * * *", async function(){
    console.log("---------------------");
    console.log("Running Cron Job");
    var users = await User.find();
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d');
    var today = new Date(formatted);
    await asyncForEach(users, async (user) => {
        var user = user;
        var inStockItems = [];
        var items = await Item.find({ userId: user._id, $or: [{ lastEmailed: null }, { lastEmailed: { $lt: today } }]})
       await asyncForEach(items, async (item) => {
            const POST_CODE = user.postcode.replace(/\s/g, '');
            var PRODUCT_CODE = item.productCode.replace('/', '');
            const URL = "https://www.argos.co.uk/stores/api/orchestrator/v0/locator/availability?origin="+POST_CODE+"&skuQty="+PRODUCT_CODE+"_1&maxResults=3&maxDistance=50&save=pdp-ss%3Ass&ssm=true";
            var retData = null;
            try {
                var resp = await axios.get(URL)
                retData = resp.data
                var inStockItem = {
                    productName: item.productName,
                    productCode: item.productCode,
                    inStock: false,
                    stores : []
                }
                await asyncForEach(retData.stores, async (store) => {
                    if(store.availability !== null) {
                        if(store.availability[0].quantityAvailable > 0) {
                            inStockItem.inStock = true
                            inStockItem.stores.push(store.storeinfo.legacy_name);
                        }
                    }
                })
                if(inStockItem.inStock === true) {
                    inStockItems.push(inStockItem);
                }
            } catch(err) {
                console.error("Argos API Error");
            }
            
        })
        if(inStockItems.length > 0) {
            var html = '<b>Items in stock</b><br>';
            var text = ''
            var productCodes = [];
            await asyncForEach(inStockItems, async(inStockItem) => {
                html+='<b>Item:</b> ' + inStockItem.productName + '<br><b>In stock in: </b><br>';
                text+="item: " + inStockItem.productName + ' In stock in: ';
                inStockItem.stores.forEach(function(store) {
                    html+= 'Store: ' + store + "<br>";
                    text+= 'Store: ' + store + " ";
                })
                productCodes.push(inStockItem.productCode);
            })
            let mailOptions = {
                from: '"Stock Checker 👻" <stock.checker.app.2020@gmail.com>',
                to: user.email,
                subject: `Stock Alert!`,
                text: text,
                html: html
            };
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email successfully sent!");
                    console.log("userId", user._id, "productCode", Array.from(productCodes))
                    Item.updateMany(
                        { 
                            userId: user._id, 
                            productCode: { 
                                $in: Array.from(productCodes) 
                            }
                        }, 
                        {
                            $set : {
                                "lastEmailed" : today
                            }
                        }
                    ).then(result => {
                        console.log("modified records for " + user._id, result.nModified);
                    })
                    .catch(err => {
                        console.error("error updating record for userId: " + user._id);
                    })
                }
            });
        }
    });
    console.log("Finished Cron Job");
    console.log("---------------------");
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

router.post("/forgotPassword", (req, res) => {
    const { errors, isValid } = validateForgotPassword(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    console.log(req.get('host'))
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            return res.status(400).json({ email: "Email doesn't exist" });
        } else {
            const token = crypto.randomBytes(20).toString('hex');
            console.log(user.email)
            User.updateOne({
                email: user.email
            },
            {
                $set : {
                    "resetPasswordToken": token,
                    "resetPasswordExpires": Date.now() + 3600000 
                }
            }).then(rett => {
                console.log(rett)
                let mailOptions = {
                    from: '"Stock Checker 👻" <stock.checker.app.2020@gmail.com>',
                    to: user.email,
                    subject: `Link to Reset Password`,
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
                            + 'Please click the following link, or paste this into your browser to complete the process within one hour of receiving in:\n\n'
                            + (req.body.hostname || 'http://' + req.get('host')) + '/reset/' + token + '\n\n'
                            + 'If you did not request this, please ignore this email and your password will remain unchanged'
                };
                transporter.sendMail(mailOptions, function(error, info) {
                    if(error) {
                        console.error('there was an error: ', error);
                        res.status(500).send({message: 'something went wrong, please try again'});
                    } else {
                        res.status(200).send({message: 'recovery email sent'})
                    }
                });
            })
            
        }
    });
})

router.get("/reset", (req, res) => {
    console.log(req.query.token)
    User.findOne({
        resetPasswordToken: req.query.token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    }).then(user => {
        if(user === null) {
            res.status(400).send({invalid: 'password reset link is invalid or has expired'});
        } else {
            res.status(200).send({
                email: user.email,
                message: 'password reset link good'
            });
        }
    })
    .catch(err => {
        res.json(err);
    });
});

router.put("/resetPasswordWithEmail", (req, res) => {
    const { errors, isValid } = validateForgotPassword(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({
        email: req.body.email
    }).then(user => {
        if(user !== null) {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                    if (err) throw err;
                    User.updateOne({
                        email: user.email
                    },
                    {
                        $set : {
                            "password": hash,
                            "resetPasswordToken": null,
                            "resetPasswordExpires": null 
                        }
                    }).then(resp => {
                        res.status(200).send({message: 'password updated!'})
                    }).catch(err => {
                        res.status(500).send({message: "something went wrong"})
                    });
                    
                });
            });
        } else {
            res.status(404).send({message: 'no user exists for email'});
        }
    })
})

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
    console.log(req.body)
    var item = await Item.findOne({ userId: auth.user.id, productCode: req.body.id })
    if (item) {
        return res.status(400).json({ email: "Item already being watched" });
    } else {
        console.log(req.body.attributes.price)
        const newItem = new Item({
            userId: auth.user.id,
            productCode: req.body.id,
            productName: req.body.attributes.name,
            productPrice: req.body.attributes.price,
            lastEmailed: new Date("1970-01-01")
        });
        // Hash password before saving in database
        var ret = await newItem.save();
        console.log(ret);
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
    var data = await getStockDetails(auth.user);
    res.json({data});
    
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