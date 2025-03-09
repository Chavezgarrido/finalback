const { createClient } = require('@supabase/supabase-js');

// Crear el cliente de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.addToCart = async (req, res) => {
    const { id } = req.params; // ID del usuario
    const { id_producto, cantidad } = req.body; // ID del producto y cantidad

    try {
        // Verificar si el carrito ya existe para el usuario
        const { data: carrito, error: fetchError } = await supabase
            .from('Carrito')
            .select('*')
            .eq('id_usuario', id)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 significa que no se encontró el registro
            return res.status(500).json({ error: 'Error al buscar el carrito' });
        }

        // Si no existe, crear un nuevo carrito
        if (!carrito) {
            const { data: newCarrito, error: createError } = await supabase
                .from('Carrito')
                .insert([{ id_usuario: id }]);

            if (createError) {
                return res.status(500).json({ error: 'Error al crear el carrito' });
            }
        }

        // Agregar el producto al carrito
        const { data: updatedCarrito, error: addError } = await supabase
            .from('Carrito_Productos') // Asegúrate de que esta tabla exista
            .insert([{ id_usuario: id, id_producto, cantidad }]);

        if (addError) {
            return res.status(500).json({ error: 'Error al agregar producto al carrito' });
        }

        res.json({ mensaje: 'Producto agregado al carrito', carrito: updatedCarrito });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
};

exports.removeFromCart = async (req, res) => {
    const { id } = req.params; // ID del usuario
    const { id_producto } = req.body; // ID del producto a eliminar

    try {
        // Eliminar el producto del carrito
        const { data, error } = await supabase
            .from('Carrito_Productos')
            .delete()
            .eq('id_usuario', id)
            .eq('id_producto', id_producto);

        if (error) {
            return res.status(500).json({ error: 'Error al eliminar producto del carrito' });
        }

        res.json({ mensaje: 'Producto eliminado del carrito', data });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar producto del carrito' });
    }
};

exports.finalizePurchase = async (req, res) => {
    const { id } = req.params; // ID del usuario
    const { direccion_envio, metodo_pago } = req.body; // Datos de envío y método de pago

    try {
        // Obtener el carrito del usuario
        const { data: carrito, error: fetchError } = await supabase
            .from('Carrito_Productos')
            .select('*')
            .eq('id_usuario', id);

        if (fetchError) {
            return res.status(500).json({ error: 'Error al obtener el carrito' });
        }

        if (!carrito || carrito.length === 0) {
            return res.status(400).json({ error: 'El carrito está vacío' });
        }

        // Crear un nuevo pedido
        const { data: nuevoPedido, error: createError } = await supabase
            .from('Pedidos')
            .insert([{
                id_usuario: id,
                direccion_envio,
                metodo_pago,
                detalles: carrito, // Puedes ajustar esto según tu estructura
                total: carrito.reduce((acc, producto) => acc + (producto.precio_unitario * producto.cantidad), 0), // Calcular el total
            }]);

        if (createError) {
            return res.status(500).json({ error: 'Error al crear el pedido' });
        }

        // Eliminar los productos del carrito después de finalizar la compra
        const { error: deleteError } = await supabase
            .from('Carrito_Productos')
            .delete()
            .eq('id_usuario', id);

        if (deleteError) {
            return res.status(500).json({ error: 'Error al vaciar el carrito después de la compra' });
        }

        res.status(201).json({ mensaje: 'Compra finalizada con éxito', pedido: nuevoPedido });
    } catch (error) {
        res.status(500).json({ error: 'Error al finalizar la compra' });
    }
};