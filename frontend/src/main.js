import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="dashboard">
    <aside class="sidebar">
      <div class="logo">🚀 GoVite</div>
      <nav>
        <a href="#" class="active">Dashboard</a>
        <a href="#">Analytics</a>
        <a href="#">Settings</a>
      </nav>
    </aside>
    <main class="content">
      <header class="topbar">
        <h1>Dashboard Overview</h1>
        <div class="user-profile">
          <img src="https://ui-avatars.com/api/?name=Admin+User&background=random" alt="Admin">
        </div>
      </header>
      <section class="metrics">
        <div class="card p-card">
          <h3>Backend Status</h3>
          <p id="api-status">Checking...</p>
        </div>
        <div class="card">
          <h3>Users</h3>
          <p class="metric-value">1,245</p>
        </div>
        <div class="card">
          <h3>Revenue</h3>
          <p class="metric-value">$12.4k</p>
        </div>
      </section>
    </main>
  </div>
`

// Fetch health from backend
fetch('/api/health')
  .then(res => res.json())
  .then(data => {
    const el = document.getElementById('api-status');
    if (data.status === 'ok') {
      el.textContent = '🟢 Online (Postgres OK)';
      el.classList.add('status-ok');
    } else {
      el.textContent = '🔴 Offline or DB Error';
      el.classList.add('status-error');
    }
  })
  .catch(err => {
    document.getElementById('api-status').textContent = '🔴 Offline (Fetch Failed)';
  });
