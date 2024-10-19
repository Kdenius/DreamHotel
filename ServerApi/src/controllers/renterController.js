const express = require("express");
const { validationResult } = require('express-validator');
const Renter = require("../models/renter");
const Owner = require("../models/owner");
const Booking = require("../models/booking");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();



exports.signup = async (req, res, next) => {
    try{
        const error = validationResult(req);
        if(!error.isEmpty())
            return res.status(400).send(error);

        const { password, ...otherDetails } = req.body;
        let hashedPassword = await bcrypt.hash(password, 13);
        const renter = new Renter({
            ...otherDetails,
            password: hashedPassword
        });

        const ret = await renter.save();

        // const data = {
        //     user:{
        //         _id:ret._id
        //     }
        // }
        const authToken = jwt.sign({_id : ret._id, isRenter : true}, process.env.JWT_SECRET);

        res.status(201).send({user:ret, authToken:authToken});
    }catch(e){
        res.status(400).send(e);
    }
}

exports.login = async(req, res, next) =>{
    try{

        const {email, password} = req.body;
        const ret = await Renter.findOne({email});
        if(!ret)
            return res.status(400).send("user not found !");
        let isValidPassword = false;
        isValidPassword = await bcrypt.compare(password, ret.password);
        if(!isValidPassword)
            return res.status(401).send("password mismatch");
        // const retf =await Renter.findOne({email}).populate("wishList").populate("tripList");
        // const data = {
        //     user:{
        //         _id:ret._id
        //     }
        // }
        const authToken = jwt.sign({_id : ret._id, isRenter : true}, process.env.JWT_SECRET);

        res.status(201).send({user:ret, authToken:authToken});
        // res.status(200).send(retf);
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
            if(renter.wishList.indexOf(req.params.pid) === -1)
                renter.wishList.push(req.params.pid);
            else 
                return res.status(201).json({message: 'already in WishList'});
        }
        else if(req.params.action == 'remove'){
            renter.wishList.pull(req.params.pid);
        }
        const ret = await renter.save();
        res.status(201).send({message: 'removed from WishList'});
    }catch(e){
        res.status(400).send(e);
    }
}

exports.triplist = async(req, res, next) => {
    try{
        // const triplist = await Renter.findById(req.params.id, 'tripList -_id',).populate("tripList").populate("property");
        const triplist = await Renter.findById(req.params.id, 'tripList -_id')
            .populate({
                path: 'tripList',
                populate: {
                    path: 'property', // Populate the property field in Booking
                }
            });
            console.log(triplist);
        res.send(triplist);
    }catch(e){
        res.status(400).send(e);
    }
}

exports.getWishlist = async(req, res, next) => {
    try{
        const wishlist = await Renter.findById(req.params.rid, 'wishList -_id',).populate("wishList");
        res.send(wishlist);
        // console.log(wishlist);
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

