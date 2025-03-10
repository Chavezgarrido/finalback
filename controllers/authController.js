const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const register = async (req, res) => {
    const { email, contraseña, nombre, apellido, tipo_usuario } = req.body;

    const { user, error } = await supabase.auth.signUp({
        email,
        password: contraseña,
    });

    if (error) {
        return res.status(400).json({ message: 'Error al crear el usuario', error: error.message });
    }

    const { data, error: insertError } = await supabase
        .from('Usuarios')
        .insert([
            {
                email,
                contraseña: contraseña,
                nombre,
                apellido,
                tipo_usuario,
                user_id: user.id
            }
        ]);

    if (insertError) {
        return res.status(500).json({ message: 'Error al guardar el usuario en la base de datos', error: insertError.message });
    }

    res.status(201).json({
        message: 'Usuario creado',
        userId: user.id,
        email: user.email,
        nombre,
        apellido,
        tipo_usuario
    });
};

const login = async (req, res) => {
    const { email, contraseña } = req.body;

    const { user, error } = await supabase.auth.signIn({
        email,
        password: contraseña,
    });

    if (error) {
        return res.status(401).json({ message: 'Error al iniciar sesión', error: error.message });
    }

    const { data, error: fetchError } = await supabase
        .from('Usuarios')
        .select('*')
        .eq('email', email)
        .single();

    if (fetchError) {
        return res.status(500).json({ message: 'Error al obtener información del usuario', error: fetchError.message });
    }

    res.json({
        message: 'Inicio de sesión exitoso',
        userId: user.id,
        email: data.email,
        nombre: data.nombre,
        apellido: data.apellido,
        tipo_usuario: data.tipo_usuario
    });
};

module.exports = { register, login };
