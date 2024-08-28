const { default: mongoose } = require("mongoose");

const PropertySchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Owner',
        },
        status: {
            type: String,
            default: "pending",
        },
        address: {
            streetAddress: {
                type: String,
                required: true,
            },
            pincode: {
                type: Number,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
            },
            country: {
                type: String,
                required: true,
            },
        },
        resources: {
            type: Array,
            default: [],
        },
        rooms: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
        },
        photos: [{type: String}],
        description: {
            type: String,
            required: true,
        },
        categorie: {
            type: [String],
            required: true,
        }
    },
    {timestamps : true}
);

const Property = mongoose.model("Property",PropertySchema);
module.exports = Property;