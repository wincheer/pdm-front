<template>
  <section>
      <!--项目工具条-->
      <el-col :span='24' class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true">
          <el-form-item label="我的项目："> 
              <el-select v-model="selectedProjectId" placeholder="请选择项目" style="width:150px">
                <el-option v-for="item in myProjects" :key="item.projectId" :label="item.projectName" :value="item.projectId" />
              </el-select>
          </el-form-item>
          <el-form-item label="快速定位：">
              <el-cascader v-model="selectedFolderId" :props="{value:'id'}" :options="folderTree" change-on-select></el-cascader>
          </el-form-item>
          <el-form-item>
              <el-button icon="upload" type="primary" @click.native="uploadFormVisible = true" v-if="isUploadloadAllow">上传</el-button>
          </el-form-item>
          <el-form-item>
              <el-button icon="search" type="success" @click.native="searchFormVisible = true">文档查询</el-button>
          </el-form-item>
			  </el-form>
      </el-col>
      <!--项目目录列表-->
      <el-col>
          <el-card v-for="(o, index) in folderList" :key="index" :body-style="{ padding: '0px'}" :style="{ width: '140px', float:'left',margin:'15px'}">
              <img src="../../assets/folder.png" class="image" @dblclick="intoFolder(o)"/>
              <div style="padding: 5px;" >
                  <span>{{o.label}}</span>
              </div>
          </el-card>
          <el-card v-for="(doc, index) in documentList" :key="index" :body-style="{ padding: '0px'}" :style="{ width: '140px', float:'left',margin:'15px'}">
              <img src="../../assets/document.png" class="image" @dblclick="intoDocument(doc)"/>
              <div style="padding: 5px;" >
                  <el-tooltip :content="doc.documentName" effect="light">
                    <span>{{doc.documentName.substr(0,9)}}</span>
                  </el-tooltip>
              </div>
          </el-card>
      </el-col>
      <!--文件上传对话框-->
      <el-dialog title="上传文件" v-model="uploadFormVisible" :close-on-click-modal="false" size="tiny">
        <el-upload
            ref="upload"
            action="http://localhost:8080/upload"
            :on-change="onChange"
            :before-upload="beforeUpload"
            :on-success="onSuccess"
            :auto-upload="false"
            :multiple="true"
            :data="uploadParams">
            <el-button slot="trigger" type="primary">选取文件</el-button>
            <el-button icon="upload2" style="margin-left: 10px;" type="success" @click="submitUpload">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">单个文件最大不得超过100M。</div>
        </el-upload>
      </el-dialog>
      <!--文档操作对话框-->
      <el-dialog :title="selectedDocument.documentName" v-model="documentFormVisible" :close-on-click-modal="false" size="tiny">
        <el-table :data="docVerList" highlight-current-row  v-loading="loading" border style="width: 100%;">
          <el-table-column prop="version" label="版本" sortable width="200"></el-table-column>
			    <el-table-column prop="upload_employee" label="上传用户" sortable width="150"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- <el-button size="small"  @click="handlePreview(scope.$index, scope.row)" icon="edit">预览</el-button> -->
              <!-- fa fa-fontawesome的icon名称，比如下面例子中，icon名字是cloud-download -->
              <el-button type="danger" size="small" @click="handleDownload(scope.$index, scope.row)" class="fa fa-cloud-download">下载</el-button>
            </template>
			    </el-table-column>
		    </el-table>
      </el-dialog>
      <!--文档搜索对话框-->
      <el-dialog title="文档搜索" v-model="searchFormVisible" :close-on-click-modal="false" size="small">
        <el-col :span='24' class="toolbar" style="padding-bottom: 0px;">
          <el-form :inline="true" :model="filter">
              <el-form-item>
                  <el-input v-model="filter.docName" placeholder="文档名" @keyup.enter.native="queryDocs"></el-input>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="queryDocs" icon="search">查询</el-button>
              </el-form-item>
          </el-form>
        </el-col>
        <el-table :data="docSearchList" highlight-current-row  v-loading="loading" border style="width: 100%;">
          <el-table-column prop="documentName" label="文件名"></el-table-column>
			    <!-- <el-table-column prop="projectId" label="项目" sortable></el-table-column> -->
          <el-table-column prop="folderName" label="路径" ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="small"  @click="intoDocument(scope.row)" icon="edit">版本详情</el-button>
            </template>
			    </el-table-column>
		    </el-table>
      </el-dialog>
  </section>
</template>

<script>
import {
  queryMyProjectList,
  queryFolderList,
  queryDocmentList,
  queryDocumentVersionList,
  downloadFile,
  searchDocmentList,
  queryEmployeeProjectList
} from "../../config/api";
import SparkMD5 from "spark-md5";

export default {
  data() {
    return {
      loginUser: {},
      employeeProjectList: [],
      isUploadloadAllow: false,
      loading: false,
      myProjects: [],
      selectedProjectId: "",
      folderTree: [],
      folderList: [],
      selectedFolderId: [],
      documentList: [],
      docVerList: [],
      selectedDocument: {},
      selectedDocVersion: {},
      uploadParams: {
        docName: "",
        docMd5: "",
        projectId: "",
        folderId: "",
        employeeId: ""
      },
      uploadFormVisible: false,
      documentFormVisible: false,
      searchFormVisible: false,
      filter: { docName: "", scope: "" },
      docSearchList: []
    };
  },
  watch: {
    selectedProjectId: function(val) {
      //构建项目目录树
      let para = { projectId: this.selectedProjectId };
      this.uploadParams.projectId = this.selectedProjectId;
      queryFolderList(para).then(res => {
        this.folderTree = res.data;
        this.selectedFolderId = [this.folderTree[0].id];
      });
    },
    selectedFolderId: function(val) {
      this.folderList = [];
      var _folderId = this.selectedFolderId[this.selectedFolderId.length - 1];
      this.uploadParams.folderId = _folderId;
      for (var i = 0; i < this.folderTree.length; i++) {
        var node = this.folderTree[i];
        if (node.parentId == _folderId) {
          this.folderList.push(node);
        } else {
          this.findChildren(node, _folderId);
        }
      }
      this.queryFolderDocs(_folderId);
    }
  },
  methods: {
    findChildren: function(node, folder_id) {
      if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
          var _node = node.children[i];
          if (_node.parentId == folder_id) {
            this.folderList.push(_node);
          } else {
            this.findChildren(_node, folder_id);
          }
        }
      }
    },
    findNode: function(tree, folder_id) {
      for (var i = 0; i < tree.length; i++) {
        if (tree[i].id == folder_id) {
          return tree[i];
        } else {
          if (tree[i].children) {
            this.findNode(node.children, folder_id);
          }
        }
      }
    },
    queryFolderDocs(fid) {
      //获取当前目录下的文档
      let param = { folderId: fid };
      queryDocmentList(param).then(res => {
        this.documentList = res.data;
      });
    },
    formatPath: function(row, column) {
      var fullPath;
      var node = this.findNode(this.folderTree, row.folderId);
      return node;
    },
    queryMyProjects: function() {
      let param = { employeeId: this.loginUser.employeeId };
      queryMyProjectList(param).then(res => {
        this.myProjects = res.data;
        this.selectedProjectId = this.myProjects[0].projectId;
      });
    },
    queryDocVersions: function() {
      let param = { documentId: this.selectedDocument.documentId };
      queryDocumentVersionList(param).then(res => {
        this.docVerList = res.data;
      });
    },
    intoFolder: function(folder) {
      this.selectedFolderId.push(folder.id);
    },
    intoDocument: function(document) {
      this.selectedDocument = document;
      this.documentFormVisible = true;
      this.queryDocVersions();
    },
    onChange: function(file, fileList) {
      for (var j = 0; j < fileList.length; j++) {
        var _fo = fileList[j];
        if (_fo.status == "ready") {
          var _this = this;
          var spark = new SparkMD5();
          var fileReader = new FileReader();
          fileReader.readAsBinaryString(file.raw);
          //第一次（选取后），状态为ready,第二次（上传）之前是uploading，之后是success
          fileReader.onload = function(e) {
            spark.appendBinary(e.target.result);
            var md5 = spark.end();
            for (var i = 0; i < fileList.length; i++) {
              var fo = fileList[i];
              if (fo.name == file.name) {
                if (typeof fo.md5 == "undefined") {
                  _this.$set(fo, "md5", md5);
                } else {
                  fo.md5 = md5;
                }
                break;
              }
            }
          };
        }
      }
    },
    beforeUpload: function(file) {
      var uploadFileList = this.$refs.upload.$data.uploadFiles;
      for (var i = 0; i < uploadFileList.length; i++) {
        var fo = uploadFileList[i];
        if (fo.name == file.name) {
          this.uploadParams.docName = fo.name;
          this.uploadParams.docMd5 = fo.md5;
          break;
        }
      }
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    onSuccess: function(res, file) {
      //刷新当前目录
      var _folderId = this.selectedFolderId[this.selectedFolderId.length - 1];
      this.queryFolderDocs(_folderId);
    },
    handlePreview: function(index, row) {},
    handleDownload: function(index, row) {
      let param = { fileId: row.file_id };
      downloadFile(param).then(res => {
        let blob = new Blob([res.data], { type: "application/octet-stream" });
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = this.selectedDocument.documentName;
        document.body.appendChild(link);
        link.click();
      });
    },
    queryDocs: function() {
      let param = {
        documentName: this.filter.docName,
        employeeId: this.loginUser.employeeId,
        projectId: this.selectedProjectId
      };
      searchDocmentList(param).then(res => {
        this.docSearchList = res;
      });
    },
    queryEmployeeProjects: function() {
      let param = {
        employeeId: this.loginUser.employeeId
      };
      queryEmployeeProjectList(param).then(res => {
        this.employeeProjectList = res.data;
        this.checkUploadAllow();
      });
    },
    checkUploadAllow: function() {
      var result = false;
      for (var i = 0; i < this.employeeProjectList.length; i++) {
        var ep = this.employeeProjectList[i];
        if(ep.projectId==this.selectedProjectId){
          result = (4 - ep.roleId) > 0;
          break;
        }
      }
      this.isUploadloadAllow = result;
    }
  },
  mounted() {
    var user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      this.loginUser = user;
      this.uploadParams.employeeId = user.employeeId;
      this.queryMyProjects();
      this.queryEmployeeProjects();
    }
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
