import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [posData, setPosData] = useState({ productos_local: [], ventas_diarias: [] });
  const [azureData, setAzureData] = useState({ aprendices_clientes: [], empleados: [] });
  const [supabaseData, setSupabaseData] = useState({ sugerencias_pqr: [], alertas_inventario: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Puedes cambiar 'localhost' por la IP pública de tu máquina virtual cuando lo subas a Azure
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

        const [resPos, resAzure, resSupabase] = await Promise.all([
          axios.get(`${API_BASE}/pos-local`),
          axios.get(`${API_BASE}/clientes-azure`),
          axios.get(`${API_BASE}/alertas-supabase`)
        ]);

        setPosData(resPos.data);
        setAzureData(resAzure.data);
        setSupabaseData(resSupabase.data);
        setLoading(false);
      } catch (err) {
        console.error("Error al conectar con la API:", err);
        setError("No se pudo conectar con el servidor backend en Node.js. Asegúrate de que esté corriendo en el puerto 4000.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <h2 style={{ marginTop: '20px', fontWeight: '500', color: '#38bdf8' }}>Sincronizando Dashboard Multi-Cloud...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <div style={{ background: '#1e1b4b', border: '1px solid #4338ca', padding: '30px', borderRadius: '16px', color: '#f87171', maxWidth: '500px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', color: '#fca5a5' }}>Error de Conexión</h3>
          <p style={{ margin: 0, color: '#cbd5e1', lineHeight: '1.5' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      
      {/* Encabezado Principal */}
      <header className="dashboard-header">
        <span className="badge-sena">
          SENA · Centro de Electricidad, Electrónica y Telecomunicaciones
        </span>
        <h1 className="dashboard-title">Dashboard de Control: Cafetería SENA</h1>
        <p className="dashboard-subtitle">Arquitectura Distribuida Multi-Cloud: AlmaLinux VM, Azure MySQL Flexible y Supabase PostgreSQL</p>
      </header>

      <div className="content-wrapper">
        
        {/* SECCIÓN 1: POS LOCAL (AlmaLinux VM / XAMPP) */}
        <div className="card-section card-green">
          <div className="card-header">
            <span className="card-icon">🟢</span>
            <div>
              <h2 className="card-title">1. Proceso Operativo: Punto de Venta Local</h2>
              <span className="card-desc">Infraestructura: AlmaLinux VM / XAMPP (MySQL)</span>
            </div>
          </div>
          
          <div className="tables-grid">
            <div>
              <h4 className="table-title">tbl_productos_local</h4>
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Producto</th>
                      <th>Stock</th>
                      <th>Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posData.productos_local.map(p => (
                      <tr key={p.id_producto}>
                        <td className="text-muted">#{p.id_producto}</td>
                        <td className="text-bold">{p.nombre_producto}</td>
                        <td><span className="tag-stock">{p.stock_actual} und</span></td>
                        <td className="text-bold" style={{ color: '#047857' }}>${Number(p.precio).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="table-title">tbl_ventas_diarias</h4>
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>ID Venta</th>
                      <th>Cant.</th>
                      <th>Hora</th>
                      <th>ID Prod.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posData.ventas_diarias.map(v => (
                      <tr key={v.id_venta}>
                        <td className="text-muted">#{v.id_venta}</td>
                        <td className="text-bold">{v.cantidad_vendida}</td>
                        <td className="text-muted">{v.hora_venta}</td>
                        <td className="text-muted">#{v.id_producto}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: AZURE MYSQL FLEXIBLE SERVER */}
        <div className="card-section card-blue">
          <div className="card-header">
            <span className="card-icon">🔵</span>
            <div>
              <h2 className="card-title">2. Proceso Corporativo Institucional</h2>
              <span className="card-desc">Infraestructura: Azure MySQL Flexible Server</span>
            </div>
          </div>

          <div className="tables-grid">
            <div>
              <h4 className="table-title">tbl_aprendices_clientes</h4>
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Nombres</th>
                      <th>Documento</th>
                      <th>Programa</th>
                      <th>Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {azureData.aprendices_clientes.map(a => (
                      <tr key={a.id_aprendiz}>
                        <td className="text-bold">{a.nombres}</td>
                        <td className="text-muted">{a.documento}</td>
                        <td><span className="tag-programa">{a.programa_formacion}</span></td>
                        <td className="text-bold" style={{ color: '#0369a1' }}>${Number(a.saldo_tarjeta).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="table-title">tbl_empleados</h4>
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Turno</th>
                      <th>Rol</th>
                    </tr>
                  </thead>
                  <tbody>
                    {azureData.empleados.map(e => (
                      <tr key={e.id_empleado}>
                        <td className="text-bold">{e.nombre}</td>
                        <td className="text-muted">{e.turno}</td>
                        <td><span className="tag-role">{e.rol}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: SUPABASE POSTGRESQL */}
        <div className="card-section card-purple">
          <div className="card-header">
            <span className="card-icon">🟣</span>
            <div>
              <h2 className="card-title">3. Proceso en Tiempo Real (Alertas y PQRs)</h2>
              <span className="card-desc">Infraestructura: Supabase (PostgreSQL en la Nube)</span>
            </div>
          </div>

          <div className="tables-grid">
            <div>
              <h4 className="table-title">tbl_sugerencias_pqr</h4>
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Comentario</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supabaseData.sugerencias_pqr.map(pqr => (
                      <tr key={pqr.id_pqr}>
                        <td>
                          <span className={pqr.tipo === 'Queja' ? 'tag-queja' : 'tag-sugerencia'}>
                            {pqr.tipo}
                          </span>
                        </td>
                        <td style={{ color: '#334155' }}>{pqr.comentario}</td>
                        <td className="text-muted" style={{ fontSize: '13px' }}>{new Date(pqr.fecha).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="table-title">tbl_alertas_inventario</h4>
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Mensaje Alerta</th>
                      <th>Criticidad</th>
                      <th>Creado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supabaseData.alertas_inventario.map(alerta => (
                      <tr key={alerta.id_alerta}>
                        <td className="text-bold">{alerta.mensaje_alerta}</td>
                        <td>
                          <span className={alerta.criticidad >= 3 ? 'tag-critico' : 'tag-normal'}>
                            Nivel {alerta.criticidad}
                          </span>
                        </td>
                        <td className="text-muted" style={{ fontSize: '13px' }}>{new Date(alerta.creado_en).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;