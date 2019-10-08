import Ajax from "./tools/ajax";
import Vue from "vue";
import "./css/login.css";
let ajax = Ajax(),
  [el] = document.getElementsByTagName("app-login");

new Vue({
  render() {
    let { username, password, errorMsg } = this;
    return (
      <div id="login" class="ps-container">
        <div id="center">
          <form class="login" method="post">
            <input
              v-model="username"
              class="username"
              placeholder="工号"
              type="text"
              value={username}
              onInput={({ currentTarget: { value } }) => {
                this.username = value;
              }}
            />
            <input
              v-model="password"
              class="passwd"
              placeholder="密码"
              type="password"
              value={password}
              autocomplete="true"
              onInput={({ currentTarget: { value } }) => {
                this.password = value;
              }}
            />
            {errorMsg != null ? (
              <div
                style="color:#f14141;font-size: 12px"
                class="error-msg"
                domPropsInnerText={errorMsg}
              ></div>
            ) : null}
            <input
              class="submit"
              onClick={e => {
                let { username, password } = this;
                e.preventDefault();
                this.login(username, password);
              }}
              value="登 录"
              type="submit"
            />
            <label class="click-l">
              <a
                style="text-decoration: none;color: whitesmoke;font-size: 12px"
                href="/app-uc/forgetPassword.html"
              >
                忘记密码
              </a>
            </label>
          </form>
        </div>
        <div style="width: 550px;margin: 30px auto 0;text-align: center;color: #fff;font-size: 0;font-weight: bold;">
          <div style="display: inline-block;">
            <p style="font-size: 24px;">技术支持：</p>
          </div>
          <div style="display: inline-block;vertical-align: top">
            <p style="font-size: 24px">郑益文13301906311</p>
            <p style="font-size: 24px">卢张烽15061963282</p>
          </div>
        </div>
      </div>
    );
  },
  data() {
    return {
      username: "",
      password: "",
      errorMsg: null
    };
  },
  methods: {
    login(username, password) {
      ajax
        .post("userLoginUIService.login", [username, password])
        .then(() => {
          this.errorMsg = null;
          location.href = "./";
        })
        .catch(e => {
          this.errorMsg = e.message;
        });
    }
  }
}).$mount(el);
