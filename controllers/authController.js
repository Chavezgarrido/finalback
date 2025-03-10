const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const register = async (req, res) => {
    try {
        const { email, contraseña, nombre, apellido, tipo_usuario } = req.body;

        // Validar que todos los campos requeridos estén presentes
        if (!email || !contraseña || !nombre || !apellido || !tipo_usuario) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        // Intentar insertar el nuevo usuario
        const { data, error } = await supabase
            .from('Usuarios')
            .insert([
                {
                    email,
                    contraseña: hashedPassword,
                    nombre,
                    apellido,
                    tipo_usuario,
                    fecha_registro: new Date(), 
                    "createdAt": new Date(), /
                    "updatedAt": new Date() 
                }
            ]);

        console.log('Data:', data);
        console.log('Error:', error);

        if (error) {
            console.error('Error de Supabase:', error); 
            return res.status(500).json({ 
                message: 'Error al guardar el usuario en la base de datos', 
                error: error.message 
            });
        }

        if (!data || data.length === 0) {
            return res.status(500).json({ message: 'No se pudo crear el usuario, no se devolvió ningún dato.' });
        }

        res.status(201).json({
            message: 'Usuario creado',
            userId: data[0].id, 
            email,
            nombre,
            apellido,
            tipo_usuario
        });
    } catch (err) {
        console.error('Error en la inserción:', err);
        return res.status(500).json({ message: 'Error en el servidor', error: err.message });
    }
};

const login = async (req, res) => {
    const { email, contraseña } = req.body;

    if (!email || !contraseña) {
        return res.status(400).json({ message: 'Email y contraseña son obligatorios.' });
    }

    const { data, error } = await supabase
        .from('Usuarios')
        .select('*')
        .eq('email', email)
        .single();

    if (error || !data) {
        console.error('Error al buscar el usuario:', error);
        return res.status(401).json({ message: 'Error al iniciar sesión', error: 'Credenciales incorrectas' });
    }

    const isPasswordValid = await bcrypt.compare(contraseña, data.contraseña);
    if (!isPasswordValid) {
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
