module.exports = {
  apps: [
    {
      name: "sbi-app",
      cwd: "/var/www/app",
      script: ".output/server/index.mjs",
      interpreter: "node",
      node_args: "--env-file=/var/www/app/.env",
      env: {
        NODE_ENV: "production",
        HOST: "127.0.0.1",
        PORT: "3000"
      },
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      restart_delay: 3000,
      max_memory_restart: "500M",
      time: true
    }
  ]
};
