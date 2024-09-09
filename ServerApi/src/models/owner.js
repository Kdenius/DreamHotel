const mongoose = require("mongoose");

const OwnerSchema = new mongoose.Schema(
    {
        firstName : {
            type: String,
            required: true,
        },
        lastName : {
            type: String,
            required: true,
        },
        email : {
            type: String,
            required : true,
            unique: true,
        },
        password: {
            type: String,
            required :true,
        },
        profilePath: {
            type: String,
            default: "",
        },
        propertyList : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }]
    },
    {timestamps: true}
);

const Owner = mongoose.model("Owner", OwnerSchema);
module.exports = Owner;