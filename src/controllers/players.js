import { clubs, positions } from "../models/common";
import fs from "fs";
import path from "path";
const Player = require("../models/players");
const Nation = require("../models/nations");

export const getAllPlayers = async (req, res) => {
  try {
    if (req.role === 'guest') {
      return res.render('login', { username: '', message: 'You must login to see players' });
    }

    const item = 3;
    let page = req.query.page ? req.query.page : 1;
    const keyword = req.query.keyword ? req.query.keyword : '';
    const totalItem = await Player.countDocuments({ name: { $regex: keyword, $options: 'i' } });
    const totalPage = Math.ceil(totalItem / item);
    if (page > totalPage) page = totalPage;
    if (page < 1) page = 1;

    let players;
    if (!keyword)
      players = await Player.find()
        .skip((page - 1) * item)
        .limit(item)
        .populate('nation', ['name', 'image'])
        .sort({ createdAt: -1 });
    else
      players = await Player
        .find({ name: { $regex: keyword, $options: 'i' } })
        .skip((page - 1) * item)
        .limit(item)
        .populate('nation', ['name', 'image'])
        .sort({ createdAt: -1 });

    const nations = await Nation.find();
    res.render("players", { players, nations, clubs, positions, role: req.role, page, keyword, totalPage, message: '' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

export const getCaptains = async (req, res) => {
  try {
    const players = await Player.find({ isCaptain: true }).populate('nation', ['name', 'image']).sort({ createdAt: -1 });
    const nations = await Nation.find();
    res.render("captain", { players, nations, clubs, positions, role: req.role });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const addPlayer = async (req, res) => {
  try {
    const checkExistName = await Player.findOne({ name: req.body.name }).lean();
    const checkGoals = req.body.goals > 100 ? true : false;
    if (checkExistName || checkGoals) {
      fs.unlink(`${path.resolve(__dirname, '..')}/public/uploads/players/${req.file.filename}`, (err) => {
        if (err) {
          res.render("error500");
        }
      });
      if (checkExistName)
        return res.render("error", { message: 'Name of player must be unique', role: 'admin' });
      else return res.render("error", { message: 'Goals must be equals or less than 100.', role: 'admin' });
    }
    const newPlayer = new Player({ ...req.body, image: `./uploads/players/${req.file.filename}` });
    await newPlayer.save();
    res.redirect("/players");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updatePlayerPage = async (req, res) => {
  try {
    if (req.role === 'guest') return res.redirect("/login-page");

    const player = await Player.findOne({ _id: req.params.id }).populate('nation', ['_id']).lean();
    const nations = await Nation.find();
    res.render("updatePlayer", {
      player: {
        ...player,
        image: `../.${player.image}`
      }, nations, clubs, positions, role: req.role, message: ''
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updatePlayer = async (req, res) => {
  try {

    const checkExistName = await Player.findOne({ name: req.body.name }).lean();
    const checkGoals = req.body.goals > 100 ? true : false;
    if (checkExistName || checkGoals) {
      if (req.file)
        fs.unlink(`${path.resolve(__dirname, '..')}/public/uploads/players/${req.file.filename}`, (err) => {
          if (err) {
            res.render("error500");
          }
        });
      if (checkExistName)
        return res.render("error", { message: 'Name of player must be unique', role: 'admin' });
      else return res.render("error", { message: 'Goals must be equals or less than 100.', role: 'admin' });
    }

    if (!req.body.isCaptain) req.body.isCaptain = 0;
    const player = await Player.findOne({ _id: req.params.id });
    if (req.file) {
      fs.unlink(`${path.resolve(__dirname, '..')}/public/${player.image}`, (err) => {
        if (err) {
          res.render("error500");
        }
      });
      player.image = `./uploads/players/${req.file.filename}`;
    }

    player.name = req.body.name;
    player.description = req.body.description;
    player.goals = req.body.goals;
    player.nation = req.body.nation;
    player.club = req.body.club;
    player.position = req.body.position;
    player.isCaptain = req.body.isCaptain;

    await player.save();
    res.redirect("/players");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

export const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findOne({ _id: req.params.id });
    fs.unlink(`${path.resolve(__dirname, '..')}/public/${player.image}`, (err) => {
      if (err) {
        res.render("error500");
      }
    });
    player.remove();
    res.redirect("/players");
  } catch (err) {
    res.status(500).json(err);
  }
}

export const getPlayer = async (req, res) => {
  try {
    if (req.role === 'guest') redirect("/");

    const player = await Player.findOne({ _id: req.params.id }).populate('nation', ['name', 'image']).lean();
    res.render("playerDetail",
      {
        player: {
          ...player,
          image: `.${player.image}`,
          nation: {
            ...player.nation,
            image: `.${player.nation.image}`
          }
        },
        role: req.role
      });
  } catch (err) {
    res.status(500).json(err);
  }
}