const config = () => {
  switch (process.env.NODE_ENV) {
    case "prod": //TODO: CONFIGURAR TUDO
      return {
        url: "",
        port: 3005,
        env_name: "Produção",
        connection_string: "mongodb+srv://admin:xWQHZ3NUmM5DuVis@cluster0.m3susjs.mongodb.net/ramp_up_prod?retryWrites=true&w=majority",
        static_folder: "static",
        jwt_secret_code: "63353ad9ce5e9ss3d7758a3b4",
        headless_cms_mode: false
      };

    default: //TODO: CONFIGURAR TUDO
      return {
        url: "http://localhost:3005",
        port: 3005,
        env_name: "Desenvolvimento",
        connection_string: "mongodb+srv://admin:xWQHZ3NUmM5DuVis@cluster0.m3susjs.mongodb.net/ramp_up_dev?retryWrites=true&w=majority",
        static_folder: "static",
        jwt_secret_code: "63353ad9ce5efws3d7758a3b4",
        headless_cms_mode: false
      };
  }
};

module.exports = config();
