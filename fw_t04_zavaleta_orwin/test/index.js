require("dotenv").config();

// const app = require("./src/app");
const connectDB = require("./config/db");
//require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]); 

const PORT = process.env.PORT || 3000;

console.log(process.env.MONGO_URI);
connectDB().then(() => {
    console.log("Conectado");
    
    // Solo arrancamos el servidor si la BD conecta
    // app.listen(PORT, () => {
    //     console.log(`Servidor ejecutándose en puerto ${PORT}`);
    // });
});
