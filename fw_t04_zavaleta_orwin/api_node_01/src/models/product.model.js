const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    name: String,
    description: String,
    price: Number,
    stock: Number,
    department: String,
    available: Boolean,
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Propiedad virtual
productSchema.virtual("priceTaxes").get(function () {
  return this.price * 1.21;
});

// Metodo estatico
productSchema.statics.findByDepartment = function (department) {
  return this.find({ department });
};

// Metodo de la instancia
productSchema.methods.isInStock = function () {
  return this.stock > 0;
};

module.exports = model("Product", productSchema);