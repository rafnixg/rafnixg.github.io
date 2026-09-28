window.CMS_API_BASE_URL = ['localhost', '127.0.0.1'].includes(window.location.hostname)
  ? 'http://localhost:8001/api'
  : 'https://api.rafnixg.dev/api';
