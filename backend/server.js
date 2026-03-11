const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'register',
  password: 'root',
  port: 5432,
});

app.get('/', (req, res) => {
  res.send('Backend funcionando');
});

app.post('/registro', async (req, res) => {
  const { usuario, correo, telefono, contrasenia } = req.body;

  console.log('DATOS RECIBIDOS:', req.body);

  try {
    const result = await pool.query(
      'INSERT INTO public.registro (usuario, correo, telefono, contrasenia) VALUES ($1, $2, $3, $4) RETURNING *',
      [usuario, correo, telefono, contrasenia]
    );

    console.log('INSERT OK:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.log('ERROR EN /registro:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor corriendo en puerto 3000');
});