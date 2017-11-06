<template>
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
        <h3 class="title">系统登录</h3>
        <el-form-item prop="loginName">
            <el-input type="text" v-model="ruleForm2.loginName" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="loginPassword">
            <el-input type="password" v-model="ruleForm2.loginPassword" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
        <el-form-item style="width:100%;">
            <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { requestLogin } from '../config/api';
export default {
    data() {
        return {
            logining: false,
            ruleForm2: {
                loginName: '',
                loginPassword: ''
            },
            rules2: {
                loginName: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                ],
                loginPassword: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ]
            },
            checked: true
        };
    },
    methods: {
        handleReset2() {
            this.$refs.ruleForm2.resetFields();
        },
        handleSubmit2(ev) {
            var _this = this;
            this.$refs.ruleForm2.validate((valid) => {
                if (valid) {
                    this.logining = true;
                    var loginParams = { loginName: this.ruleForm2.loginName, loginPassword: this.ruleForm2.loginPassword };
                    requestLogin(loginParams).then(data => {
                        this.logining = false;
                        if (data == '') {
                            this.$message({
                                message: '登录失败，请检查用户名和密码是否正确。',
                                type: 'error'
                            });
                        } else {
                            sessionStorage.setItem('user', JSON.stringify(data));
                            this.$router.push({ path: '/public' });
                        }
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
}

</script>

<style lang="scss" scoped>
.login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
    }
    .remember {
        margin: 0px 0px 35px 0px;
    }
}
</style>