const express = require('express');
const app = express(); 
app.use(express.json());

const libros = [
    { "id": 1, "titulo": "Cien años de soledad", "autor": "Gabriel García Márquez", "anio": 1967, "genero": "Realismo Mágico" },
    { "id": 2, "titulo": "Don Quijote de la Mancha", "autor": "Miguel de Cervantes", "anio": 1605, "genero": "Novela"},
    { "id": 3, "titulo": "El amor en los tiempos del cólera", "autor": "Gabriel García Márquez", "anio": 1985, "genero": "Realismo Mágico" },
    { "id": 4, "titulo": "La sombra del viento", "autor": "Carlos Ruiz Zafón", "anio": 2001, "genero": "Misterio" },
    { "id": 5, "titulo": "El código Da Vinci", "autor": "Dan Brown", "anio": 2003, "genero": "Thriller" },
    { "id": 6, "titulo": "1984", "autor": "George Orwell", "anio": 1949, "genero": "Distopía" },
    { "id": 7, "titulo": "El gran Gatsby", "autor": "F. Scott Fitzgerald", "anio": 1925, "genero": "Novela" },
    { "id": 8, "titulo": "Matar a un ruiseñor", "autor": "Harper Lee", "anio": 1960, "genero": "Fiction" }
];

//---------------- GETS ----------------

//1) Get de listar todos los elementos
app.get('/listar-libros', (req, res) => {
    res.json(libros);
});

//2) Get que devuelva 1 elemento por id.
app.get('/buscar-libro', (req, res) => {
    const {id} = req.query;

    //validar que se envió el id
    if (!id) {
        return res.status(400).json({ error: "Debe ingresar un id" });
    }

    //validar que el id sea un número
    if (isNaN(id)) {
        return res.status(400).json({ error: "El id debe ser un número" });
    }

    const libro = libros.find(libro => libro.id === parseInt(id));

    if (!libro) {
        return res.status(404).json({ error: "No se encontró ningún libro con ese id" });
    }

    res.json(libro);
});

//3) Get que deuelva 1 elemento por atributo obligatorio, como el nombre.
app.get('/buscar-libro-titulo', (req, res) => {
    const {titulo} = req.query;

    //validar que se envió el título
    if (!titulo) {
        return res.status(400).json({ error: "Debe ingresar un título" });
    }

    //verificar que se encontró un libro con el título ingresado
    const libro = libros.find(libro => libro.titulo.toLowerCase() === titulo.toLowerCase());

    if (!libro) {
        return res.status(404).json({ error: "No se encontró ningún libro con ese título" });
    }

    res.json({ mensaje: "Libro encontrado", datos: libro });
});

//-------------- POST --------------

app.post('/crear-libro', (req, res) => {
    const { titulo, autor, anio, genero } = req.body;

    //validar campos obligatorios con operadores OR
    if (!titulo || !autor || !anio || !genero) {
        return res.status(400).json({ error: "Todos los campos son obligatorios: titulo, autor, anio, genero" });
    }

    //validar que el año sea un número
    if (isNaN(anio)) {
        return res.status(400).json({ error: "El año ingresado debe ser un número" });
    }

    //validar que el año del libro sea 'razonable'
    if (anio < 1000 || anio > new Date().getFullYear()) {
        return res.status(400).json({ error: `El año debe estar entre 1000 y ${new Date().getFullYear()}` });
    }

    //evitar crear un libro duplicado (por título)
    const duplicado = libros.find(libro => libro.titulo.toLowerCase() === titulo.toLowerCase());
    if (duplicado) {
        return res.status(400).json({ error: "Ya existe un libro con ese título" });
    }

    //crear el nuevo libro
    const nuevoLibro = {
        id: libros.length + 1,
        titulo,
        autor,
        anio: parseInt(anio),
        genero
    };

    //se agrega el libro con push, porque find le pasó a libros una referencia hacia el array original
    libros.push(nuevoLibro);

    res.status(201).json({ mensaje: "Libro creado correctamente", datos: nuevoLibro });
});

//-------------- DELETE --------------

app.delete('/eliminar-libro', (req, res) => {
    const {id} = req.query;

    //validar que se envió el id
    if (!id) {
        return res.status(400).json({ error: "Debe ingresar un id" });
    }

    //validar que el id sea un número
    if (isNaN(id)) {
        return res.status(400).json({ error: "El id debe ser un número" });
    }

    //buscar el libro a eliminar (por id)
    const libro = libros.find(libro => libro.id === parseInt(id));

    if (!libro) {
        return res.status(404).json({ error: "No se encontró ningún libro con ese id" });
    }

    //Eliminar el libro
    const index = libros.indexOf(libro); //se busca el índice del libro a eliminar1
    libros.splice(index, 1); //se elimina el libro indicando el índica y la cantidad de elementos a borrar (indice/cantidad)

    res.json({ mensaje: "El libro eliminado correctamente" });
});

//-------------- PATCH --------------

app.patch('/editar-libro', (req, res) => {
    const {id} = req.query;
    const {titulo, autor, anio, genero} = req.body;

    //validar que se envió el id
    if (!id) {
        return res.status(400).json({ error: "Debe ingresar un id" });
    }

    //validar que el id sea un número
    if (isNaN(id)) {
        return res.status(400).json({ error: "El id ingresado debe ser un número" });
    }

    //buscar el libro (por id)
    const libro = libros.find(libro => libro.id === parseInt(id));

    if (!libro) {
        return res.status(404).json({ error: "No se encontró ningún libro con ese id" });
    }

    //validar año (si es que se envió)
    if (anio) {
        if (isNaN(anio)) { //se valida el tipo de dato
            return res.status(400).json({ error: "El año ingresado debe ser un número" });
        }
        if (anio < 1000 || anio > new Date().getFullYear()) { //se valida la fecha ingresada
            return res.status(400).json({ error: `El año debe estar entre 1000 y ${new Date().getFullYear()}` });
        }
    }

    // Actualizar solo los campos enviados (solo si el cliente envió un nuevo valor)
    if (titulo) libro.titulo = titulo;
    if (autor) libro.autor = autor;
    if (anio) libro.anio = parseInt(anio);
    if (genero) libro.genero = genero;

    res.json({ mensaje: "Libro actualizado correctamente", datos: libro });
});

// Configuración del servidor 
app.listen(3000, () => { 
    console.log('Servidor escuchando en el puerto 3000. http://localhost:3000'); 
});