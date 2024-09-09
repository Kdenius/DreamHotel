const express  = require("express");
const { validationResult } = require('express-validator');
const Owner = require("../models/owner");

exports.signup = async (req, res, next) => {
    try{
        const error = validationResult(req);
        if(!error.isEmpty())
            return res.status(400).send(error);
        const owner = new Owner(req.body);
        const ret = await owner.save();
        res.status(201).send(ret);
    }catch(e){
        res.status(400).send(e);
    }
}

exports.login = async (req, res, next) =>{
    try{
        const {email, password} = req.body;
        const ret = await Owner.findOne({email}).populate("propertyList").populate("reservationList");
        if(!ret)
            res.status(404).send("user not found !");
        if(password !== ret.password)
            res.status(401).send("password mismatch");
        res.status(200).send(ret);
    }catch(e){
        res.status(400).send(e);
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

