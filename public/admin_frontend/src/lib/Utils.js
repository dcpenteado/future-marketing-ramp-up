const toastr = require("toastr");
const toastrOptions = { transitionIn: "fadeIn", transitionOut: "fadeOut", position: "top-right", progressBar: true };

const emitToastr = (type = "error", title = "", message = "") => {
  return toastr[type](title, message, toastrOptions);
};

export { emitToastr };
