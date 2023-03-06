const Users = require("../models/users");
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const saltRounds = 10;
require('dotenv').config();
export const register = async (req, res) => {
    try {

        const { username, password, confirmPassword } = req.body;
        const message = [];

        const userFound = await Users.findOne({ username });
        if (userFound) {
            console.log("userFound: ", userFound);
            message.push('Email is already exist! Please use another email');
        }

        if (password.length < 6) message.push('Password must be at least 6 characters');
        if (confirmPassword != password) message.push('Confirm password must be equal password');
        if (message.length === 0) {

            bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                req.body.password = hash;
                const user = new Users({ ...req.body, image: `./default-avt.jpg` });
                user.save();
                res.render("register", { message: 'Register successful', type: 'success', username: '', password: '', confirmPassword: '', name: '', YOB: '' });
            });
        }
        else {
            res.render("register", { message, ...req.body, type: 'warning' });
        }
    } catch (e) {
        res.status(500).json(e);
    }
    res.status
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const userFound = await Users.findOne({ username });

        if (userFound) {
            const token = jwt.sign({ username: userFound.username, isAdmin: userFound.isAdmin }, process.env.ACCESS_TOKEN_KEY);
            bcrypt.compare(password, userFound.password).then(function (result) {
                if (result) {
                    const path = userFound.isAdmin ? '/accounts' : '/';
                    res.cookie("access_token", token, {
                        httpOnly: true,
                    }).redirect(path);
                } else res.render("login", { message: 'Wrong username or password!', username });
            });
        } else {
            res.render("login", { message: 'Wrong username or password!', username });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json(e);
    }
}

export const logout = (req, res) => {
    res.clearCookie("access_token");
    res.redirect("/login-page");
}

export const changePassword = async (req, res) => {
    try {
        const { password, newPassword, confirmPassword } = req.body;
        const userFound = await Users.findOne({ username: req.username });
        if (newPassword.length < 6) {
            res.render("profile", { user: userFound, message: 'Password must be at least 6 characters', role: req.role });
        }

        if (newPassword === password) {
            res.render("profile", { user: userFound, message: 'New password should be different from old password', role: req.role });
        }

        if (userFound) {
            bcrypt.compare(password, userFound.password).then(function (result) {
                if (result) {
                    if (newPassword === confirmPassword) {
                        bcrypt.hash(newPassword, saltRounds, async function (err, hash) {
                            await Users.updateOne({ username: req.username }, { $set: { password: hash } });
                            res.clearCookie("access_token");
                            res.render("login", { message: 'Change password successfully!', username: req.username });
                        });
                    } else {
                        res.render("profile", { user: userFound, message: 'Password must be equal confirm password', role: req.role });
                    }
                } else res.render("profile", { user: userFound, message: 'Your password is wrong!', role: req.role });
            });
        } else {
            res.render("login", { message: 'Wrong username or password!', username });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json(e);
    }
}

export const aboutUs = (req, res) => {
    try {
        if (req.role === 'guest') return res.redirect("/login-page");
        res.render("home", { role: req.role });
    } catch (err) {
        res.status(500).json(err);
    }
}

export const loginPage = (req, res) => {
    try {
        if (req.role === 'guest')
            res.render("login", { message: '', username: '' });
        else res.redirect("/")
    } catch (err) {
        res.status(500).json(err);
    }
}

export const registerPage = (req, res) => {
    try {
        if (req.role === 'guest')
            res.render("register", { message: '', username: '', password: '', confirmPassword: '', name: '', YOB: '', type: '' });
        else res.redirect("/")
    } catch (err) {
        res.status(500).json(err);
    }
}