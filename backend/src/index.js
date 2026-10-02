const express = require('express');
const app = express(); 
app.use(express.json());

const usuarios = [
    { id: 1, nombre: 'Carlos' },
    { id: 2, nombre: 'Ramona' },
    { id: 3, nombre: 'Cristiano' }
];


//----
//GET va a buscar y devolver lo que le indiquemos
app.get('/usuarios', (req, res) => {
    res.json(usuarios);
});

//----
//POST va a recibir datos nuevos y los va a agregar dentro del sistema
app.post('/registrar-usuario', (req, res) => {

    const nombre = req.body.nombre; //guardo lo que el usuario envió para hacer verificaciones

    //Verificar si se envió algo
    if (!nombre) {
        return res.status(400).json({ //400 indica un error de que no senvió el dato que se esperaba.
            error: 'Debe ingresar un nombre'
        });
    }

    //Verificar que el nombre no exista
    const usuarioExistente = usuarios.find(
        usuario => usuario.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (usuarioExistente) {
        return res.status(409).json({ //409 indica conflictos, en este caso el conflicto es el usuario duplicado.
            error: 'El usuario ya existe'
        });
    }


    const nuevoUsuario = {
        id: usuarios.length + 1, //id autoincremental
        nombre: req.body.nombre //nombre que el cliente o nosotros debemos escribir en la petición
    };

    usuarios.push(nuevoUsuario); 
    res.status(201).json(nuevoUsuario); //201 indica que se creó un nuevo recurso
});

//----
//DELETE elimina algo del servidor
app.delete('/borrar-usuario', (req, res) => {

    const id = req.body.id; //obtengo el id que el cliente tuvo que haber enviado
    const iD = parseInt(id);

    const usuario = usuarios.find(usuario => usuario.id === iD); //busco el usuario en mi lista

    //Verificar si existe el usuario
    if (!usuario) {
        return res.status(404).json({ //404 indica que no se encontró el recurso que se solicitó
            error: 'Usuario no encontrado'
        });
    }

    // Obtener posición del usuario
    const indice = usuarios.findIndex(usuario => usuario.id === iD);

    // Eliminar usuario
    usuarios.splice(indice, 1); //'indice' inicio del borrado y '1' la cantidad que cosas que voy a borrar
    res.json({mensaje: 'Usuario eliminado correctamente'});

});

app.patch('/editar-usuario', (req, res) => {

    //Verificar si existe un usuario con el id recibido
    const id = req.body.id;
    const iD = parseInt(id);

    const usuario = usuarios.find(usuario => usuario.id === iD);

    if (!usuario) {
        return res.status(404).json({ //404 indica que no se encontró el recurso que se solicitó
            error: 'Usuario no encontrado'
        });
    }

    const nuevoNombre = req.body.nombre;
    const existeUsuario = usuarios.find(usuario => usuario.nombre.toLowerCase() === nuevoNombre.toLowerCase());

    if (!nuevoNombre) { //Verifiicar que haya enviado un nombre nuevo
        return res.status(400).json({ //400 indica que el cliente no envió el dato que se esperaba
            error: 'Debe ingresar algún nombre'
        })
    } else if (nuevoNombre.toLowerCase() === usuario.nombre.toLowerCase()) { //Verificar si el nombre nuevo es el mismo que el actual
        return res.status(400).json({ //400 indica que el cliente no envió el dato que se esperaba, en este caso el dato es un nombre diferente al actual
            error: 'El nombre ingresa es el mismo'
        });
    }else if (existeUsuario) { //Verificar si existe otro usuario con el mismo nombre
        return res.status(409).json({ //409 indica que hay un conflicto
            error: 'El nombre ingresado ya existe'
        });
    }

    //Actualizar el nombre del usuario
    usuario.nombre = nuevoNombre;
    res.json({mensaje: 'Usuario actualizado correctamente'});
});

// Configuración del servidor 
app.listen(3000, () => { 
    console.log('Servidor escuchando en el puerto 3000'); 
});

/*
--- Consgina
1)crear un enpoint por cada método HTTP ()
a)crear un array de usuarios para utilizarlo.
---

--- Ejemplo
const usuarios = [
    { id: 1, nombre: 'Carlos' },
    { id: 2, nombre: 'Ramona' },
    { id: 3, nombre: 'Cristiano' }
];

app.get('/usuarios', (req, res) => { //devuelve la lista completa de usuarios
    res.json(usuarios); 
}); 

//app.post('/registrar,' () =>{
    res.send("registrar")
})

//app.delete("/borrar-usuario," () =>{
    res.send("borrar")
})
//app.patch("/edit-usuario," () =>{
    res.send("editar")
})
---

------ Datos a tener en cuenta:

- Que pasa si quiero borrar un ususario n5, lo tengo? no, entonces mostrar un mensaje de error.
- *practicar estos métodos porque pasaran al pizarron a escribir el POST, GET, DELETE O PATCH.
   (En la siguiente clase).

*/