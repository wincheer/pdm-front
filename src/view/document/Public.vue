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
              <el-button type="primary" icon="upload2" @click.native="uploadFormVisible = true">上传</el-button>
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
                    <span>{{o.label +'|' +o.id}}</span>
                </div>
            </el-card>
        </el-col>
  </section>
</template>

<script>
import { queryMyProjectList, queryFolderList } from "../../config/api";
export default {
  data() {
    return {
      loginUser: "",
      loading: false,
      uploadFormVisible: false,
      myProjects: [],
      selectedProjectId: "",
      folderTree: [],
      folderList: [],
      selectedFolderId: []
    };
  },
  watch: {
    selectedProjectId: function(val) {
      //构建项目目录树
      let para = { projectId: this.selectedProjectId };
      queryFolderList(para).then(res => {
        this.folderTree = res.data;
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
    }
  },
  methods: {
    findFather(folder) {
      this.selectedFolderId.unshift(folder.parentId);
      if (folder.parentId != 0) {
        var _folder = this.findNode(folder.parentId, this.folderTree);
        this.findFather(_folder);
      }
    },
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
    findNode(folder_id, tree) {
      for (var i = 0; i < tree.length; i++) {
        var node = tree[i];
        if ((node.id = folder_id)) {
          return node;
        } else {
          this.findNode(folder_id, node);
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
      //this.selectedFolderId = [];
      //this.selectedFolderId.unshift(folder.id);
      this.selectedFolderId.push(folder.id);
      //this.findFather(folder);
      //this.selectedFolderId = [4,6];
    }
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
