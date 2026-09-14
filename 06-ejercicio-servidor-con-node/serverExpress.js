import express from 'express';
import { randomUUID } from 'node:crypto';

process.loadEnvFile();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const users = [
  { id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', name: 'Miguel', age: 28 },
  { id: 'f6e5d4c3-b2a1-4f5e-6d7c-8b9a0e1f2a3b', name: 'Mateo', age: 34 },
  { id: '9a8b7c6d-5e4f-4a3b-2c1d-0e9f8a7b6c5d', name: 'Pablo', age: 22 },
  { id: '3c4d5e6f-7a8b-4c9d-0e1f-2a3b4c5d6e7f', name: 'Lucía', age: 31 },
  { id: '7b8c9d0e-1f2a-4b3c-4d5e-6f7a8b9c0d1e', name: 'Ana', age: 26 },
  { id: '5d6e7f8a-9b0c-4d1e-2f3a-4b5c6d7e8f9a', name: 'Juan', age: 29 },
  { id: '2a3b4c5d-6e7f-4a8b-9c0d-1e2f3a4b5c6d', name: 'Sofía', age: 25 },
  { id: '8f9a0b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c', name: 'Carlos', age: 37 },
  { id: '4c5d6e7f-8a9b-4c0d-1e2f-3a4b5c6d7e8f', name: 'Elena', age: 23 },
  { id: '0e1f2a3b-4c5d-4e6f-7a8b-9c0d1e2f3a4b', name: 'Diego', age: 30 }
];

// GET /users - Lista todos los usuarios y filtros (nombre, edad y paginación)
app.get('/users', (req, res) => {

  const { name, limit, offset, minAge, maxAge } = req.query;
  let filteredUsers = users;

  // Filtrado por nombre
  if (name) {
    filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Filtrado por edad mínima
  if (minAge) {
    filteredUsers = filteredUsers.filter(user => user.age >= Number(minAge));
  }

  // Filtrado por edad máxima
  if (maxAge) {
    filteredUsers = filteredUsers.filter(user => user.age <= Number(maxAge));
  }

  // Paginación usando limit y offset
  if (limit !== undefined || offset !== undefined) {
    const start = offset ? Number(offset) : 0;
    const end = limit ? start + Number(limit) : undefined;
    filteredUsers = filteredUsers.slice(start, end);
  }

  res.json(filteredUsers);
});

// POST /users - Crea nuevo usuario
app.post('/users', (req, res) => {

  const { name, age } = req.body;

  // Creamos el usuario generando un ID único
  const newUser = {
    id: randomUUID(),
    name,
    age
  };

  // Guardamos en el array y devolvemos status 201 (creado)
  users.push(newUser);
  res.status(201).json(newUser);
});

// GET /health - Endpoint para comprobar estado de la API
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime()
  });
});

// Middleware para manejar rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciamos servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
