var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var encrypt = require('../middleware/encrypt');
var bcrypt = require('bcrypt');
var authenticate = require('../middleware/authenticate');
var mailer = require('../middleware/mailer');
var validate_email = require('../middleware/validate_email');


mongoose.Promise = global.Promise;
var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.on('error', function(err) {
    console.log('Err connecting to DB.')
    console.log(err);
    return;
  });

/* Objects */
var User = require('../model/user');

/**
 * All user related routes
 */
router.get("/", function (req, res) {
    res.send('This route is for all user related tasks');
});

/**
 * Get account information
 */
router.get("/account", authenticate, (req, res) => {
    res.status(200).send(req.user);
    return;
});

/*
 * Register new user
 */
router.post("/register", (req, res) => {
    if (!req.body.email || !req.body.password || !req.body.username) {
        res.status(400).send({ message: "User data is incomplete" });
        return;
    }

    if (req.body.password.length < 8) {
        res.status(400).send({ message: "Password must be at least 8 character long"});
        return;
    }

    if (req.body.username.length < 6) {
        res.status(400).send({ message: "Username must be at least 6 character long"});
        return;
    }

    encrypt(req.body.password).then((password) => {
        // User Data
        var newUser = new User({
            username: req.body.username,
            password: password,
            email: {
                properties: {
                    value: req.body.email,
                    hidden: false
                }
            }
        });

        var newMemberEmailBody = "Dear " + req.body.username +
            ",\n\nWelcome! We look forward to having you with us!\n\nSincerely, \nThe Team";
        var newMemberEmailSubject = "Welcome!";

        // Add to database with auth
        newUser.save().then(() => {
            return newUser.generateAuth().then((token) => {

                res.header('token', token).send(newUser);
                mailer(req.body.email, newMemberEmailSubject, newMemberEmailBody);
                return;
            });
        }).catch((err) => {
            if (err.code == 11000) {
                res.status(400).send({ message: "User already exists" });
                return;
            } else if (err.message.includes("invalid email")) {
                res.status(400).send({ message: "Invalid email"});
                return;
            } 
            res.status(400).send(err);
            return;
        });
    });
});

/**
 * User login 
 */
router.post('/login', (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).send({ message: "User data is incomplete" });
        return;
    }

    User.findOne({ username: req.body.username }).then((user) => {

        if (!user) {
            res.status(400).send({ message: "Error: User does not exist, register before logging in" });
            return;
        }
        
        bcrypt.compare(req.body.password, user.password, function (err, comp) {
            if (!comp) {
                res.status(400).send({ message: "Error: Password is incorrect" });
                return;
            } else {
                user.generateAuth().then((token) => {
                    res.status(200).header('token', token).send(user);
                    return;
                }).catch((err) => {
                    res.status(400).send(err);
                    return;
                });
            }
        });
    }).catch((err) => {
        res.status(400).send({ message: 'MongoDB Error' });
        return;
    });
});

/**
 * Reset Password if forgotten
 */
router.post("/forgot-password", (req, res) => {
    if (!req.body || !req.body.email) {
        res.status(400).send({ message: 'Reset information is incomplete' });
        return;
    }

    if (!validate_email(req.body.email)) {
        res.status(400).send({ message: 'Invalid email' });
        return;
    }
    // Find user by email
    if (req.body.email) {
        User.findByEmail(req.body.email).then((usr) => {
            var tempPassword = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            var email_subject = "Password Reset";
            var email_body = "Dear " + usr.email + ", \n\nOur records indicate that you have requested a password " +
                "reset. Your new temporary password is:\n\n" +
                tempPassword + "\n\nSincerely, \n\nThe Team";
            // find user by email and set temp password
            encrypt(tempPassword).then((encryptedPassword) => {
                User.findOneAndUpdate({ email: usr.email }, { $set: { password: encryptedPassword } }).then(() => {
                }).catch((err) => {
                    res.status(400).send({ message: "New password not set." });
                });
            }).catch(err => {
                console.log("Something went wrong")
            });
            // Send email to user
            mailer(usr.email, email_subject, email_body);
            res.status(200).send({ message: 'Password has successfully been reset.' });
        }).catch((err) => {
            res.status(400).send({ message: 'Email does not exist in our records.' });
            return;
        });
    }
})

/**
 * Edit a user's email
 */
router.post("/change-email", authenticate, (req, res) => {


    if (!req.body || !req.body.email) {
        res.status(400).send({ message: "User data is incomplete" });
        return;
    }

    if (!validate_email(req.body.email)) {
        res.status(400).send({ message: "Invalid email" });
        return;
    }

    User.findOneAndUpdate({ username: req.user.username },
        {
            $set: {
                email: {
                    properties: {
                        value: req.body.email,
                        hidden: false
                    }
                }
            }
        }).then(() => {
            res.status(200).send({ message: 'User email successfully updated' })
        }).catch((err) => {
            console.log(err.codeName)

            if (err.codeName == "DuplicateKey") {
                res.status(400).send({ message: "Duplicate Found" });
            }
            else {
                res.status(400).send({ message: "Fatal Error" });
            }
            return;
        })

    var email_subject = "Reset Email";
    var email_body = "Dear " + req.user.username + ", \n\nOur records indicate that you have changed your email. If this was the intention, no further action is needed from your part." +
        "\n\nSincerely, \n\nThe Team";

    mailer(req.body.email, email_subject, email_body);
})

/** 
 * Change Password
 */
router.post("/change-password", authenticate, (req, res) => {

    if (!req.body || !req.body.password) {
        res.status(400).send({ message: "User information incomplete" })
        return
    }

    var username = req.user.username;
    var newPassword = req.body.password;

    encrypt(newPassword).then(encryptedPassword => {
        User.findOneAndUpdate({ username: username }, { $set: { password: encryptedPassword } }).then(() => {
            res.status(200).send({ message: "User password successfully updated." })
        }).catch((err) => {
            res.status(400).send({ message: "New password not set." });
            res.send(err);
        });
    }).catch(err => {
        console.log("err: " + err)
    });

    var email_subject = "Changed Password";
    var email_body = "Dear " + username + ", \n\nOur records indicate that you have changed your password. If this was the intention, no further action is needed from your part." +
        "\n\nSincerely, \n\nThe Team";

    mailer(req.user.email, email_subject, email_body);
})


module.exports = router;