<template>
  <section>
      <!--项目工具条-->
      <el-col :span='24' class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true">
          <el-form-item label="我的项目："> 
              <el-select v-model="selectedProjectId" placeholder="请选择项目">
                <el-option v-for="item in myProjects" :key="item.projectId" :label="item.projectName" :value="item.projectId" />
              </el-select>
          </el-form-item>
          <el-form-item label="快速定位：">
              <el-cascader v-model="selectedFolderId" :props="{value:'id'}" :options="folderTree" change-on-select></el-cascader>
          </el-form-item>
          <el-form-item>
              <el-button icon="upload2" type="primary" @click.native="uploadFormVisible = true">上传</el-button>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" icon="view">预览</el-button>
          </el-form-item>
			  </el-form>
      </el-col>
      <!--项目目录列表-->
      <el-col>
          <el-card v-for="(o, index) in folderList" :key="index" :body-style="{ padding: '0px'}" :style="{ width: '140px', float:'left',margin:'15px'}">
              <img src="../../assets/folder.jpg" class="image" @dblclick="intoFolder(o)"/>
              <div style="padding: 5px;" >
                  <span>{{o.label}}</span>
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
            :auto-upload="false"
            :multiple="true"
            :data="uploadParams">
            <el-button slot="trigger" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" type="success" @click="submitUpload">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">单个文件最大不得超过100M。</div>
        </el-upload>
      </el-dialog>
  </section>
</template>

<script>
import { queryMyProjectList, queryFolderList } from "../../config/api";
import SparkMD5 from "spark-md5";

export default {
  data() {
    return {
      loginUser: {},
      loading: false,
      myProjects: [],
      selectedProjectId: "",
      folderTree: [],
      folderList: [],
      selectedFolderId: [],
      uploadParams: {
        docName:'',
        docMd5:'',
        projectId:'',
        folderId:'',
        employeeId:''
      },
      uploadFormVisible: false
    };
  },
  watch: {
    selectedProjectId: function(val) {
      //构建项目目录树
      let para = { projectId: this.selectedProjectId };
      this.uploadParams.projectId = this.selectedProjectId;
      queryFolderList(para).then(res => {
        this.folderTree = res.data;
        //b--
        var p_root = [
          {
            id: 0,
            parentId: null,
            label: "根目录",
            ownerId: this.selectedProjectId,
            children: this.folderTree
          }
        ];
        this.folderTree = p_root;
        //e--
        this.selectedFolderId = [0];
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
    queryMyProjects: function() {
      let param = { employeeId: this.loginUser.employeeId };
      queryMyProjectList(param).then(res => {
        this.myProjects = res.data;
      });
    },
    intoFolder: function(folder) {
      this.selectedFolderId.push(folder.id);
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
    }
  },
  mounted() {
    var user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      this.loginUser = user;
      this.uploadParams.employeeId = user.employeeId;
      this.queryMyProjects();
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
