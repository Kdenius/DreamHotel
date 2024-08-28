const express = require("express");
const Renter = require("../models/renter");

exports.signup = async (req, res, next) => {
    try{
        const renter = new Renter(req.body);
        const ret = await renter.save();
        res.status(201).send(ret);
    }catch(e){
        res.status(400).send(e);
    }
}

exports.login = async(req, res, next) =>{
    try{

        const {email, password} = req.body;
        const ret =await Renter.findOne({email}).populate("wishList").populate("tripList");
        if(!ret)
            res.status(404).send("user not found !");
        if(password !== ret.password)
            res.status(401).send("password mismatch");
        res.status(200).send(ret);
    }catch(e){
        res.status(400).send(e);
    }
}
