const { Schema, model } = require("mongoose");

const characterSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        img: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        age: {
            type: Number,
            required: true,
            trim: true,
            min: 0,
        },
        species: {
            type: String,
            required: true,
            trim: true,
            enum: ['humano', 'demonio', 'otro'],
            lowercase: true,
        },
        specialTraits: {
            type: [String],
            default: []
        },
        role: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        firstAppearance: {
            type: String,
            required: true,
            trim: true,
            match: /^S\d{2}E\d{2}$/, // TODO: tiene que ser un object id? puede aparecer en una temprada que no tengo como cap
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = model("Character", characterSchema);