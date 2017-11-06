<template>
    <el-row class="container">
        <el-col :span="24" class="header">
            <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
                {{collapsed?'':sysName}}
            </el-col>
            <el-col :span="10">
                <div class="tools" @click.prevent="collapse">
                    <i class="fa fa-align-justify"></i>
                </div>
            </el-col>
            <el-col :span="4" class="userinfo">
                <el-dropdown trigger="hover">
                    <span class="el-dropdown-link userinfo-inner">
                        <img :src="this.sysUserAvatar" /> {{sysUserName}}
                        <!-- <el-badge class="mark" :value="newFiles" /></el-badge> -->
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <!-- <el-dropdown-item>收到的共享文件</el-dropdown-item> -->
                        <el-dropdown-item @click.native="pwdFormVisible = true">修改密码</el-dropdown-item>
                        <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-col>
        <el-col :span="24" class="main">
            <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
                <!--导航菜单-->
                <el-menu :default-active="$route.path" class="el-menu-vertical-demo" unique-opened router v-show="!collapsed">
                    <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
                        <el-submenu :index="index+''" v-if="!item.leaf">
                            <template slot="title">
                                <i :class="item.iconCls"></i>{{item.name}}</template>
                            <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
                        </el-submenu>
                        <el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path">
                            <i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
                    </template>
                </el-menu>
                <!--导航菜单-折叠后-->
                <ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
                    <li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item">
                        <template v-if="!item.leaf">
                            <div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
                                <i :class="item.iconCls"></i>
                            </div>
                            <ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
                                <li v-for="child in item.children" v-if="!child.hidden" :key="child.path" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">{{child.name}}</li>
                            </ul>
                        </template>
                        <template v-else>
                            <li class="el-submenu">
                                <div class="el-submenu__title el-menu-item" style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" :class="$route.path==item.children[0].path?'is-active':''" @click="$router.push(item.children[0].path)">
                                    <i :class="item.iconCls"></i>
                                </div>
                            </li>
                        </template>
                    </li>
                </ul>
            </aside>
            <section class="content-container">
                <div class="grid-content bg-purple-light">
                    <el-col :span="24" class="breadcrumb-container">
                        <strong class="title">{{$route.name}}</strong>
                        <el-breadcrumb separator="/" class="breadcrumb-inner">
                            <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                                {{ item.name }}
                            </el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                    <el-col :span="24" class="content-wrapper">
                        <transition name="fade" mode="out-in">
                            <router-view></router-view>
                        </transition>
                    </el-col>
                </div>
            </section>
        </el-col>
        <!--添加模板的界面-->
        <el-dialog title="修改密码" v-model="pwdFormVisible" :close-on-click-modal="false" size="tiny">
          <el-form :model="pwdForm" label-width="100px" :rules="pwdFormRules" ref="pwdForm">
            <el-form-item label="原密码：" prop="oldPwd">
              <el-input type="password" v-model="pwdForm.oldPwd" style="width:90%"></el-input>
            </el-form-item>
            <el-form-item label="新密码：" prop="newPwd">
              <el-input v-model="pwdForm.newPwd" style="width:90%"></el-input>
            </el-form-item>
            <el-form-item label="重输新密码：" prop="newSecPwd">
              <el-input v-model="pwdForm.newSecPwd" style="width:90%"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="pwdFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="updatePwd">提交</el-button>
          </div>
        </el-dialog>
    </el-row>
</template>

<script>
import { editUser } from "../config/api";
export default {
  data() {
    return {
      loginUser: {},
      sysName: "PDM - iData",
      collapsed: false,
      sysUserName: "",
      sysUserAvatar: "../assets/avatar.jpg",
      newFiles: 3,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      pwdFormVisible: false,
      pwdForm: {
        oldPwd: "",
        newPwd: "",
        newSecPwd: ""
      },
      pwdFormRules: {
        oldPwd: [{ required: true, message: "请输入原密码", trigger: "blur" }],
        newPwd: [{ required: true, message: "请输入新密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    updatePwd: function() {
      var _this = this;
      _this.$refs.pwdForm.validate(valid => {
        if (valid) {
          if (_this.pwdForm.oldPwd != _this.loginUser.loginPassword) {
            _this.$message({ message: "原密码错误，重新输入！", type: "warning" });
          } else {
            if (_this.pwdForm.newPwd != _this.pwdForm.newSecPwd) {
              _this.$message({ message: "新密码两次输入的不一致，重新输入！", type: "warning" });
            } else {
              let para = {
                employeeId: _this.loginUser.employeeId,
                loginPassword: _this.pwdForm.newPwd
              };
              editUser(para).then(res => {
                _this.$message({
                  message: "更新密码成功，下次请用新密码登录",
                  type: "success"
                });
                _this.loginUser.loginPassword = _this.pwdForm.newPwd;
                sessionStorage.setItem("user", JSON.stringify(_this.loginUser));
                _this.pwdForm = {
                  oldPwd: "",
                  newPwd: "",
                  newSecPwd: ""
                };
                _this.pwdFormVisible = false;
              });
            }
          }
        } else {
          return false;
        }
      });
    },
    //退出登录
    logout: function() {
      var _this = this;
      this.$confirm("确认退出吗?", "提示", {
        //type: 'warning'
      })
        .then(() => {
          sessionStorage.removeItem("user");
          this.$router.push("/login");
        })
        .catch(() => {});
    },
    //折叠导航栏
    collapse: function() {
      this.collapsed = !this.collapsed;
    },
    showMenu(i, status) {
      this.$refs.menuCollapsed.getElementsByClassName(
        "submenu-hook-" + i
      )[0].style.display = status ? "block" : "none";
    }
  },
  mounted() {
    var user = sessionStorage.getItem("user");
    if (user) {
      user = JSON.parse(user);
      this.loginUser = user;
      this.sysUserName = user.displayName;
      //this.sysUserAvatar = 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png';
      this.sysUserAvatar = require("../assets/avatar.jpg");
    }
  }
};
</script>

<style scoped lang="scss">
.mark {
  margin-top: -10px;
  margin-right: -15px;
}

.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  .header {
    height: 60px;
    line-height: 60px;
    background: #20a0ff;
    color: #fff;
    .userinfo {
      text-align: right;
      padding-right: 35px;
      float: right;
      .userinfo-inner {
        cursor: pointer;
        color: #fff;
        img {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          margin: 10px 0px 10px 10px;
          float: right;
        }
      }
    }
    .logo {
      //width:230px;
      height: 60px;
      font-size: 22px;
      padding-left: 20px;
      padding-right: 20px;
      border-color: rgba(238, 241, 146, 0.3);
      border-right-width: 1px;
      border-right-style: solid;
      img {
        width: 40px;
        float: left;
        margin: 10px 10px 10px 18px;
      }
      .txt {
        color: #fff;
      }
    }
    .logo-width {
      width: 230px;
    }
    .logo-collapse-width {
      width: 60px;
    }
    .tools {
      padding: 0px 23px;
      width: 14px;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
    }
  }
  .main {
    display: flex; // background: #324057;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;
    aside {
      flex: 0 0 230px;
      width: 230px; // position: absolute;
      // top: 0px;
      // bottom: 0px;
      .el-menu {
        height: 100%;
      }
      .collapsed {
        width: 60px;
        .item {
          position: relative;
        }
        .submenu {
          position: absolute;
          top: 0px;
          left: 60px;
          z-index: 99999;
          height: auto;
          display: none;
        }
      }
    }
    .menu-collapsed {
      flex: 0 0 60px;
      width: 60px;
    }
    .menu-expanded {
      flex: 0 0 230px;
      width: 230px;
    }
    .content-container {
      // background: #f1f2f7;
      flex: 1; // position: absolute;
      // right: 0px;
      // top: 0px;
      // bottom: 0px;
      // left: 230px;
      overflow-y: scroll;
      padding: 20px;
      .breadcrumb-container {
        //margin-bottom: 15px;
        .title {
          width: 200px;
          float: left;
          color: #475669;
        }
        .breadcrumb-inner {
          float: right;
        }
      }
      .content-wrapper {
        background-color: #fff;
        box-sizing: border-box;
      }
    }
  }
}
</style>