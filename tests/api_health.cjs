const fetch = global.fetch || require('node-fetch');

async function testApi() {
  console.log('Testing GET /api/tarifas...');
  try {
    const res = await fetch('http://localhost:3001/api/tarifas');
    if (res.ok) {
      const data = await res.json();
      console.log('✅ GET /api/tarifas returned correctly:', data);
    } else {
      console.error('❌ GET /api/tarifas failed with status:', res.status);
    }
  } catch (err) {
    console.error('❌ GET /api/tarifas error:', err.message);
  }

  console.log('\nTesting POST /api/piezas...');
  try {
    const dummyData = {
      nombre: 'Test Pieza',
      material: 'Aluminio',
      cantidad: 5
    };
    const res = await fetch('http://localhost:3001/api/piezas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dummyData)
    });
    if (res.ok) {
      const data = await res.json();
      console.log('✅ POST /api/piezas returned correctly:', data);
    } else {
      console.error('❌ POST /api/piezas failed with status:', res.status);
    }
  } catch (err) {
    console.error('❌ POST /api/piezas error:', err.message);
  }
}

testApi();
