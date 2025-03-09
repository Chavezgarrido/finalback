const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.getAllCategories = async (req, res) => {
    try {
        const { data: categorias, error } = await supabase
            .from('Categoria') 
            .select('*');

        if (error) {
            return res.status(500).json({ error: 'Error al obtener categorías', details: error.message });
        }

        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
};

exports.getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const { data: categoria, error } = await supabase
            .from('Categoria')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') { 
                return res.status(404).json({ error: 'Categoría no encontrada' });
            }
            return res.status(500).json({ error: 'Error al obtener categoría', details: error.message });
        }

        res.json(categoria);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener categoría' });
    }
};

exports.getProductsByCategory = async (req, res) => {
    const { categoria } = req.params; 

    try {
        const { data: productos, error } = await supabase
            .from('Productos')
            .select('*')
            .eq('categoria', categoria); 

        if (error) {
            return res.status(500).json({ error: 'Error al obtener productos', details: error.message });
        }

        if (!productos || productos.length === 0) {
            return res.status(404).json({ error: 'No se encontraron productos en esta categoría' });
        }

        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos', details: error.message });
    }
};
