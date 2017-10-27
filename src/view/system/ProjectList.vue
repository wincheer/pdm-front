<template>
    <section>
        <!--项目工具条-->
        <el-col :span='24' class="toolbar" style="padding-bottom: 10px;">
            <el-button type="primary" icon="document" @click.native="projectFormVisible = true">新建项目</el-button>
        </el-col>
        <!--项目列表-->
        <el-col>
            <el-card :body-style="{ padding: '0px'}" :style="{ width: '140px', float:'left',margin:'15px'}"  v-for="(o, index) in projectList" :key="o">
                <img src="../../assets/folder.jpg" class="image">
                <div style="padding: 5px;">
                    <el-tooltip :content="o.desc" effect="light">
                        <span>{{o.pname}}</span>
                    </el-tooltip>
                    <div class="bottom clearfix">
                        <time class="time">{{o.cdate}}</time>
                        <el-dropdown>
                            <el-button type="info" size="mini">
                                操作<i class="el-icon-caret-bottom el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>编辑目录</el-dropdown-item>
                                <el-dropdown-item>分配项目成员</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </el-card>
        </el-col>
        <!--项目操作-->
        <el-dialog title="新建项目" v-model="projectFormVisible" :close-on-click-modal="false" size="tiny">
          <el-form :model="projectForm" label-width="100px" :rules="projectFormRules" ref="projectForm">
            <el-form-item label="项目名称：" prop="projectName">
              <el-input v-model="projectForm.projectName" style="width:90%"></el-input>
            </el-form-item>
            <el-form-item label="项目描述：" prop="projectDesc">
              <el-input v-model="projectForm.projectDesc" style="width:90%"></el-input>
            </el-form-item>
            <el-form-item label="项目模板：" prop="templateId">
              <el-select v-model="projectForm.templateId" placeholder="请选择模板...">
                <el-option v-for="item in templateList" :key="item.templateId" :label="item.templateName" :value="item.templateId" />
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="projectFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="saveProject" :loading="loading">提交</el-button>
          </div>
        </el-dialog>
    </section>  
</template>

<script>
import { queryProjectList,insertProject,queryTemplateList } from "../../config/api";
export default {
  data() {
    return {
      loading: false,
      //新建项目
      projectFormVisible:false,
      templateList: [],
      projectForm:{
          projectName:'',
          projectDesc:'',
          templateId:null,
          createDate:null
      },
      projectFormRules: {
        projectName: [{ required: true, message: "请输入目录名", trigger: "blur" }],
        //templateId: [{ required: true, message: "请选择项目模板", trigger: "change" }]
      },
      //项目列表
      projectList: [
        { pname: "项目1", cdate: "2017-01-12", desc: "项目不是信息，项目标书信息" },
        { pname: "小项目", cdate: "2016-12-30", desc: "项目描述" },
        { pname: "大项目很大", cdate: "2017-10-05", desc: "项目全名" }
      ]
    };
  },
  methods: {
    queryProjects: function() {
      queryProjectList().then(res => {
        this.projectList = res.data;
        this.loading = false;
      });
    },
    queryTemplates: function() {
      queryTemplateList().then(res => {
        this.templateList = res.data;
        this.loading = false;
      });
    },
    saveProject: function() {
      this.$refs.projectForm.validate(valid => {
        if (valid) {
          this.projectForm.createDate = new Date();
          let para = Object.assign({}, this.projectForm);
          insertProject(para).then(res => {
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.loading = false;
            this.projectFormVisible = false;
            this.queryTemplates();
          });
        }
      });
    },
    
  },
  mounted() {
      this.queryTemplates();
  }
};
</script>

<style scoped>
.image {
  width: 140px;
  height: 140px;
  display: block;
}
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>
