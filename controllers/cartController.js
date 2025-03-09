const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.addToCart = async (req, res) => {
    const { id } = req.params; 
    const { id_producto, cantidad } = req.body; 

    try {
        const { data: carrito, error: fetchError } = await supabase
            .from('Carrito')
            .select('*')
            .eq('id_usuario', id)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { 
            return res.status(500).json({ error: 'Error al buscar el carrito' });
        }

        if (!carrito) {
            const { data: newCarrito, error: createError } = await supabase
                .from('Carrito')
                .insert([{ id_usuario: id }]);

            if (createError) {
                return res.status(500).json({ error: 'Error al crear el carrito' });
            }
        }

        const { data: updatedCarrito, error: addError } = await supabase
            .from('Carrito_Productos') 
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
    const { id } = req.params; 
    const { id_producto } = req.body; 

    try {
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
    const { id } = req.params; 
    const { direccion_envio, metodo_pago } = req.body; 

    try {

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

        const { data: nuevoPedido, error: createError } = await supabase
            .from('Pedidos')
            .insert([{
                id_usuario: id,
                direccion_envio,
                metodo_pago,
                detalles: carrito, 
                total: carrito.reduce((acc, producto) => acc + (producto.precio_unitario * producto.cantidad), 0), 
            }]);

        if (createError) {
            return res.status(500).json({ error: 'Error al crear el pedido' });
        }

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
