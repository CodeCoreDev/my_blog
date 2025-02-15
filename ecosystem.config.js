module.exports = {
  apps: [
    {
      name: "my_blog",
      script: "npm",
      args: "start",
      cwd: "/home/admin/my_blog", // Путь к проекту
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
