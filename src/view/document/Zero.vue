<template>
    <div class="panel admin-panel">
        <div class="panel-head" id="add"><strong><span class="el-icon-edit"></span><span class="title">上传数据</span></strong></div>
        <div class="body-content">
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="form uploadform">
                <el-form-item label="部门" prop="name">
                    <el-select v-model="form.type" placeholder="请选择" style="width: 135px">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>

                    <el-upload
                            class="upload-demo"
                            ref="upload"
                            action="http://localhost:8080/upload"
                            :on-change="handleChange"
                            :before-upload="beforeAvatarUpload"
                            :file-list="fileList"
                            :auto-upload = 'false'
                            :on-success = 'handleSuccess'
                            :data="form">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                    </el-upload>

                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import SparkMD5 from "spark-md5";

export default {
  data() {
    return {
      options: [
        {
          value: "1",
          label: "帅哥部"
        },
        {
          value: "2",
          label: "美女部"
        }
      ],
      fileName: "",
      fileList: [],
      ruleForm: {
        // name: '',
        isShow: "0"
      },
      form: {
        type: "1",
        fname: "",
        md5: ""
      }
    };
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit();
    },

    beforeAvatarUpload(file) {
      //this.form.fname = file.name;
      var uploadFileList = this.$refs.upload.$data.uploadFiles;
      for (var i = 0; i < uploadFileList.length; i++) {
        var fo = uploadFileList[i];
        if (fo.name == file.name) {
          this.form.fname = fo.name;
          this.form.md5 = fo.md5;
          break;
        }
      }
    },
    handleSuccess(res, file, fileList) {
      //clearFiles();
    },
    handleChange(file, fileList) {
      if (fileList[0].status == "ready") {
        var _this = this;
        var spark = new SparkMD5();
        var fileReader = new FileReader();
        fileReader.readAsBinaryString(file.raw);
        fileReader.onload = function(e) {
          spark.appendBinary(e.target.result);
          //_this.fileList = fileList.slice(-3);
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
  }
};
</script>
<style scope>
input[type="file"] {
  display: none;
}
.el-upload-list {
  width: 200px;
}
.el-select {
  width: 135px;
}
</style>