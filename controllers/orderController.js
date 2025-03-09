const { createClient } = require('@supabase/supabase-js');

// Crear el cliente de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.getOrdersByUserId = async (req, res) => {
    const { id } = req.params; // ID del usuario
    try {
        const { data: pedidos, error } = await supabase
            .from('Pedidos') // Asegúrate de que esta tabla exista
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
    const { id, pedido_id } = req.params; // ID del usuario y ID del pedido
    try {
        const { data: pedido, error } = await supabase
            .from('Pedidos')
            .select('*')
            .eq('id_usuario', id)
            .eq('id', pedido_id)
            .single(); // Obtener un solo registro

        if (error) {
            if (error.code === 'PGRST116') { // PGRST116 significa que no se encontró el registro
                return res.status(404).json({ error: 'Pedido no encontrado' });
            }
            return res.status(500).json({ error: 'Error al obtener pedido', details: error.message });
        }

        res.json(pedido);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener pedido' });
    }
};