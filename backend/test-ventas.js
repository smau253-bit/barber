// test-ventas.js
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testVentas() {
  console.log('🧪 Probando endpoints de ventas...\n');

  try {
    // 1. Probar clientes
    console.log('1. Probando /api/ventas/clientes...');
    const clientes = await axios.get(`${BASE_URL}/api/ventas/clientes`);
    console.log('✅ Clientes:', clientes.data.data?.length || 0, 'encontrados\n');

    // 2. Probar productos
    console.log('2. Probando /api/ventas/productos...');
    const productos = await axios.get(`${BASE_URL}/api/ventas/productos`);
    console.log('✅ Productos:', productos.data.data?.length || 0, 'encontrados\n');

    // 3. Probar ventas
    console.log('3. Probando /api/ventas...');
    const ventas = await axios.get(`${BASE_URL}/api/ventas`);
    console.log('✅ Ventas:', ventas.data.data?.length || 0, 'encontradas\n');

    console.log('✅ Todos los endpoints funcionan correctamente!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('  Status:', error.response.status);
      console.error('  Data:', error.response.data);
    }
  }
}

testVentas();