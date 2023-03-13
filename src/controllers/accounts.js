const Users = require("../models/users");
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
const fs = require('fs');
const path = require('path');
require('dotenv').config();

export const getProfile = async (req, res) => {
    try {
        if (req.role === 'guest') return res.redirect("/login-page");
        const user = await Users.findOne({ username: req.username });
        res.render("profile", { user, message: '', role: req.role });
    } catch (err) {
        res.status(500).json(err);
    }
};

export const updateProfile = async (req, res) => {
    try {
        if (req.role === 'user' || req.role === 'admin') {
            let user = await Users.findOne({ _id: req.body._id });
            if (user.username === req.username) {
                user.name = req.body.name;
                user.YOB = req.body.YOB;
                if (Number.parseInt(user.YOB) < 1970 || Number.parseInt(user.YOB) >= (new Date().getFullYear())) {
                    return res.render("profile", { user, message: 'Year of birth must equal or greater than 1970 and less than current year', role: req.role });
                }
                if (req.file) {
                    if (user.image !== `./default-avt.jpg`)
                        fs.unlink(`${path.resolve(__dirname, '..')}/public/${user.image}`, (err) => {
                            if (err) {
                                res.render("error500");
                            }
                        });
                    user.image = `./uploads/users/${req.file.filename}`;
                }
                await user.save();
                res.render("profile", { user, message: '', role: req.role });
            } else res.render("error403");
        } else {
            res.redirect("/login-page");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

export const getAccounts = async (req, res) => {
    try {
        if (req.role === 'user') {
            res.render("error403");
        } else if (req.role === 'guest') {
            res.redirect("/login-page");
        } else {

            const item = 3;
            let page = req.query.page ? req.query.page : 1;
            const keyword = req.query.keyword ? req.query.keyword : '';
            const totalItem = await Users.countDocuments({ name: { $regex: keyword, $options: 'i' } });
            const totalPage = Math.ceil(totalItem / item);
            if (page > totalPage) page = totalPage;
            if (page < 1) page = 1;

            let users;
            if (!keyword)
                users = await Users.find({ isAdmin: false }, '-password -isAdmin')
                    .skip((page - 1) * item)
                    .limit(item)
                    .sort({ createdAt: -1 });
            else
                users = await Users
                    .find({ name: { $regex: keyword, $options: 'i' }, isAdmin: false }, '-password -isAdmin')
                    .skip((page - 1) * item)
                    .limit(item)
                    .sort({ createdAt: -1 });

            // const users = await Users.find({ isAdmin: false }, '-password -isAdmin');
            res.render("admin", { users, role: req.role, page, keyword, totalPage });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

export const createForgotPasswordLink = async (req, res) => {
    try {
        let user = await Users.findOne({ username: req.body.username });
        if (!user) {
            return res.render("forgotPassword", { message: 'Email is incorrect. Please try again!', username: req.body.username });
        } else {
            let token = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
            user.token = token;
            user.tokenExpiredTime = (new Date()).getTime() + 60 * 1000;
            user.tokenStatus = true;

            await user.save();

            const resetLink = `http://localhost:5000/reset-password/${token}`;
            await sendResetEmail(user.username, user.name, resetLink);
            return res.redirect("/check-email");
        }
    } catch (e) {
        res.status(500).json(e);
    }
}


let sendResetEmail = async (username, name, resetLink) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'World cup 2022', // sender address
        to: username, // list of receivers
        subject: "Reset password world cup 2022", // Subject line
        html: `<h3>Hello ${name}!</h3>
        <p>You received password reset email from world cup 2022</p>
        <p>If you really want to reset password, please click the link below</p>
        <div><a href="${resetLink}" target"_blank">Click here (Expire within 1 minute)</a></div >
        <div>Best regards.</div>`
    });
}