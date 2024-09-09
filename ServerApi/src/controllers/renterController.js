const express = require("express");
const { validationResult } = require('express-validator');
const Renter = require("../models/renter");
const Owner = require("../models/owner");
const Booking = require("../models/booking");

exports.signup = async (req, res, next) => {
    try{
        const error = validationResult(req);
        if(!error.isEmpty())
            return res.status(400).send(error);
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

exports.getById = async(req, res, next) =>{
    try{
        const renter = await Renter.findById(req.params.id);
        if(!renter)
            res.status(500).send("not found user");
        res.status(200).send(renter);
    }catch(e){
        res.status(400).send(e);
    }
}

exports.del = async(req, res, next) => {
    try{
        const renter = await Renter.findById(req.params.id);
        if(!renter)
            return res.status(500).send("data not found");
        const bookings = await Booking.deleteMany({renter: req.params.id});
        const ret = await Renter.findByIdAndDelete(req.params.id);
        res.status(200).send(ret);
    }catch(e){
        res.status(400).send(e);
    }
}

exports.wishlist = async(req, res, next) => {
    try{
        const renter = await Renter.findById(req.params.rid);
        if(req.params.action == 'add'){
            renter.wishList.push(req.params.pid);
        }
        else if(req.params.action == 'remove'){
            renter.wishList.pull(req.params.pid);
        }
        const ret = await renter.save();
        res.status(201).send(ret);
    }catch(e){
        res.status(400).send(e);
    }
}

exports.triplist = async(req, res, next) => {
    try{
        const triplist = await Renter.findById(req.params.id).populate("tripList").select("tripList");
        res.send(triplist);
    }catch(e){
        res.status(400).send(e);
    }
}

exports.getBooking  =async(req, res, next) => {
    try{
        const bookings = await Booking.find({renter: req.params.id, property: req.params.pid});
        res.send(bookings);
    }catch(e){
            res.status(400).send(e);
        }
}

