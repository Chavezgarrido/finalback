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
const port = process.env.PORT || 10000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes); 
app.use('/api/producto', productRoutes); 
app.use('/api/cart', cartRoutes); 
app.use('/api/categoria', categoryRoutes); 
app.use('/api/pedido', orderRoutes); 
app.use('/api/usuario', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
