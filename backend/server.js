<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FireLink System - UK Fire & Security CRM</title>
    <script>
        // Auto-detect protocol and handle SSL issues
        function getApiBase() {
            // If we're on HTTPS but backend is HTTP, use current host with HTTP
            if (window.location.protocol === 'https:') {
                // Try to use HTTP for API calls to avoid mixed content issues
                return `http://${window.location.hostname}:3001`;
            }
            return window.location.origin;
        }
    </script>
    <style>
        /* Your existing CSS remains the same */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); min-height: 100vh; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); margin-bottom: 2rem; text-align: center; }
        .logo { color: #ef4444; font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem; }
        .ssl-warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; color: #92400e; }
        .ssl-warning a { color: #dc2626; text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <!-- SSL Warning Banner -->
        <div class="ssl-warning" id="sslWarning" style="display: none;">
            <strong>🔒 SSL Notice:</strong> This application is running in development mode. 
            For production use, configure SSL certificates at your load balancer or use a reverse proxy like nginx.
            <br><small>Current API endpoint: <span id="apiEndpoint">detecting...</span></small>
        </div>

        <div class="header">
            <div class="logo">🔥 FireLink System</div>
            <div class="subtitle">CRM for UK Fire & Security Companies</div>
        </div>
        
        <!-- Rest of your HTML remains the same -->
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number" id="customers-count">--</div>
                <div class="stat-label">Total Customers</div>
            </div>
            <!-- ... rest of your stats -->
        </div>
        
        <div class="nav-buttons">
            <button class="btn" onclick="loadCustomers()">View Customers</button>
            <!-- ... rest of your buttons -->
        </div>
        
        <!-- ... rest of your HTML -->
    </div>

    <script>
        const API_BASE = getApiBase();
        
        // Show SSL warning if needed
        if (window.location.protocol === 'https:' && API_BASE.startsWith('http:')) {
            document.getElementById('sslWarning').style.display = 'block';
            document.getElementById('apiEndpoint').textContent = API_BASE;
        }
        
        // Your existing JavaScript functions remain the same
        async function loadStats() {
            try {
                const [customersRes, healthRes] = await Promise.all([
                    fetch(`${API_BASE}/api/customers`).catch(err => null),
                    fetch(`${API_BASE}/health`).catch(err => null)
                ]);
                
                // Handle responses
                if (customersRes && customersRes.ok) {
                    const data = await customersRes.json();
                    document.getElementById('customers-count').textContent = data.total || data.data.length;
                }
                
                if (healthRes && healthRes.ok) {
                    const data = await healthRes.json();
                    document.getElementById('system-status').innerHTML = 
                        `<span style="color: #10b981;">✅ ${data.status} - ${data.service}</span>`;
                } else {
                    document.getElementById('system-status').innerHTML = 
                        '<span style="color: #ef4444;">❌ API Connection Issue - Check SSL Configuration</span>';
                }
                
            } catch (error) {
                console.error('Error loading stats:', error);
                document.getElementById('system-status').innerHTML = 
                    '<span style="color: #ef4444;">❌ Connection Error - Mixed Content/SSL Issue</span>';
            }
        }
        
        // Your existing data loading functions remain the same
        async function loadCustomers() {
            try {
                document.getElementById('data-display').innerHTML = '<div class="loading">Loading customers...</div>';
                const response = await fetch(`${API_BASE}/api/customers`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                displayData('Customers', data.data);
            } catch (error) {
                document.getElementById('data-display').innerHTML = 
                    `<div style="color: #ef4444;">
                        <strong>Error loading data:</strong><br>
                        ${error.message}<br>
                        <small>Check that your backend is running and accessible</small>
                    </div>`;
            }
        }
        
        // ... rest of your JavaScript functions
    </script>
</body>
</html>
