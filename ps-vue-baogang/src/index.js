import Ajax from "./tools/ajax";

let ajax = Ajax();
ajax.post("userLoginUIService.getCurrentUser").then(user => {
  return ajax.post("resourceUIService.getAppData").then(appData => {
    let { industry, loginTimes } = user;
    if (!industry) {
      if (!appData) {
        if (loginTimes == 0) {
          location.href = "app-uc/password.html";
          return;
        }
        location.href = "app-oc/index.html";
        return;
      }
      if (loginTimes == 0) {
        location.href = "app-uc/password.html";
        return;
      }
      location.href = "app-oc/index.html";
      return;
    }
    if (loginTimes == 0) {
      location.href = "app-uc/password.html";
      return;
    }
    let {
      functionList: [{
        functionCode
      }]
    } = user;
    if (functionCode == "F02") {
      location.href = "./index_sc.html";
      return;
    }
    if (functionCode == "F04") {
      location.href = "app-uc/index.html";
      return;
    }
    location.href = "./index_oc.html";
    return;
  })
}).catch(e => {
  location.href = "./login.html";
});