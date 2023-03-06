const Nations = require("../models/nations");
const Players = require("../models/players");

const fs = require('fs');
const path = require('path');
export const getAllNations = async (req, res) => {
  try {
    if (req.role === 'guest') {
      return res.render('login', { username: '', message: 'You must login to see nations' });
    }
    const item = 3;
    let page = req.query.page ? req.query.page : 1;
    const keyword = req.query.keyword ? req.query.keyword : '';
    const totalItem = await Nations.countDocuments({ name: { $regex: keyword, $options: 'i' } });
    const totalPage = Math.ceil(totalItem / item);
    if (page > totalPage) page = totalPage;
    if (page < 1) page = 1;

    let nations;
    if (!keyword)
      nations = await Nations.find()
        .skip((page - 1) * item)
        .limit(item)
        .sort({ createdAt: -1 });
    else
      nations = await Nations
        .find({ name: { $regex: keyword, $options: 'i' } })
        .skip((page - 1) * item)
        .limit(item)
        .sort({ createdAt: -1 });

    res.render("nations", { nations, role: req.role, page, keyword, totalPage });
  } catch (e) {
    (500).json(err);
  }
  res.status
}

export const addNation = async (req, res) => {
  try {
    const checkExistName = await Nations.findOne({ name: req.body.name }).lean();
    if (checkExistName) {
      fs.unlink(`${path.resolve(__dirname, '..')}/public/uploads/nations/${req.file.filename}`, (err) => {
        if (err) {
          res.render("error500");
        }
      });
      return res.render("error", { message: 'Name of nation must be unique', role: 'admin' });
    }

    const newNation = new Nations({ ...req.body, image: `./uploads/nations/${req.file.filename}` });
    await newNation.save();
    res.redirect("/nations");
  } catch (e) {
    res.status(500).json(e);
  }
}

export const deleteNation = async (req, res) => {
  try {
    const nation = await Nations.findOne({ _id: req.params.id });
    const existPlayer = await Players.findOne({ nation: req.params.id });
    if (existPlayer) {
      return res.render("error", { message: 'Can not delete because of players', role: 'admin' });
    }
    fs.unlink(`${path.resolve(__dirname, '..')}/public/${nation.image}`, (err) => {
      if (err) {
        res.render("error500");
      }
    });
    nation.remove();
    res.redirect("/nations");
  } catch (e) {
    res.status(500).json(e);
  }
}

export const updateNationPage = async (req, res) => {
  try {
    if (req.role === 'guest') return res.redirect("/login-page");
    const nation = await Nations.findOne({ _id: req.params.id }).lean();
    res.render("updateNation", { nation: { ...nation, image: `../.${nation.image}` }, role: req.role });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateNation = async (req, res) => {
  try {
    const checkExistName = await Nations.findOne({ name: req.body.name }).lean();
    if (checkExistName) {
      if (req.file)
        fs.unlink(`${path.resolve(__dirname, '..')}/public/uploads/nations/${req.file.filename}`, (err) => {
          if (err) {
            res.render("error500");
          }
        });
      return res.render("error", { message: 'Name of nation must be unique', role: 'admin' });
    }

    const nation = await Nations.findOne({ _id: req.params.id });
    if (req.file) {
      fs.unlink(`${path.resolve(__dirname, '..')}/public/${nation.image}`, (err) => {
        if (err) {
          res.render("error500");
        }
      });
      nation.image = `./uploads/nations/${req.file.filename}`;
    }

    nation.name = req.body.name;
    nation.description = req.body.description;
    await nation.save();

    res.redirect("/nations");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

export const getNation = async (req, res) => {
  try {
    if (req.role === 'guest') redirect("/");

    const nation = await Nations.findOne({ _id: req.params.id }).lean();

    res.render("nationDetail", {
      nation: {
        ...nation,
        image: `.${nation.image}`,
      },
      role: req.role
    });
  } catch (error) {
    res.status(500).json(err);
  }
}