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
        headless_cms_mode: false,
        mailer_send_api_key: "xxxxxxxxxxxxxxxxxxxxxxxxx",
        s3_endpoint: 'https://ramp-up-prod.s3.sa-east-1.amazonaws.com/',
        s3_key: 'AKIA2HPG37MOPXABZZ75',
        s3_secret: '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',
        s3_bucket: 'ramp-up-prod',
        open_ai_api_key: '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'
      };

    default: //TODO: CONFIGURAR TUDO
      return {
        url: "http://localhost:3005",
        port: 3005,
        env_name: "Desenvolvimento",
        connection_string: "mongodb+srv://admin:xWQHZ3NUmM5DuVis@cluster0.m3susjs.mongodb.net/ramp_up_dev?retryWrites=true&w=majority",
        static_folder: "static",
        jwt_secret_code: "63353ad9ce5efws3d7758a3b4",
        headless_cms_mode: false,
        mailer_send_api_key: "xxxxxxxxxxxxxxxxxxxxxxxxx",
        s3_endpoint: 'https://ramp-up-hml.s3.sa-east-1.amazonaws.com/',
        s3_key: 'AKIA2HPG37MOPXABZZ75',
        s3_secret: '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',
        s3_bucket: 'ramp-up-hml',
        open_ai_api_key: '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'
      };
  }
};

module.exports = config();
