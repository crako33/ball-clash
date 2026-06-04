import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'save-balance-plugin',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/api/save-balance' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const data = JSON.parse(body);
                // Save it to a JSON file src/balance.json
                fs.writeFileSync(
                  path.resolve(__dirname, 'src/balance.json'),
                  JSON.stringify(data, null, 2),
                  'utf-8'
                );
                
                // Also update the BALANCE object inside src/App.jsx!
                const appPath = path.resolve(__dirname, 'src/App.jsx');
                if (fs.existsSync(appPath)) {
                  let content = fs.readFileSync(appPath, 'utf-8');
                  
                  // Match const BALANCE = { ... } block
                  const balanceRegex = /const BALANCE = \{[\s\S]*?\};/;
                  
                  const formattedBalance = `const BALANCE = {\n` + Object.entries(data).map(([k, v]) => {
                    const params = Object.entries(v).map(([prop, val]) => `${prop}: ${val}`).join(', ');
                    return `  ${k}: { ${params} },`;
                  }).join('\n') + `\n};`;
                  
                  if (balanceRegex.test(content)) {
                    content = content.replace(balanceRegex, formattedBalance);
                    fs.writeFileSync(appPath, content, 'utf-8');
                  }
                }
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
              } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
