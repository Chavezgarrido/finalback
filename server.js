// server.js
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes'); 
const productRoutes = require('./routes/productRoutes'); 
const cartRoutes = require('./routes/cartRoutes'); 
const categoryRoutes = require('./routes/categoryRoutes'); 
const orderRoutes = require('./routes/orderRoutes'); 
const userRoutes = require('./routes/userRoutes'); 

const app = express();
const port = process.env.PORT || 5000;

// Crear el cliente de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/auth', authRoutes); // No pasar supabase aquí
app.use('/api/producto', productRoutes); // No pasar supabase aquí
app.use('/api/cart', cartRoutes); // No pasar supabase aquí
app.use('/api/categoria', categoryRoutes); // No pasar supabase aquí
app.use('/api/pedido', orderRoutes); // No pasar supabase aquí
app.use('/api/usuario', userRoutes); // No pasar supabase aquí

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});