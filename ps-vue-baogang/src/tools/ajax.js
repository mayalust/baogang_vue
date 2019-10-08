import axios from "axios";
class ajax {
  constructor() {
    this.url = "api/rest/post"
  }
  toArray(url) {
    return url.split(/[./]/).filter(d => d);
  }
  join(url1, url2) {
    return `/${this.toArray(url1).concat(this.toArray(url2)).join("/")}`
  }
  parse(str) {
    let d;
    try {
      d = JSON.parse(str);
    } catch {
      return;
    }
    return d;
  }
  toParamString(p) {
    if (p == null) {
      return [];
    }
    if (typeof p == "object") {
      return p;
    }
    return [p];
  }
  post(url, param) {
    param = this.toParamString(param)
    return new Promise((res, rej) => {
      axios.post(this.join(this.url, url), param).then(response => {
        let { data } = response;
        if (data.code == 0) {
          res(data.data);
        } else {
          rej(data);
        }
      }).catch(e => {
        rej(e);
      })
    })
  }
}

function singletonAjax() {
  let instance = null;
  return function () {
    if (instance == null) {
      instance = new ajax
    }
    return instance;
  }
}
export default singletonAjax();