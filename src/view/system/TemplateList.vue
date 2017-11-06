<template>
    <section>
        <!--项目模板-->
        <el-col :span='24' class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filter">
                <el-form-item>
                    <el-select v-model="filter.templateId" @change="queryTemplateFolders" placeholder="请选择模板...">
                        <el-option v-for="item in templateList" :key="item.templateId" :label="item.templateName" :value="item.templateId" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="plus" @click.native="tplFormVisible = true"></el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--项目目录与文件(?)-->
        <el-col>
            <el-tree 
                :data="templateFolds" 
                :props="defaultProps" 
                node-key="id" 
                ref="tree" 
                default-expand-all 
                :render-content="renderContent">
            </el-tree>
        </el-col>
        <!--添加 Tree 节点的界面-->
        <el-dialog :title="addFormTitle" v-model="addFormVisible" :close-on-click-modal="false" >
          <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
            <el-form-item label="目录名：" prop="templateFolderName">
              <el-input v-model="addForm.templateFolderName" style="width:90%"></el-input>
            </el-form-item>
            <el-form-item label="目录描述：" prop="templateFolderDesc">
              <el-input v-model="addForm.templateFolderDesc" style="width:90%"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="addFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="saveTemplateFolder" :loading="addLoading">提交</el-button>
          </div>
        </el-dialog>
        <!--添加模板的界面-->
        <el-dialog title="新建模板" v-model="tplFormVisible" :close-on-click-modal="false" size="tiny">
          <el-form :model="addTplForm" label-width="100px" :rules="addTplFormRules" ref="addTplForm">
            <el-form-item label="模板名称：" prop="templateName">
              <el-input v-model="addTplForm.templateName" style="width:90%"></el-input>
            </el-form-item>
            <el-form-item label="描述：" prop="templateDesc">
              <el-input v-model="addTplForm.templateDesc" style="width:90%"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="tplFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="saveTemplate" :loading="addLoading">提交</el-button>
          </div>
        </el-dialog>
    </section>
</template>

<script>
import {
  queryTemplateList,
  queryTemplateFolderList,
  insertTemplateFolder,
  removeTemplateFolder,
  insertTemplate
} from "../../config/api";
export default {
  data() {
    return {
      //工具条数据
      filter: {
        templateId: null
      },
      listLoading: true,
      templateList: [],
      //目录树数据
      templateFolds: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      //添加目录树节点数据
      addFormVisible: false,
      addFormTitle: "",
      addLoading: false,
      addForm: {
        templateId: -1,
        templateFolderName: "",
        templateFolderDesc: "",
        parentTemplateFolderId: -1
      },
      addFormRules: {
        templateFolderName: [
          { required: true, message: "请输入目录名", trigger: "blur" }
        ]
      },
      tplFormVisible:false,
      addTplForm:{
        templateName: "",
        templateDesc: "",
        isDelete: 0
      },
      addTplFormRules: {
        templateName: [
          { required: true, message: "请输入模板名称", trigger: "blur" }
        ]
      },
    };
  },
  methods: {
    queryTemplates: function() {
      queryTemplateList().then(res => {
        this.templateList = res.data;
        this.listLoading = false;
        //this.filter.templateId = this.templateList[0];
      });
    },
    queryTemplateFolders: function() {
      let para = { templateId: this.filter.templateId };
      queryTemplateFolderList(para).then(res => {
        this.templateFolds = res.data;
        this.listLoading = false;
      });
    },

    openAddForm(data, location) {
      this.addFormVisible = true;
      this.addFormTitle = location == "son" ? "新增子目录" : "新增同级目录";
      //填充目录树节点数据
      this.addForm = {
        templateId: data.ownerId,
        templateFolderName: "",
        templateFolderDesc: "",
        parentTemplateFolderId: location == "son" ? data.id : data.parentId
      };
    },
    saveTemplateFolder() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.addLoading = true;
          let para = Object.assign({}, this.addForm);
          insertTemplateFolder(para).then(res => {
            this.addLoading = false;
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.addFormVisible = false;
            this.queryTemplateFolders();
          });
        }
      });
    },
    saveTemplate(){
      this.$refs.addTplForm.validate(valid => {
        if (valid) {
          this.addLoading = true;
          let para = Object.assign({}, this.addTplForm);
          insertTemplate(para).then(res => {
            this.addLoading = false;
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.tplFormVisible = false;
            this.queryTemplates();
          });
        }
      });
    },
    remove(data) {
      this.$confirm("确认删除 【"+data.label+"】 目录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.addLoading = true;
        let para = { templateFolderId: data.id };
        removeTemplateFolder(para).then(res => {
          this.addLoading = false;
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.queryTemplateFolders();
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
              <el-button
                size="mini"
                type="danger"
                on-click={() => this.remove(data)}
                icon="delete"
              >
                删除
              </el-button>
            </span>
          </span>
        );
      }
    }
  },
  mounted() {
    this.queryTemplates();
  }
};
</script>

<style scoped>

</style>
