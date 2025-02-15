module.exports = {
  apps: [
    {
      name: "my_blog",
      script: "/usr/bin/npm", // Абсолютный путь к npm
      args: "start --prefix /home/admin/my_blog",
      cwd: "/home/admin/my_blog", // Рабочая директория
      error_file: "/home/admin/.pm2/logs/my-blog-error.log",
      out_file: "/home/admin/.pm2/logs/my-blog-out.log",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
