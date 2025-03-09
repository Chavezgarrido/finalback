const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


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

module.exports = {
  getUsuarios,
  insertUsuario,
  updateUsuario,
  deleteUsuario,
};
