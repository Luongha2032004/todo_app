const http = require('http');

function postJson(path, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const req = http.request(options, (res) => {
      let out = '';
      res.on('data', c => out += c);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(out) });
        } catch (e) {
          resolve({ status: res.statusCode, body: out });
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function getJson(path, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    const req = http.request(options, (res) => {
      let out = '';
      res.on('data', c => out += c);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(out) });
        } catch (e) {
          resolve({ status: res.statusCode, body: out });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

(async () => {
  try {
    // Use existing testuser (created earlier) or change credentials
    const login = await postJson('/api/auth/login', { username: 'testuser', password: 'secret123' });
    console.log('Login:', login.status, login.body);
    if (!login.body || !login.body.token) return console.error('No token returned');
    const token = login.body.token;
    const notes = await getJson('/api/notes', token);
    console.log('GET /api/notes:', notes.status, notes.body);
  } catch (err) {
    console.error(err);
  }
})();
