import axios from "axios";
import { emitToastr } from "./Utils";

const API_URL = "http://localhost:3005/admin";

class Api {
  login = async (email, password, remember) => {
    const endpoint = "/auth";
    let result = await this.authPost(endpoint, { email, password, remember });

    if (result && result.token && result.user) {
      window.localStorage.setItem("token", result.token);
      delete result.token;
      window.localStorage.setItem("user", JSON.stringify(result.user));
      result.login_ok = true;
    }

    return result;
  };

  logout = async () => {
    window.localStorage.removeItem("user");
    window.localStorage.removeItem("token");
    window.location.href = "/login";
  };

  getUser = () => {
    let user = window.localStorage.getItem("user");
    try {
      user = JSON.parse(user);
      return user;
    } catch {
      return {};
    }
  };

  getToken = () => {
    return window.localStorage.getItem("token") || "";
  };

  getRemoteUser = async () => {
    const user = await this.authPost("/get-user", {}, {});

    if (user && user._id) {
      window.localStorage.setItem("user", JSON.stringify(user));
      return user;
    }
    else {
      this.logout();
    }
  };

  uploadProfilePicture = async (image) => {
    const resp = await this.authPost("/upload-profile-picture", { image: image }, { multipart: true, formData: true }); //ESSE TEM ESSAS OPÇÕES PORQUE ESTÁ ENVIANDO UMA IMAGEM AO INVÉS DE UM JSON
    return resp;
  };

  updateUser = async (user) => {
    const resp = await this.authPost("/update-user", { user }, {});

    return resp;
  }

  recoveryPassword = async (email) => {
    const resp = await this.authPost("/send-password-recovery", { email: email }, {});
    return resp;
  };

  changeUserPassword = async (password, old_password) => {
    const resp = await this.authPost("/change-user-password", { password, old_password }, {});
    return resp;
  };

  checkErrorsWithStatusCode200 = (data) => {
    if (data.error) return emitToastr("error", data.message || "Erro não identificado!", "Erro");
    return data;
  };

  get = (url) =>
    axios
      .get(`${API_URL}${url}`)
      .then((response) => this.checkErrorsWithStatusCode200(response.data))
      .catch(() => {
        emitToastr("error", "Erro genérico de servidor!", "Erro");
      });

  authGet = (url, data) =>
    axios
      .get(`${API_URL}${url}`, { headers: { auth: this.getToken() }, params: data })
      .then((response) => this.checkErrorsWithStatusCode200(response.data))
      .catch((err) => {
        if (err && err.response && err.response.status === 401) {
          emitToastr("error", "Erro de servidor! Confira se as informações enviadas estão completas e no formato correto e tente novamente.", "Erro");
          if (err.response.data && err.response.data.logoff === true) this.logout();
        } else {
          if (err.response && err.response.data && err.response.data.error && err.response.data.message) return emitToastr("error", err.response.data.message);
          console.log("Erro genérico de servidor");
        }
      });

  authPost = (url, data, options) => {
    const headers = { auth: this.getToken() };
    if (options) {
      if (options.multipart) {
        headers["Content-Type"] = "multipart/form-data";
      }
      if (options.formData) {
        let formData = new FormData();
        for (let key in data) {
          formData.append(key, data[key]);
        }
        data = formData;
      }
    }
    return axios
      .post(`${API_URL}${url}`, data, { headers })
      .then((response) => this.checkErrorsWithStatusCode200(response.data))
      .catch((err) => {
        console.error(err.response);
        if (err && err.response && err.response.status === 401) {
          emitToastr("error", "Erro de servidor! Confira se as informações enviadas estão completas e no formato correto e tente novamente.", "Erro");
          if (err.response.data && err.response.data.logoff === true) this.logout();
        } else {
          if (err.response && err.response.data && err.response.data.error && err.response.data.message) {
            return emitToastr("error", err.response.data.message);
          } else if (err.response && err.response.status) emitToastr("error", err.response.statusText + " (status: " + err.response.status + ")", "Erro");
          else emitToastr("error", "Erro genérico de servidor!", "Erro");
          err.response.error = err.response.error || true;
          return err.response;
        }
      });
  };
}

export default new Api();
