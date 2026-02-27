require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]); // Linea necesaria ya que parece que algo de windows entra en conflicto con +srv de la uri de mongo

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    // Solo arrancamos el servidor si la BD conecta
    app.listen(PORT, () => {
        console.log(`Servidor ejecutándose en puerto ${PORT}`);
    });
});
