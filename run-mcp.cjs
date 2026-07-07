const { spawn } = require('child_process');

async function callTool(name, arguments) {
  return new Promise((resolve, reject) => {
    const env = { ...process.env, DESIGNMD_API_KEY: 'dk_33b90a5b01fd8e5002e0560c0f9c0677b3c8788a' };
    const child = spawn('npx.cmd', ['designmd-mcp'], { env, shell: true });

    let buffer = '';
    const pendingRequests = new Map();
    let nextId = 1;

    child.stdout.on('data', (data) => {
      buffer += data.toString();
      processLines();
    });

    child.stderr.on('data', (data) => {
      // ignore or log quietly
    });

    function sendRequest(method, params) {
      const id = nextId++;
      const request = {
        jsonrpc: '2.0',
        id,
        method,
        params
      };
      child.stdin.write(JSON.stringify(request) + '\n');
      return new Promise((res, rej) => {
        pendingRequests.set(id, { resolve: res, reject: rej });
      });
    }

    function sendNotification(method, params) {
      const notification = {
        jsonrpc: '2.0',
        method,
        params
      };
      child.stdin.write(JSON.stringify(notification) + '\n');
    }

    function processLines() {
      let newlineIndex;
      while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, newlineIndex).trim();
        buffer = buffer.slice(newlineIndex + 1);
        if (line) {
          try {
            const response = JSON.parse(line);
            if (response.id && pendingRequests.has(response.id)) {
              const { resolve, reject } = pendingRequests.get(response.id);
              pendingRequests.delete(response.id);
              if (response.error) {
                reject(response.error);
              } else {
                resolve(response.result);
              }
            }
          } catch (err) {
            // ignore JSON parse error of invalid lines
          }
        }
      }
    }

    // Run flow
    (async () => {
      await sendRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'run-mcp', version: '1.0.0' }
      });
      sendNotification('notifications/initialized', {});
      const result = await sendRequest('tools/call', { name, arguments });
      child.stdin.end();
      resolve(result);
    })().catch(err => {
      child.stdin.end();
      reject(err);
    });
  });
}

async function main() {
  const mode = process.argv[2];
  if (mode === 'search') {
    const query = process.argv[3] || 'login';
    console.log(`Searching for: ${query}`);
    const res = await callTool('search_design_kits', { query, limit: 5 });
    console.log(JSON.stringify(res, null, 2));
  } else if (mode === 'list') {
    const res = await callTool('list_popular_kits', { limit: 10 });
    console.log(JSON.stringify(res, null, 2));
  } else if (mode === 'download') {
    const identifier = process.argv[3];
    const path = process.argv[4] || 'DESIGN.md';
    console.log(`Downloading: ${identifier} to ${path}`);
    const res = await callTool('download_design_kit', { identifier, path });
    console.log(JSON.stringify(res, null, 2));
  } else if (mode === 'get') {
    const identifier = process.argv[3];
    console.log(`Getting: ${identifier}`);
    const res = await callTool('get_design_kit', { identifier });
    console.log(JSON.stringify(res, null, 2));
  }
}

main().catch(console.error);
