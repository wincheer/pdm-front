<template>
    <section>
        <!--项目工具条-->
        <el-col :span='24' class="toolbar" style="padding-bottom: 10px;">
            <el-button type="primary" icon="document" @click.native="projectFormVisible = true">新建项目</el-button>
        </el-col>
        <!--项目列表-->
        <el-col>
            <el-card v-for="(o, index) in projectList" :key="index" :body-style="{ padding: '0px'}" :style="{ width: '140px', float:'left',margin:'15px'}">
                <img src="../../assets/folder.png" class="image">
                <div style="padding: 5px;">
                    <el-tooltip :content="o.projectDesc" effect="light">
                        <span>{{o.projectName}}</span>
                    </el-tooltip>
                    <div class="bottom clearfix">
                        <time class="time">{{o.createDate}}</time>
                        <el-dropdown trigger="click">
                            <el-button type="info" size="mini">
                                操作<i class="el-icon-caret-bottom el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="openProjectFolders(o)">编辑目录</el-dropdown-item>
                                <el-dropdown-item @click.native="openProjectEmployees(o)">分配项目成员</el-dropdown-item>
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
            <el-form-item label="参考模板：" prop="templateId">
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
        <!-- 编辑目录 -->
        <el-dialog title="编辑目录" v-model="projectFoldersVisible" :close-on-click-modal="false" size="tiny">
          <el-col>
              <el-form>
                <el-form-item>
                  <el-tree 
                      :data="projectFoldList" 
                      :props="defaultProps" 
                      node-key="id" 
                      ref="tree" 
                      default-expand-all 
                      :expand-on-click-node="false"
                      :render-content="renderContent">
                  </el-tree>
                </el-form-item>
              </el-form>
          </el-col>
          <div slot="footer" class="dialog-footer">
              <el-button @click.native="projectFoldersVisible = false">关闭</el-button>
          </div>
        </el-dialog>
        <!--添加 Tree 节点的界面-->
        <el-dialog :title="addFormTitle" v-model="addFormVisible" :close-on-click-modal="false" size="tiny">
          <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
            <el-form-item label="目录名：" prop="templateFolderName">
              <el-input v-model="addForm.folderName" style="width:90%"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="addFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="saveFolder" :loading="loading">提交</el-button>
          </div>
        </el-dialog>
        <!-- 分配项目成员 -->
        <el-dialog title="分配项目组成员" v-model="assignMemberVisible" :close-on-click-modal="false" size="tiny">
          <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            {{selectedProject.projectName}}
            <el-button type="primary" @click="handleAdd" icon="plus"></el-button>
          </el-col>
          <el-table :data="projectEmployeeList" highlight-current-row  v-loading="loading" border style="width: 100%;">
            <el-table-column prop="employeeId" label="用户名" width="120" :formatter="formatEmployee"></el-table-column>
            <el-table-column prop="roleId" label="角色" width="180" :formatter="formatRole"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="small"  @click="handleEdit(scope.$index, scope.row)" icon="edit"></el-button>
                <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)" icon="delete"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
        <!--编辑项目组成员-->
        <el-dialog :title="editFormTitle" v-model="editFormVisible" :close-on-click-modal="false" size="tiny">
          <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
            <el-form-item label="用户：" prop="employeeId">
              <el-select v-model="editForm.employeeId" placeholder="请选择">
                  <el-option v-for="item in employeeList" :key="item.employeeId" :label="item.displayName" :value="item.employeeId">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="角色：" prop="roleId">
              <el-select v-model="editForm.roleId" placeholder="请选择">
                  <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId">
                  </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="editFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="saveSubmit" :loading="loading">提交</el-button>
          </div>
        </el-dialog>
    </section>  
</template>

<script>
import {
  queryProjectPageList,
  insertProject,
  queryTemplateList,
  queryFolderList,
  insertFolder,
  removeFolder,
  queryProjectEmployeeList,
  queryEmployeeList,
  editProjectEmployee,
  removeProjectEmployee
} from "../../config/api";
export default {
  data() {
    return {
      loading: false,
      //新建项目
      projectFormVisible: false,
      templateList: [],
      projectForm: {
        projectName: "",
        projectDesc: "",
        templateId: null,
        createDate: null
      },
      projectFormRules: {
        projectName: [{ required: true, message: "请输入目录名", trigger: "blur" }]
        //templateId: [{ required: true, message: "请选择项目模板", trigger: "change" }]
      },
      //项目列表
      projectList: [],
      selectedProject: {},
      projectFoldList: [],
      projectFoldersVisible: false,
      defaultProps: {
        children: "children",
        label: "label"
      },
      //新增目录
      addFormTitle: "",
      addFormVisible: false,
      addForm: {
        projectId: -1,
        folderName: "",
        dolderDesc: "",
        parentFolderId: -1
      },
      addFormRules: {
        folderName: [{ required: true, message: "请输入目录名", trigger: "blur" }]
      },
      //分配项目组成员
      assignMemberVisible:false,
      projectEmployeeList:[],
      //更新项目组成员
      roleList: [
        {
          roleId: 1,
          roleName: "系统管理员"
        },
        {
          roleId: 2,
          roleName: "项目管理员"
        },
        {
          roleId: 3,
          roleName: "项目成员"
        },
        {
          roleId: 4,
          roleName: "普通用户"
        }
      ],
      editFormTitle:'',
      employeeList:[],
      editFormVisible:false,
      editForm:{
        projectId:null,
        employeeId:null,
        roleId:null
      },
      editFormRules: {
        //employeeId: [{ required: true, message: "请选择用户", trigger: "blur" }],
        //roleId: [{ required: true, message: "请选择用户的角色", trigger: "blur" }]
      },
    };
  },
  methods: {
    queryProjects: function() {
      let param = {
        pageNo: 1,
        pageSize: 1000000,
        filter: {}
      };
      queryProjectPageList(param).then(res => {
        this.projectList = res;
        this.loading = false;
      });
    },
    queryTemplates: function() {
      queryTemplateList().then(res => {
        this.templateList = res.data;
        this.loading = false;
      });
    },
    queryEmployees: function() {
      queryEmployeeList().then(res => {
        this.employeeList = res.data;
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
            this.queryProjects();
          });
        }
      });
    },
    queryProjectFolders: function() {
      let para = { projectId: this.selectedProject.projectId };
      queryFolderList(para).then(res => {
        this.projectFoldList = res.data;
      });
    },
    queryProjectEmployees: function() {
      let para = { projectId: this.selectedProject.projectId };
      queryProjectEmployeeList(para).then(res => {
        this.projectEmployeeList = res.data;
      });
    },
    openProjectFolders(row) {
      this.selectedProject = row;
      this.queryProjectFolders();
      this.projectFoldersVisible = true;
    },
    openProjectEmployees(row) {
      this.selectedProject = row;
      this.queryProjectEmployees();
      this.queryEmployees();
      this.assignMemberVisible = true;
    },
    openAddFolder( data, location) {
      this.addFormVisible = true;
      this.addFormTitle = location == "son" ? data.label+"新增子目录" : data.label+"新增同级目录";
      //填充目录树节点数据
      this.addForm = {
        projectId: data.ownerId,
        folderName: "",
        parentFolderId: location == "son" ? data.id : data.parentId
      };
    },
    saveFolder() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.loading = true;
          let para = Object.assign({}, this.addForm);
          insertFolder(para).then(res => {
            this.loading = false;
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.addFormVisible = false;
            this.queryProjectFolders();
          });
        }
      });
    },
    removeFolder(data) {
      this.$confirm("确认删除 【" + data.label + "】 目录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.loading = true;
        let para = { folderId: data.id };
        removeFolder(para).then(res => {
          this.loading = false;
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.queryProjectFolders();
        });
      });
    },
    renderContent(h, { node, data, store }) {
      if (data.children) {
        return (
          <span>
            <span>
              <span>{node.label}</span>
            </span>
            <span style="float: right; margin-right: 20px">
              <el-button
                size="mini"
                on-click={() => this.openAddForm(data, "brother")}
                icon="plus"
              >
                添加兄弟
              </el-button>
              <el-button
                size="mini"
                on-click={() => this.openAddForm(data, "son")}
                icon="plus"
              >
                添加儿子
              </el-button>
            </span>
          </span>
        );
      } else {
        return (
          <span>
            <span>
              <span>{node.label}</span>
            </span>
            <span style="float: right; margin-right: 20px">
              <el-button
                size="mini"
                on-click={() => this.openAddFolder( data, "brother")}
                icon="plus"
              >
                添加兄弟
              </el-button>
              <el-button
                size="mini"
                on-click={() => this.openAddFolder( data, "son")}
                icon="plus"
              >
                添加儿子
              </el-button>
              <el-button
                size="mini"
                type="danger"
                on-click={() => this.removeFolder(data)}
                icon="delete"
              >
                删除
              </el-button>
            </span>
          </span>
        );
      }
    },
    handleAdd(){
      this.editFormVisible = true;
      this.editFormTitle = "新增项目成员";
      this.editForm = {
        employeeId: null,
        projectId: this.selectedProject.projectId,
        roleId: null
      };
    },
    saveSubmit(){
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.loading = true;
          let para = Object.assign({}, this.editForm);
          editProjectEmployee(para).then(res => {
            this.loading = false;
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.editFormVisible = false;
            this.queryProjectEmployees();
          });
        }
      });
    },
    handleEdit(index, row){
      this.editFormVisible = true;
      this.editFormTitle = "编辑项目成员";
      this.editForm = Object.assign({}, row);
      //editForm.projectId =  this.selectedProject.projectId;
    },
    handleDel(index, row){
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let para = { employeeProjectId: row.employeeProjectId };
          removeProjectEmployee(para).then(res => {
            this.listLoading = false;
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.queryProjectEmployees();
          });
        })
        .catch(() => {});
    },
    formatRole: function(row, column) {
      var role_name;
      for (var index in this.roleList) {
        if (this.roleList[index].roleId == row.roleId) {
          role_name = this.roleList[index].roleName;
          break;
        }
      }
      return role_name;
    },
    formatEmployee: function(row, column) {
      var displayName;
      for (var index in this.employeeList) {
        if (this.employeeList[index].employeeId == row.employeeId) {
          displayName = this.employeeList[index].displayName;
          break;
        }
      }
      return displayName;
    },

  },
  mounted() {
    this.queryTemplates();
    this.queryProjects();
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
