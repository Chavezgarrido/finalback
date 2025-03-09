const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.getUserById = async (req, res) => {
    const { id } = req.params; 

    try {
        const { data: usuario, error } = await supabase
            .from('Usuarios') 
            .select('*')
            .eq('id', id)
            .single(); 

        if (error) {
            if (error.code === 'PGRST116') { 
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            return res.status(500).json({ error: 'Error al obtener usuario', details: error.message });
        }

        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
};