const { Schema, model } = require("mongoose");

const episodeSchema = new Schema(
    {
        code: {
            type: String,
            required: true,
            trim: true,
            match: /^S\d{2}E\d{2}$/,
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        summary: {
            type: String,
            required: true,
            trim: true,
        },
        year: {
            type: Number,
            required: true,
            trim: true,
            min: 2000,
        },
        characters: {
            type: Schema.Types.ObjectId, ref: "Character"
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = model("Episode", episodeSchema);