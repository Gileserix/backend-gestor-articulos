require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Conectado a MongoDB");
}).catch((error) => {
  console.error("Error al conectar a MongoDB:", error);
});

const ProductSchema = new mongoose.Schema({
  name: String,
});

const Product = mongoose.model("Product", ProductSchema);

// Obtener todos los productos
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Agregar un nuevo producto
app.post("/api/products", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "El nombre del producto es obligatorio" });
  }
  try {
    const newProduct = new Product({ name });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar producto" });
  }
});

// Eliminar un producto por ID
app.delete("/api/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});