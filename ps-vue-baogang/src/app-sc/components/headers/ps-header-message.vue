<template>
  <ul class="ps-dropdown-menu">
    <li class="header align-center info-box-number title">
      消息通知
    </li>
    <li class="dropdown-content" style="padding:0;">
      <el-scrollbar
        tag="li"
        wrap-class="el-select-dropdown__wrap"
        view-class="el-select-dropdown__list"
        ref="scrollbar"
      >
        <ul class="menu" v-if="unreadMessages.length == 0">
          <li class="msg-li no-info">
            您暂时没有新的消息
          </li>
        </ul>
        <ul class="menu" v-if="unreadMessages.length > 0">
          <li class="msg-li" v-for="msg in unreadMessages" :key="msg.id">
            <p>
              <a
                class="msg-title"
                @click="messageClick(msg)"
                :title="msg.message.title"
                v-text="msg.message.title"
              ></a
              ><span
                class="pull-right msg-txt"
                :title="getSenderTxt(msg)"
                :style="getMsgSty(msg)"
                v-text="getMsgTxt(msg)"
              ></span>
            </p>
            <p class="txt-content" v-text="msg.message.content"></p>
            <p
              class="txt-content"
              v-text="dateToString(msg.message.insertTime)"
            ></p>
          </li>
        </ul>
      </el-scrollbar>
    </li>
  </ul>
</template>
<script>
import mapper from "../../../tools/mapper";
import psutil from "ps-ultility";
const { mapState, mapGetters, mapMutations, mapActions } = mapper,
  { dateparser } = psutil;
export default {
  computed: {
    ...mapState({
      generalInfo: ["unreadMessages"]
    }),
    ...mapGetters({
      userInfo: ["messageType"]
    })
  },
  methods: {
    ...mapMutations({
      generalInfo: ["removeReadedMessage"]
    }),
    messageClick(msg) {
      let {
        message: { msgType, content },
        messageId
      } = msg;
      this.$ps.post("psMessageService.modifyMsgStatus", [messageId]).then(d => {
        if (
          msgType == "ticket_message" ||
          msgType == "alert_message_insystem"
        ) {
          return this.generalInfo(messageId);
        }
        if (msgType == "payment_message") {
          location.href = "../app-uc/index.html#/expenses";
        } else if (msgType == "maintenance_msg") {
          location.href = `../app-oc/index.html#/maintenance/${content.trim()}`;
        } else {
          location.href = `../app-uc/index.html#/messageDetail/${messageId}`;
        }
      });
    },
    getSenderTxt(msg) {
      let messageType = this.messageType,
        {
          message: { msgType },
          sender
        } = msg;
      if (messageType[sender] == null) {
        return;
      }
      return messageType[sender]["senderTxt"];
    },
    getMsgSty(msg) {
      let messageType = this.messageType,
        {
          message: { msgType },
          sender
        } = msg;
      if (messageType[sender] == null) {
        return;
      }
      return { "background-color": messageType[sender]["msgSty"] };
    },
    getMsgTxt(msg) {
      let messageType = this.messageType,
        {
          message: { msgType },
          sender
        } = msg;
      if (messageType[sender] == null) {
        return;
      }
      return messageType[sender]["msgTxt"];
    },
    dateToString(time) {
      return dateparser(time).getDateString("yyyy-MM-dd hh:mm:ss");
    }
  }
};
</script>
<style lang="less" scoped>
ul.ps-dropdown-menu {
  width: 300px;
  max-height: 327px;
  overflow: hidden;
  margin: 0;
  padding: 0;
  background-color: #3a5066;
  li {
    &.no-info {
      color: white;
      font-size: 14px;
      height: 200px;
      text-align: center;
      line-height: 200px;
    }
    &.title {
      background-color: #cdcdcd;
    }
    &.dropdown-content {
      max-height: 260px;
      overflow: hidden;
      ul {
        &.menu {
          margin: 0;
          padding: 0;
          max-height: 255px;
          li {
            p {
              margin: 0;
              a {
                cursor: pointer;
              }
              &.txt-content {
                color: #cacaca;
              }
            }
          }
        }
      }
    }
    list-style: none;
    padding: 10px;
    border-radius: 3px;
  }
}
</style>


