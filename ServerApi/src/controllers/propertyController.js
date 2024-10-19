const express = require("express");
const mongoose = require("mongoose");
const Property = require("../models/property");
const Owner = require("../models/owner");
const Booking = require("../models/booking");

exports.add = async (req, res, next) =>{
    try{
        const property = new Property(req.body);
        const ret = await property.save();
        const own = await Owner.findById(ret.owner);
        own.propertyList.push(ret._id);
        const t = await own.save();
        
        res.status(201).send(ret);
    }catch(e){
        res.status(400).send(e);
    }
}

exports.all = async(req, res, next) => {
    try{
        // console.log("no avvu joi");
        const propertys = await Property.find({status:'active'}).populate("owner");
        res.status(201).send(propertys);
    }catch(e){
        res.status(400).send(e);
    }
}

exports.oall = async(req, res, next) => {
    try{
        // console.log("aveche");
        // const owner = await Owner.findById
        const owner = await Owner.findById(req.params.id).populate("propertyList");
        // console.log(owner);
        res.status(201).send(owner.propertyList);
        
    }catch(e){
        res.status(400).send(e);
    } 
}

exports.getByid = async(req, res, next) => {
    try{
        const property = await Property.findById(req.params.id);
        res.status(201).send(property);
    }catch(e){
        res.status(400).send(e);
    } 
}

exports.del = async(req, res, next) => {
    try{
        const property = await Property.findById(req.params.id);

        if(!property)   
            res.status(404).send({message: "no property found"});
        let cur = new Date();
        bookings = await Booking.find({property: req.params.id, endDate: {$gt : cur}, status: 'current'});
        if(bookings.length !== 0){
            return res.status(404).send({message: 'Not Delete due to Bookings'});
        }
        const owner = await Owner.findById(property.owner);
        owner.propertyList.pull(property._id);
        let a= await owner.save();
        const ret = await Property.findOneAndDelete({_id:req.params.id});
        res.status(201).send({message: 'Property Deleted Successfully'});
    }catch(e){
        res.status(400).send(e);
    }
}

exports.update = async(req, res, next) => {
    try{
        const property = new Property(req.body);
        property._id = req.params.id;
        const ret =await Property.findByIdAndUpdate({_id: req.params.id},property,{new:true, upsert:true});
        res.status(201).send(ret);
    }catch(e){
        res.status(400).send(e);
    }
}

exports.availableRoom = async(req, res, next) =>{
    try{
        const {startDate, endDate} = req.body;
        const pdata = await Property.findById(req.params.id);
        const s = new Date(startDate);
        const e = new Date(endDate);

        const bookings = await Booking.find({
            property: pdata._id,
            $nor: [
                {
                    $and : [
                        {startDate : {$lt: s}},
                        {endDate: {$lte: s}}
                    ]
                },
                {
                    $and : [
                        {startDate : {$gte: e}},
                        {endDate: {$gt: e}}
                    ]
                }
            ] //this query gives all booking which are during this given date...
            });

            let availableRoom = pdata.rooms;
            bookings.map((e) => availableRoom -= e.totalRoom);
        res.send({availableRoom});

    }catch(e){
        res.status(400).send(e);
    }
}

exports.changeStatus = async(req, res, next) => {
    try{
        const property = Property.findById(req.params.id);
        if(!property)  
            res.status(500).send("not found");
        const ret = await Property.findByIdAndUpdate(req.params.id, {status: req.params.status}, {new: true});
        res.status(200).send(ret);
    }catch(e){
        res.status(400).send(e);
    }
}