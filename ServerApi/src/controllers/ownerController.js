const express  = require("express");
const { validationResult } = require('express-validator');
const Owner = require("../models/owner");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();



exports.signup = async (req, res, next) => {
    try{
        const error = validationResult(req);
        if(!error.isEmpty())
            return res.status(400).send(error);

        const {password, ...otherDetails} = req.body;
        let hashedPassword = await bcrypt.hash(password, 13);
        const owner = new Owner({
            ...otherDetails,
            password: hashedPassword
        });

        const ret = await owner.save();
        console.log("pogeche");
        const authToken = jwt.sign({_id : ret._id, isRenter : false}, process.env.JWT_SECRET);

        res.status(201).send({user:ret, authToken:authToken});
        // res.status(201).json(ret);
    }catch(e){
        res.status(400).json(e);
    }
}

exports.login = async (req, res, next) =>{
    try{
        const {email, password} = req.body;
        const ret = await Owner.findOne({email}).populate("propertyList");
        if(!ret)
            res.status(404).send("user not found !");
        let isValidPassword = false;
    isValidPassword = await bcrypt.compare(password, ret.password);
        if(!isValidPassword)
            res.status(401).send("password mismatch");

        const authToken = jwt.sign({_id : ret._id, isRenter : false}, process.env.JWT_SECRET);

        res.status(201).send({user:ret, authToken:authToken});
        // res.status(200).json(ret);
    }catch(e){
        res.status(400).json(e);
    }
}

exports.all = async (req, res, next) =>{
    try{
        const owners = await Owner.find();
        res.status(201).send(owners);
    }catch(e){
        res.status(400).send(e);
    }
}

exports.getByid = async (req, res, next) =>{
    try{
        const owner = await Owner.findById(req.params.id);
        res.status(201).send(owner);
    }catch(e){
        res.status(400).send(e);
    }
}

