const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. CONFIGURACIÓN DE CONEXIONES ---

// Pool 1: MySQL Local en la Máquina Virtual de AlmaLinux (Azure)
const poolLocal = mysql.createPool({
  host: process.env.MYSQL_LOCAL_HOST,
  user: process.env.MYSQL_LOCAL_USER,
  password: process.env.MYSQL_LOCAL_PASSWORD,
  database: process.env.MYSQL_LOCAL_DB
});

// Pool 2: Azure MySQL Flexible Server (Requiere SSL activo)
const poolAzure = mysql.createPool({
  host: process.env.AZURE_MYSQL_HOST,
  user: process.env.AZURE_MYSQL_USER,
  password: process.env.AZURE_MYSQL_PASSWORD,
  database: process.env.AZURE_MYSQL_DB,
  ssl: { rejectUnauthorized: false }
});

// Pool 3: Supabase (PostgreSQL en la Nube)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);


// --- 2. ENDPOINTS OFICIALES DEL TALLER ---

// Endpoint 1: XAMPP / AlmaLinux VM
app.get('/api/pos-local', async (req, res) => {
  try {
    const [productos] = await poolLocal.query('SELECT * FROM tbl_productos_local');
    const [ventas] = await poolLocal.query('SELECT * FROM tbl_ventas_diarias');
    res.json({ success: true, productos_local: productos, ventas_diarias: ventas });
  } catch (error) {
    console.error("❌ ERROR EN POS-LOCAL:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint 2: Azure MySQL Flexible
app.get('/api/clientes-azure', async (req, res) => {
  try {
    const [aprendices] = await poolAzure.query('SELECT * FROM tbl_aprendices_clientes');
    const [empleados] = await poolAzure.query('SELECT * FROM tbl_empleados');
    res.json({ success: true, aprendices_clientes: aprendices, empleados: empleados });
  } catch (error) {
    console.error("❌ ERROR EN CLIENTES-AZURE:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint 3: Supabase PostgreSQL (Tiempo Real - Sugerencias PQR y Alertas)
app.get('/api/alertas-supabase', async (req, res) => {
  try {
    const { data: pqrs, error: errPqr } = await supabase.from('tbl_sugerencias_pqr').select('*');
    if (errPqr) throw errPqr;

    const { data: alertas, error: errAlerta } = await supabase.from('tbl_alertas_inventario').select('*');
    if (errAlerta) throw errAlerta;

    res.json({ 
      success: true, 
      sugerencias_pqr: pqrs, 
      alertas_inventario: alertas 
    });
  } catch (error) {
    console.error("❌ ERROR EN SUPABASE:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- 3. INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo exitosamente en el puerto ${PORT}`);
});