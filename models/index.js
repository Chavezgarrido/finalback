// index.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Crear el cliente de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Funciones para interactuar con la base de datos

// Obtener todos los usuarios
const getUsuarios = async () => {
  const { data, error } = await supabase
    .from('Usuarios')
    .select('*');

  if (error) {
    console.error('Error fetching users:', error);
    return null;
  }
  return data;
};

// Insertar un nuevo usuario
const insertUsuario = async (usuario) => {
  const { data, error } = await supabase
    .from('Usuarios')
    .insert([usuario]);

  if (error) {
    console.error('Error inserting user:', error);
    return null;
  }
  return data;
};

// Actualizar un usuario
const updateUsuario = async (id, updates) => {
  const { data, error } = await supabase
    .from('Usuarios')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating user:', error);
    return null;
  }
  return data;
};

// Eliminar un usuario
const deleteUsuario = async (id) => {
  const { data, error } = await supabase
    .from('Usuarios')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting user:', error);
    return null;
  }
  return data;
};

// Exportar las funciones
module.exports = {
  getUsuarios,
  insertUsuario,
  updateUsuario,
  deleteUsuario,
};