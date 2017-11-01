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
              <el-upload 
                  ref="upload"
                  action="http://localhost:8080/upload" 
                  :show-file-list="false"
                  :auto-upload="false"
                  :data="uploadParams" 
                  :on-success="handleSuccessUpload" 
                  :on-change="foo">
                <el-button icon="upload2" type="primary" slot="trigger">上传</el-button>
              </el-upload>
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
  </section>
</template>

<script>
import { queryMyProjectList, queryFolderList } from "../../config/api";
import SparkMD5 from "spark-md5";

export default {
  data() {
    return {
      loginUser: "",
      loading: false,
      myProjects: [],
      selectedProjectId: "",
      folderTree: [],
      folderList: [],
      selectedFolderId: [],
      uploadParams: {},
      fileMd5: ""
    };
  },
  watch: {
    selectedProjectId: function(val) {
      //构建项目目录树
      let para = { projectId: this.selectedProjectId };
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
      for (var i = 0; i < this.folderTree.length; i++) {
        var node = this.folderTree[i];
        if (node.parentId == _folderId) {
          this.folderList.push(node);
        } else {
          this.findChildren(node, _folderId);
        }
      }
    },
    fileMd5: function(val) {
      // this.$message(val);
      // this.uploadParams = { fileMd5: val };
      // this.$refs.upload.submit();
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
    beforeUpload: function(fileObj, fileList) {
      var _this = this;
      var blobSlice =
          File.prototype.slice ||
          File.prototype.mozSlice ||
          File.prototype.webkitSlice,
        file = fileObj.raw,
        chunkSize = 100 * 1024 * 1024, // Read in chunks of 100MB
        chunks = Math.ceil(file.size / chunkSize),
        currentChunk = 0,
        spark = new SparkMD5.ArrayBuffer(),
        fileReader = new FileReader();

      fileReader.onload = function(e) {
        spark.append(e.target.result); // Append array buffer
        currentChunk++;

        if (currentChunk < chunks) {
          loadNext();
        } else {
          _this.fileMd5 = spark.end();
        }
      };

      fileReader.onerror = function() {
        console.warn("oops, something went wrong.");
      };

      function loadNext() {
        var start = currentChunk * chunkSize,
          end = start + chunkSize >= file.size ? file.size : start + chunkSize;
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
      }

      loadNext();
    },
    foo: function(fileObj, fileList) {
      var _this = this;
      var fileReader = new FileReader();
      var spark = new SparkMD5.ArrayBuffer();

      fileReader.readAsArrayBuffer(fileObj.raw);
      fileReader.onload = function(e) {
        spark.append(e.target.result);
        _this.fileMd5 = spark.end();

        //this.$message(val);
        _this.uploadParams = { fileMd5: '1234567890' };
        _this.$refs.upload.submit();

      };

      
    },
    handleSuccessUpload: function(res, file) {
      //刷新当前目录
    },
    getFildMd5: function(file) {}
  },
  mounted() {
    var user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      this.loginUser = user;
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
