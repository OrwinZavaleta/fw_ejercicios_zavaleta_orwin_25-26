const { Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
        username: String,
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        cart: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    },
    { timestamps: true, versionKey: false }
);

module.exports = model("User", userSchema);