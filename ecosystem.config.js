module.exports = {
  apps: [
    {
      name: 'admin-backend',
      script: 'dist/src/main.js', // 项目入口文件
      instances: '1', // 使用所有 CPU 核心
      autorestart: true, // 自动重启
      watch: false, // 监听文件变化，可根据需要启用
      max_memory_restart: '1G', // 内存达到 1GB 时重启
    },
  ],
};
