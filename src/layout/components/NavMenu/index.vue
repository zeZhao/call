<template>
  <div class="NavMenu">
    <div class="nav_conent">
      <div class="nav_conent_title">呼叫中心</div>

      <div class="nav_conent_handle clearfix">
        <Tel class="handle" v-show="isShowTel"></Tel>
        <div class="user">
          <span>工号：{{ info.jobNumber }}</span>
          <div v-if="isShowTel">
            <span>状态：</span>
            <el-select
              v-model="states"
              style="width: 100px"
              @change="changeStates"
            >
              <el-option label="就绪" :value="2"></el-option>
              <el-option label="暂停" :value="4"></el-option>
            </el-select>
          </div>

          <el-button
            type="text"
            style="margin: 0 20px; height: 80px"
            @click="logout"
            >退出</el-button
          >
        </div>
      </div>
    </div>
    

    <el-dialog
      title="温馨提示"
      :visible.sync="confirmVisible"
      :close-on-click-modal="false"
      :show-close="false"
      width="30%"
      custom-class="confirm_visible"
    >
      <div slot="title" class="header_title">
        <span
          ><i
            class="el-icon-warning"
            style="color: #ff8800; font-size: 26px"
          ></i>
        </span>
        <span class="title">是否退出登录？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="submitExport"
          style="margin-left: 16px"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { setStorage, getStorage } from "@/utils/auth.js";
import {
  logout,
} from "@/assets/js/verto";
import Tel from "@/components/Tel"

export default {
  components: {Tel},
  data() {
    return {
      name: "xxx",
      account: "xxx",
      confirmVisible: false,
      states: 2,
      info: JSON.parse(getStorage("info")),
      isShowTel: true,
    };
  },
  created() {
  },
  mounted() {
    if (JSON.parse(getStorage("info")) !== null) {
      const { name, account, sysMenus, } = JSON.parse(getStorage("info"));
      
      this.name = name;
      this.account = account;
      this.$nextTick(() => {
        if (sysMenus && sysMenus.length > 0) {
          sysMenus.forEach((item) => {
            if (item.linkUrl === "/tel" && item.ifChecked === "1") {
              this.$nextTick(() => {
                this.isShowTel = true;
              });
            } else {
              this.isShowTel = false;
            }
          });
        } else {
          this.isShowTel = false;
        }
      });
    }
  },
  computed: {},
  methods: {
    async logout(e) {
      await this.$http.login.logout().then((res) => {
        if (res.state === "200") {
          try {
            logout();
            
            setStorage("token");
            setStorage("info");
            this.$router.push("/login");
            if (!this.$store.state.IsLogin) {
              this.$message.success("退出成功！");
            }
          } catch {
            setStorage("token");
            setStorage("info");
            this.$router.push("/login");
            if (!this.$store.state.IsLogin) {
              this.$message.success("退出成功！");
            }
          }
        }
      });
    },
    handleCommand() {
      this.confirmVisible = true;
    },
    submitExport() {
      try {
      } catch {}
      setStorage("token");
      setStorage("info");
      this.$router.push("/login");
      // logout().then((res) => {
      //   if (res.code === 200) {
      //     this.$message.success("退出成功");
      //   }
      // });
    },
    changeStates(e) {
      this.$http.role
        .updateAttendAndLoginMode({
          attendId: this.info.attendId,
          attendStatus: e,
        })
        .then((res) => {
          if (res.state === "200") {
            this.$message.success("修改状态成功");
          } else {
            this.$message.error("修改状态失败");
          }
        });
    },
  },
  destroyed() {
  },
  watch: {
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-dropdown-menu__item:focus,
::v-deep .el-dropdown-menu__item:not(.is-disabled):hover {
  color: #1890ff !important;
  background: #f3f9ff !important;
}
.NavMenu {
  width: 100%;
  height: 80px;
  line-height: 80px;
  // background: url("../../../assets/images/header_back.png") no-repeat;
  background-size: cover;
  overflow: hidden;
  background: #182131;
  .nav_conent {
    background: #182131;
    color: #fff;
    .nav_conent_title {
      width: 176px;
      float: left;
      text-align: center;
      // padding-left: 24px;
      font-family: PingFangSC-Medium;
      font-weight: Medium;
      font-size: 22px;
      color: #ffffff;
      font-weight: bold;
    }
    .nav_conent_handle {
      float: right;
      height: 80px;
      line-height: 80px;
      // display: flex;
      // justify-content: center;
      // align-items: center;
      width: calc(100% - 176px);
      .tellInp{
        ::v-deep .el-input__inner{
          border-top-right-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
          border-right: none !important;
        }
      }
      .tellBtn {
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
        padding: 12px 10px !important;
      }
      .shake {
        animation: shake 800ms ease-in-out infinite;
      }
      @keyframes shake {
        /* 水平抖动，核心代码 */
        10%,
        90% {
          transform: translate3d(-1px, 0, 0);
        }
        20%,
        80% {
          transform: translate3d(+2px, 0, 0);
        }
        30%,
        70% {
          transform: translate3d(-4px, 0, 0);
        }
        40%,
        60% {
          transform: translate3d(+4px, 0, 0);
        }
        50% {
          transform: translate3d(-4px, 0, 0);
        }
      }
      .handle_name {
        line-height: 1;
        .name_txt {
          padding-right: 0px;
        }
        .name_img {
          display: inline-block;
          margin-top: 4px;
          margin-right: 5px;
          vertical-align: bottom;
          width: 14px;
          height: 14px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      ::v-deep .el-dropdown {
        height: 80px;
      }

      ::v-deep .el-dropdown-link {
        height: 80px;
        display: inline-block;
        border-top: 0 red solid;
      }
      ::v-deep .el-dropdown-link .link_img {
        display: inline-block;
        margin-top: 13px;
        margin-right: 12px;
        width: 36px;
        height: 36px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      ::v-deep .el-dropdown-link .link_account {
        display: inline-block;
        vertical-align: top;
        font-family: PingFangSC-Medium;
        font-weight: Medium;
        font-size: 16px;
        color: #ffffff;
        i {
          font-size: 10px;
        }
      }

      span,
      .handle_name {
        padding-right: 20px;
        font-family: PingFangSC-Regular;
        font-weight: Regular;
        font-size: 14px;
        color: #ffffff;
      }
      span:last-child {
        cursor: pointer;
      }
      .user,
      .handle {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .handle {
        float: left;
        height: 80px;
      }
      .user {
        float: right;
      }
    }
  }
  ::v-deep .confirm_visible {
    height: 128px;
    line-height: 1;
    .header_title {
      .title {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #1f2329;
        line-height: 24px;
        padding-left: 16px;
        vertical-align: text-bottom;
      }
      .content {
        font-family: PingFangSC-Regular;
        font-weight: Regular;
        font-size: 14px;
        color: #1f2329;
        padding-top: 8px;
        padding-left: 42px;
      }
    }
    .el-dialog__header {
      padding: 24px 24px 10px;
    }
    .el-dialog__body {
      padding: 0;
    }
    .el-dialog__footer {
      padding: 10px 24px 24px;
      margin-top: 4px;
    }
  }
}
</style>
