const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.getOrdersByUserId = async (req, res) => {
    const { id } = req.params;
    try {
        const { data: pedidos, error } = await supabase
            .from('Pedidos') 
            .select('*')
            .eq('id_usuario', id);

        if (error) {
            return res.status(500).json({ error: 'Error al obtener pedidos', details: error.message });
        }

        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener pedidos' });
    }
};

exports.getOrderById = async (req, res) => {
    const { id, pedido_id } = req.params; 
    try {
        const { data: pedido, error } = await supabase
            .from('Pedidos')
            .select('*')
            .eq('id_usuario', id)
            .eq('id', pedido_id)
            .single(); 

        if (error) {
            if (error.code === 'PGRST116') { 
                return res.status(404).json({ error: 'Pedido no encontrado' });
            }
            return res.status(500).json({ error: 'Error al obtener pedido', details: error.message });
        }

        res.json(pedido);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener pedido' });
    }
};
