const { spawn } = require('child_process');

async function main() {
  const env = { ...process.env, DESIGNMD_API_KEY: 'dk_33b90a5b01fd8e5002e0560c0f9c0677b3c8788a' };
  // Run npx designmd-mcp (on Windows, npx is a cmd/cmd.exe shim or we should run it via shell)
  const child = spawn('npx.cmd', ['designmd-mcp'], { env, shell: true });

  let buffer = '';

  child.stdout.on('data', (data) => {
    buffer += data.toString();
    processLines();
  });

  child.stderr.on('data', (data) => {
    console.error('SERVER STDERR:', data.toString());
  });

  child.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
  });

  const pendingRequests = new Map();
  let nextId = 1;

  function sendRequest(method, params) {
    const id = nextId++;
    const request = {
      jsonrpc: '2.0',
      id,
      method,
      params
    };
    const json = JSON.stringify(request) + '\n';
    child.stdin.write(json);
    return new Promise((resolve, reject) => {
      pendingRequests.set(id, { resolve, reject });
    });
  }

  function sendNotification(method, params) {
    const notification = {
      jsonrpc: '2.0',
      method,
      params
    };
    const json = JSON.stringify(notification) + '\n';
    child.stdin.write(json);
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
          console.error('Failed to parse line:', line, err);
        }
      }
    }
  }

  // Handshake
  console.log('Sending initialize...');
  const initResult = await sendRequest('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: {
      name: 'test-client',
      version: '1.0.0'
    }
  });
  console.log('Initialize response received:', JSON.stringify(initResult, null, 2));

  sendNotification('notifications/initialized', {});
  console.log('Sent initialized notification');

  // List tools
  console.log('Listing tools...');
  const toolsResult = await sendRequest('tools/list', {});
  console.log('Tools list:', JSON.stringify(toolsResult, null, 2));

  // Perform a test search if arguments were passed
  const args = process.argv.slice(2);
  if (args.length > 0) {
    const toolName = args[0];
    const toolArgs = JSON.parse(args[1] || '{}');
    console.log(`Calling tool ${toolName} with args:`, toolArgs);
    const callResult = await sendRequest('tools/call', {
      name: toolName,
      arguments: toolArgs
    });
    console.log('Tool call result:', JSON.stringify(callResult, null, 2));
  }

  child.stdin.end();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
