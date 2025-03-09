const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.getProductById = async (req, res) => {
    const { id } = req.params; 

    try {
        const { data: producto, error } = await supabase
            .from('Productos') 
            .select('*')
            .eq('id', id)
            .single(); 

        if (error) {
            if (error.code === 'PGRST116') { 
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            return res.status(500).json({ error: 'Error al obtener el producto', details: error.message });
        }

        res.json(producto); 
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
};

exports.getProductsByCategory = async (req, res) => {
    const { categoria } = req.params;

    try{
        const { data: productos, error } = await supabase
            .from('Productos')
            .select('*')
            .eq('categoria', categoria);

        if (error) {
            return res.status(500).json({ error: 'Error al obtener productos', detailes: error.message });
        }

        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};
