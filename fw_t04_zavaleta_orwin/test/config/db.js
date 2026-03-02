const mongoose = require("mongoose");

async function connectDB() {
    try {
        console.log('---',process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
         //recuerda dotenv solo necesita ejecutarse una vez al arrancar la aplicación 
        console.log("MongoDB conectado correctamente");
    } catch (error) {
        console.error("Error conectando a MongoDB:", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;
