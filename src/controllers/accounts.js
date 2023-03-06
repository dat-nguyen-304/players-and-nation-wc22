const Users = require("../models/users");
const fs = require('fs');
const path = require('path');
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

