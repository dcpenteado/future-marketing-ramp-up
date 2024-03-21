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
      return false;
    }
  };

  uploadProfilePicture = async (image) => {
    const resp = await this.authPost("/upload-profile-picture", { image: image }, { multipart: true, formData: true }); //ESSE TEM ESSAS OPÇÕES PORQUE ESTÁ ENVIANDO UMA IMAGEM AO INVÉS DE UM JSON
    return resp;
  };

  uploadImage = async (image) => {
    const resp = await this.authPost("/upload-image", { image: image }, { multipart: true, formData: true });
    return resp;
  };

  createUser = async (user) => {
    const resp = await this.authPost("/create-user", { user }, {});
    return resp;
  }

  updateUser = async (user) => {
    const resp = await this.authPost("/update-user", { user }, {});
    return resp;
  }

  getCustomers = async () => {
    const resp = await this.authPost("/get-customers", {}, {});
    return resp;
  }

  getAdministrators = async () => {
    const resp = await this.authPost("/get-administrators", {}, {});
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

  getForms = async () => {
    const resp = await this.authPost("/get-forms", {}, {});

    return resp;
  }

  getFormById = async (form_id) => {
    const resp = await this.authPost("/get-form-by-id", { id: form_id }, {});

    return resp;
  }

  getFormResponses = async () => {
    const resp = await this.authPost("/get-form-responses", {}, {});

    return resp;
  }

  getFormResponseByUserId = async (user_id) => {
    return this.authPost("/get-form-response-by-user-id", { user_id }, {})
  }

  getFormResponseById = async (form_response_id) => {
    return this.authPost("/get-form-response-by-id", { id: form_response_id }, {})
  }

  createOrUpdateFormResponse = async (form_response) => {
    return this.authPost("/create-or-update-form-response", { object: form_response }, {})
  }

  setFormResponseStatus = async (form_response_id, status) => {
    return this.authPost("/set-form-response-status", { form_response_id, status }, {});
  }

  checkErrorsWithStatusCode200 = (data) => {
    if (data.error) {
      emitToastr("error", data.message || "Erro não identificado!", "Erro");
    }

    return data;
  };

  // create-form-response-answers
  createFormResponseAnswers = async (form_response_id, answers) => {
    return this.authPost("/create-form-response-answers", {
      object: {
        _id: form_response_id,
        answers: answers
      }
    }, {});
  }

  getRampUpElementsByFormId = async (form_id) => {
    return this.authPost("/get-ramp-up-elements-by-form-id", { form_id }, {});
  }

  createOrUpdateRampUpElement = async (ramp_up_element) => {
    return this.authPost("/create-or-update-ramp-up-element", { object: ramp_up_element }, {});
  }

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
            return { error: true, message: err.response.data.message };
          } else if (err.response && err.response.status) emitToastr("error", err.response.statusText + " (status: " + err.response.status + ")", "Erro");
          else emitToastr("error", "Erro genérico de servidor!", "Erro");
          err.response.error = err.response.error || true;
          return err.response;
        }
      });
  };
}

export default new Api();
