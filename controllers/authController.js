const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const register = async (req, res) => {
    const { email, contraseña, nombre, apellido, tipo_usuario } = req.body;

    const { data, error } = await supabase
        .from('Usuarios')
        .insert([
            {
                email,
                contraseña,
                nombre,
                apellido,
                tipo_usuario
            }
        ]);

    if (error) {
        return res.status(500).json({ message: 'Error al guardar el usuario en la base de datos', error: error.message });
    }

    res.status(201).json({
        message: 'Usuario creado',
        userId: data[0].id, 
        email,
        nombre,
        apellido,
        tipo_usuario
    });
};

const login = async (req, res) => {
    const { email, contraseña } = req.body;

    const { data, error } = await supabase
        .from('Usuarios')
        .select('*')
        .eq('email', email)
        .eq('contraseña', contraseña) 
        .single();

    if (error || !data) {
        return res.status(401).json({ message: 'Error al iniciar sesión', error: 'Credenciales incorrectas' });
    }

    res.json({
        message: 'Inicio de sesión exitoso',
        userId: data.id,
        email: data.email,
        nombre: data.nombre,
        apellido: data.apellido,
        tipo_usuario: data.tipo_usuario
    });
};

module.exports = { register, login };
