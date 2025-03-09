// controllers/productController.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.getProductById = async (req, res) => {
    const { id } = req.params; // ID del producto

    try {
        const { data: producto, error } = await supabase
            .from('Productos') // Asegúrate de que esta tabla exista
            .select('*')
            .eq('id', id)
            .single(); // Obtener un solo registro

        if (error) {
            if (error.code === 'PGRST116') { // PGRST116 significa que no se encontró el registro
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            return res.status(500).json({ error: 'Error al obtener el producto', details: error.message });
        }

        res.json(producto); // Devolver el producto encontrado
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
};